# Architecture

## Overview

IoTrees — Smart Watering for Urban Trees. Ground-truth sensors, citizen gamification, and a city routing engine.

## Design Decisions

Document major architectural decisions in `docs/decisions/` using the ADR format.

## Modules

### `src/`
React 19 + Vite 8 frontend (Citizen, Enterprise, Admin, Homeowner flows).

### `backend/`
Flask REST API, SQLite models, urgency engine, and route optimizer.

### `firmware/`
ESP32 Arduino/PlatformIO node firmware (deep sleep, ADC, Wi-Fi TX).

## Data Flow

```
ESP32 Node -> Wi-Fi -> backend/api/telemetry -> SQLite
                                |
                                v
                        React frontend (src/)
                                |
                                v
                        Citizen / City / Worker UIs
```

## Technology Stack

React.js, ESP32/Arduino, Python (Flask + SQLite)
