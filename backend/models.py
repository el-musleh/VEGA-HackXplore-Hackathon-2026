"""SQLite database models for trees, telemetry, and watering events."""

import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).with_name("vegas_la_vega.db")


def get_db() -> sqlite3.Connection:
    """Return a connection to the SQLite database."""
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    """Create tables if they do not exist."""
    with get_db() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS trees (
                id INTEGER PRIMARY KEY,
                lat REAL NOT NULL,
                lon REAL NOT NULL,
                name TEXT,
                type TEXT,
                stadtteil TEXT,
                last_moisture REAL,
                status TEXT DEFAULT 'unknown',
                water_required INTEGER DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS telemetry (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                node_id INTEGER NOT NULL,
                moisture_pct REAL NOT NULL,
                battery_v REAL,
                received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS watering_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tree_id INTEGER NOT NULL,
                liters INTEGER,
                citizen_name TEXT,
                watered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            """
        )
