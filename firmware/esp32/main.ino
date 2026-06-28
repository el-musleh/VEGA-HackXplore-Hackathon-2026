/*
  Vegas La Vega ESP32 Node Firmware
  Hardware: ESP32 DevKit, Capacitive Soil Sensor v2.0, 4x AA / Li-Ion battery
  Wiring:  GPIO25 -> MOSFET gate (sensor power), GPIO34 -> A0, GPIO35 -> Vbat/2
*/

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ── Configuration ───────────────────────────────────────────────────────────
const char* WIFI_SSID     = "YOUR_SSID";
const char* WIFI_PASSWORD = "YOUR_PASSWORD";
const char* API_ENDPOINT  = "https://your-backend.com/api/telemetry";
const int   NODE_ID       = 1;

const int   SENSOR_PWR_PIN = 25;   // GPIO25 gates sensor VCC
const int   SENSOR_ADC_PIN = 34;   // ADC1_CH6
const int   BAT_ADC_PIN    = 35;   // ADC1_CH7

const int   SLEEP_SECONDS  = 3600; // 1 hour deep sleep
const int   ADC_SAMPLES    = 20;

// ── Helpers ─────────────────────────────────────────────────────────────────
float read_moisture() {
  digitalWrite(SENSOR_PWR_PIN, HIGH);
  delay(50); // let sensor settle

  int values[ADC_SAMPLES];
  for (int i = 0; i < ADC_SAMPLES; i++) {
    values[i] = analogRead(SENSOR_ADC_PIN);
    delay(5);
  }

  // Median filter
  for (int i = 0; i < ADC_SAMPLES - 1; i++) {
    for (int j = i + 1; j < ADC_SAMPLES; j++) {
      if (values[j] < values[i]) {
        int tmp = values[i];
        values[i] = values[j];
        values[j] = tmp;
      }
    }
  }
  int median = values[ADC_SAMPLES / 2];

  digitalWrite(SENSOR_PWR_PIN, LOW);

  // Map 0–4095 to 0–100% (calibrate these values per sensor!)
  float pct = map(median, 1200, 3500, 0, 100);
  return constrain(pct, 0.0, 100.0);
}

float read_battery() {
  int raw = analogRead(BAT_ADC_PIN);
  // Voltage divider 100k/100k -> Vbat/2. ADC ref ~3.3V, 12-bit (4095)
  float vbat = (raw / 4095.0) * 3.3 * 2;
  return vbat;
}

bool post_telemetry(float moisture, float battery) {
  if (WiFi.status() != WL_CONNECTED) return false;

  HTTPClient http;
  http.begin(API_ENDPOINT);
  http.addHeader("Content-Type", "application/json");

  StaticJsonDocument<256> doc;
  doc["node_id"]      = NODE_ID;
  doc["moisture_pct"] = moisture;
  doc["battery_v"]    = battery;

  String payload;
  serializeJson(doc, payload);

  int code = http.POST(payload);
  http.end();
  return code == 201 || code == 200;
}

// ── Setup & Loop ────────────────────────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  pinMode(SENSOR_PWR_PIN, OUTPUT);
  digitalWrite(SENSOR_PWR_PIN, LOW);

  float moisture = read_moisture();
  float battery  = read_battery();

  Serial.printf("[Node %d] Moisture: %.1f%% | Battery: %.2fV\n", NODE_ID, moisture, battery);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - start < 15000) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {
    bool ok = post_telemetry(moisture, battery);
    Serial.println(ok ? "[TX] Success" : "[TX] Failed");
  } else {
    Serial.println("[WiFi] Connection failed, skipping TX");
  }

  Serial.printf("[Sleep] %d seconds\n", SLEEP_SECONDS);
  esp_sleep_enable_timer_wakeup(SLEEP_SECONDS * 1000000ULL);
  esp_deep_sleep_start();
}

void loop() {
  // Never reached — deep sleep resets the device
}
