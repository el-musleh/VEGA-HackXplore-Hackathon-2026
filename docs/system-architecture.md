# Vegas La Vega System Architecture

## Overview Diagram

```mermaid
flowchart TB
    subgraph Edge["Edge Layer — Per Tree Node"]
        ESP["ESP32 DevKit\nDeep Sleep 1h cycle"]
        PWR["GPIO Power Gate\n(MOSFET / GPIO25)"]
        SENS["Capacitive Soil Sensor v2.0\n(ADC1_CH6 / GPIO34)"]
        BAT["Voltage Divider\n(ADC1_CH7 / GPIO35)"]
        ANT["Wi-Fi Radio\n2.4GHz 802.11b/g/n"]
    end

    subgraph Hub["Hub Layer — Connectivity"]
        WIFI["Public Wi-Fi\nKA-WLAN / Citizen Hotspot"]
        MQTT["MQTT Broker\n(or HTTP REST)"]
    end

    subgraph Core["Core Layer — Cloud Backend"]
        API["Flask REST API\nPython 3 + SQLite"]
        DB[(SQLite DB\nTelemetry + Trees\n+ Watering Events)]
        WAPI["Open-Meteo API\n48h Weather Forecast"]
        LOGIC["Urgency Engine\nMoisture + Weather → Tier"]
        ROUTE["Route Optimizer\nGreedy Critical-First"]
    end

    subgraph Frontend["Frontend Layer — UI"]
        CIT["Citizen Map\nLeaflet.js + Vanilla JS"]
        CITY["Municipal Dashboard\nLeaflet.js + Stats Panel"]
        WORK["Worker Tablet UI\n(Target volume, method, gauge)"]
    end

    subgraph Users["Users & Stakeholders"]
        C["Citizens\n(Adopt / Water / Earn Points)"]
        M["Municipality\n(Gartenbauamt / Fleet)"]
        W["Field Workers\n(Water Truck Drivers)"]
    end

    ESP -->|"Wake → Read ADC"| SENS
    ESP -->|"Gate VCC"| PWR
    ESP -->|"Check Vbat"| BAT
    ESP -->|"JSON POST\n{node_id, moisture, battery}"| ANT
    ANT -->|"HTTPS / MQTT"| WIFI
    WIFI -->|"TLS"| MQTT
    MQTT -->|"Ingest"| API
    API -->|"Store"| DB
    API -->|"Fetch forecast"| WAPI
    DB -->|"Query history"| LOGIC
    LOGIC -->|"Update status"| DB
    DB -->|"Critical list"| ROUTE
    API -->|"GET /api/trees"| CIT
    API -->|"GET /api/route"| CITY
    CIT -->|"Browse / Click / Water"| C
    C -->|"POST /api/trees/{id}/water\n+ liters"| API
    CITY -->|"Optimize / Dispatch"| M
    M -->|"Assign route"| W
    W -->|"Tablet: next stop"| WORK
    WORK -->|"Verify complete\n(sensor moisture spike)"| API
```

---

## Data Flow — Single Watering Cycle

```mermaid
sequenceDiagram
    autonumber
    participant ESP as ESP32 Node
    participant API as Flask Backend
    participant DB as SQLite
    participant WEATHER as Open-Meteo API
    participant CIT as Citizen App
    participant CITY as City Dashboard

    rect rgb(230, 245, 230)
        Note over ESP: Every 1 hour
        ESP->>ESP: Wake from deep sleep
        ESP->>ESP: Power on sensor (GPIO HIGH)
        ESP->>ESP: Sample ADC 20×, take median
        ESP->>ESP: Map raw → moisture %
        ESP->>ESP: Power off sensor (GPIO LOW)
        ESP->>API: POST /api/telemetry<br/>{node_id, moisture_pct, battery_v}
        API->>DB: INSERT telemetry row
        API->>DB: UPDATE trees.last_moisture
        API->>WEATHER: GET forecast (lat, lon)
        API->>API: Recalculate urgency tier
        API->>DB: UPDATE trees.status
    end

    rect rgb(255, 245, 230)
        Note over CIT: Citizen opens map
        CIT->>API: GET /api/trees
        API->>DB: SELECT * FROM trees
        DB-->>API: 5 trees + moisture + status
        API-->>CIT: JSON array
        CIT->>CIT: Render markers (G/Y/O/R)
        CIT->>ESP: (indirect) Citizen sees red tree
    end

    rect rgb(230, 240, 255)
        Note over CIT: Citizen waters tree
        CIT->>API: POST /api/trees/{id}/water<br/>{liters: 20, citizen_name}
        API->>DB: INSERT watering_events
        API->>DB: UPDATE trees.last_moisture (+ bump)
        API->>DB: UPDATE trees.status → green
    end

    rect rgb(255, 230, 230)
        Note over CITY: Morning dispatch
        CITY->>API: GET /api/route
        API->>DB: SELECT critical trees (<20%)
        DB-->>API: Ordered by moisture ASC
        API-->>CITY: Priority route JSON
        CITY->>CITY: Render truck stops
    end
```

---

## Component Interaction Matrix

| From → To | ESP32 | Backend | Citizen UI | City UI | Open-Meteo |
|---|---|---|---|---|---|
| **ESP32** | — | `POST /api/telemetry` | — | — | — |
| **Backend** | — | — | `GET /api/trees` | `GET /api/route` | `GET forecast` |
| **Citizen UI** | — | `POST /water` | — | — | — |
| **City UI** | — | `GET /trees`, `/route` | — | — | — |
| **Open-Meteo** | — | — | — | — | — |

---

## Hardware Wiring Diagram

```mermaid
flowchart LR
    subgraph Enclosure["IP65 Enclosure (2.5m up tree)"]
        ESP["ESP32 DevKit\n3.3V logic"]
        MOSFET["MOSFET / GPIO25\nSensor Power Gate"]
    end

    subgraph Ground["Soil (15–20cm deep)"]
        SENS["Capacitive Sensor v2.0\nA0 → GPIO34"]
    end

    subgraph Power["Battery Pack"]
        BAT["4× AA or Li-Ion\n~4.2V → 3.3V LDO"]
        DIV["Voltage Divider\n100k/100k → GPIO35"]
    end

    BAT -->|"3.3V VCC"| ESP
    ESP -->|"GPIO25 HIGH/LOW"| MOSFET
    MOSFET -->|"3.3V gated"| SENS
    SENS -->|"Analog 0–3.3V"| ESP
    BAT --> DIV
    DIV -->|"Vbat/2"| ESP
    ESP -->|"Wi-Fi 2.4GHz"| ROUTER[(Router / KA-WLAN)]
```

---

## Deployment Topology — Karlsruhe Pilot (100 Nodes)

```mermaid
flowchart TB
    subgraph ZoneA["Südstadt — 25 Nodes"]
        A1["Tree #001<br/>Tilia cordata"]
        A2["Tree #002<br/>Platanus"]
        A3["... 23 more"]
    end

    subgraph ZoneB["Oststadt — 25 Nodes"]
        B1["Tree #026<br/>Acer platanoides"]
        B2["Tree #027<br/>Quercus robur"]
        B3["... 23 more"]
    end

    subgraph ZoneC["Innenstadt — 25 Nodes"]
        C1["Tree #051<br/>Tilia cordata"]
        C2["... 24 more"]
    end

    subgraph ZoneD["Weststadt — 25 Nodes"]
        D1["Tree #076<br/>Acer"]
        D2["... 24 more"]
    end

    A1 & A2 & A3 -->|"Wi-Fi / MQTT"| GW["City Gateway / Backend"]
    B1 & B2 & B3 -->|"Wi-Fi / MQTT"| GW
    C1 & C2 -->|"Wi-Fi / MQTT"| GW
    D1 & D2 -->|"Wi-Fi / MQTT"| GW

    GW -->|"REST API"| CIT["Citizen App"]
    GW -->|"REST API"| DASH["City Dashboard"]
    GW -->|"REST API"| WORK["Worker Tablets"]
```

---

## Legend

| Symbol | Meaning |
|---|---|
| `[]` / `()` | Component / Service |
| `[()]` | Database / Data store |
| `{{ }}` | External API / 3rd party |
| Arrow | Data flow direction |
| Dashed arrow | Indirect / human action |
