---
marp: true
theme: default
paginate: true
---
# Vegas La Vega — Pitch Deck
## Smart Watering for Urban Trees

---

### Slide 1: Title
# Vegas La Vega — The Urban Forestry Ecosystem
**The B2G2C smart canopy platform**
Leveraging ground-truth soil data to optimize city logistics and ignite targeted citizen engagement.

Team: Vegas La Vega (Khaled Salama, Mohammad El-Musleh, Ragini Mishra, Vamsi Tungala)
Hackathon: VEGA Challenge — Karlsruhe

---

### Slide 2: The Problem
- Karlsruhe has **88,000+ public trees**. Young ones need **100–300 L/week**.
- Water trucks follow **static paper routes** — no live soil data.
- Citizens want to help but have **zero visibility** into which trees actually need water.
- Result: wasted fuel, wasted water, dying trees, and frustrated volunteers.

> *"We are flying blind while our urban canopy burns."*

---

### Slide 3: The Solution
# One Platform: Vegas La Vega
**Ground-truth sensors + Citizen gamification + City routing engine**

1. **Monitor:** ESP32 + capacitive soil sensors measure real root-zone moisture.
2. **Engage:** Citizens see a live "fuel gauge" map and earn rewards for verified watering.
3. **Optimize:** Municipal dashboard routes water trucks to critical trees first.

---

### Slide 4: Architecture
```
Edge (ESP32 Node)     ->    Hub (Wi-Fi / MQTT)    ->    Core (Cloud API + SQLite)
     |                                                    |
     +-- Capacitive sensor                                +-- Citizen Map (Leaflet.js)
     +-- Deep sleep (6+ month battery)                    +-- City Dashboard (OR routing)
     +-- Median-filtered ADC readings                     +-- Weather API integration
```

**Trust Boundary:** Sensor-to-cloud TLS + anomaly detection flags stale/corrupt nodes.

---

### Slide 5: Workflow
1. ESP32 wakes every hour → reads soil moisture → transmits to cloud.
2. Backend combines live data + 48h weather forecast → assigns urgency tier.
3. Citizen opens map → sees red tree nearby → waters it.
4. Sensor verifies moisture spike → citizen earns points → tree drops off city route.

---

### Slide 6: Technical Differentiators
| Pillar | Implementation |
|---|---|
| **No Corrosion** | Capacitive sensor (not resistive) — no exposed metal in soil |
| **6-Month Battery** | ESP32 deep sleep + GPIO-gated sensor power |
| **Ground Truth** | Berlin's *Gieß den Kiez* relies on blind citizen clicks; we verify with hardware |
| **Predictive** | Open-Meteo weather fusion prevents watering before rain |
| **Cost** | **€15 per node** vs. €200+ industrial sensors |

---

### Slide 7: Role-Based Access
| User | View | Action |
|---|---|---|
| **Citizen** | Map with urgency markers, tree profiles, leaderboard | Adopt tree, log watering, share badges |
| **City Supervisor** | Fleet triage map, hotspot aggregation, OR route panel | Optimize daily routes, export reports |
| **Field Worker** | Tablet UI: next stop, target liters, method, root-tank gauge | Mark task complete, verify with sensor |

---

### Slide 8: Roadmap
| Phase | Milestone |
|---|---|
| **Identity** (Now) | Working ESP32 prototype + citizen/city dashboards |
| **Compliance** (Month 2) | Karlsruhe Baumkataster API integration, GDPR compliance |
| **Infrastructure** (Month 4) | LoRaWAN pilot on 50 trees, solar+battery enclosures |
| **Standards** (Month 6) | Open-source node firmware, partner with 2nd German city |

---

### Slide 9: Demo
*Live screen recording or hardware demo*
- ESP32 transmitting moisture data
- Map updating from red → green after simulated watering
- City dashboard recalculating route in real time

---

### Slide 10: Key Metrics / Proof
| Metric | Source |
|---|---|
| 30–40% water/logistics cost reduction | Sensor-guided irrigation benchmarks (Calgary, Wolfsburg) |
| €15/node BOM cost | ESP32 + capacitive sensor + enclosure |
| 88,000 trees in Karlsruhe alone | Open Data Baumkataster |
| 2M+ km cycled in STADTRADELN | Proof of German civic gamification engagement |

---

### Slide 11: Scalability & Impact
- **Karlsruhe** → pilot with 100 young trees in heat-stress zones.
- **Germany** → 400+ cities with public tree inventories.
- **Global** → any city with drought/heatwave risk and a civic app culture.

**Why now:** EU climate adaptation funding + post-heatwave municipal pressure + cheap ESP32 ecosystem maturity.

---

### Slide 12: Pitch Summary
> We aren't just saving water. We are protecting million-euro urban assets, cutting municipal budgets, and turning climate anxiety into community action.

**Vegas La Vega:** Ground-truth data for cities. Green rewards for citizens. A cooler Karlsruhe for everyone.

---

### Slide 13: Meet the Team
- Khaled Salama — Hardware / Embedded
- Mohammad El-Musleh — Backend / Data
- Ragini Mishra — Frontend / UX
- Vamsi Tungala — Pitch / Business Model

Contact: mohammadmusleh3@gmail.com | https://github.com/el-musleh/VEGA-HackXplore-Hackathon-2026

---

### Slide 14: Thank You / Q&A
**Links:**
- Live Demo: http://localhost:5173
- GitHub: https://github.com/el-musleh/VEGA-HackXplore-Hackathon-2026
- One-Pager QR: [image]

---

## 3-Minute Pitch Script (Timed)

**0:00–0:45 | The Hook**
"Last summer in Karlsruhe, a water truck drove to Kaiserstraße and dumped 200 liters on a tree that a neighbor had already watered that morning. Meanwhile, two streets over, a young linden hit permanent wilting point and died. The city has 88,000 trees. Zero ground-truth data."

**0:45–1:45 | The Solution**
"Vegas La Vega gives every vulnerable tree a voice. A €15 ESP32 node with a capacitive soil sensor wakes once an hour, measures root-zone moisture, and transmits to the cloud. Citizens see a live fuel-gauge map. When they water a tree, the sensor verifies it — turning abstract volunteer effort into verified impact."

**1:45–2:30 | Technical Readiness**
"Unlike Berlin's Gieß den Kiez — which relies on blind citizen clicks — our hardware delivers ground-truth validation. We combine live moisture with 48-hour weather forecasts so the app says: 'Rain is coming, hold off' or 'Heatwave incoming, pre-emptive strike now.' Deep sleep gives us 6-month battery life."

**2:30–3:00 | The Vision**
"For Karlsruhe, this means 30% less water waste and optimized truck routes every morning. For citizens, it means turning concrete tree disks into adoptable, gamified green assets. We aren't just saving water. We are building the Internet of Trees."
