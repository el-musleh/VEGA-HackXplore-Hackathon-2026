"""Flask API routes aligned with docs/system-architecture.md."""

from flask import Blueprint, jsonify, request

from backend.models import get_db, init_db
from backend.urgency import recalculate_urgency

api_bp = Blueprint("api", __name__)


@api_bp.route("/health", methods=["GET"])
def health() -> tuple:
    """Health check endpoint."""
    return jsonify({"status": "ok"}), 200


@api_bp.route("/telemetry", methods=["POST"])
def post_telemetry() -> tuple:
    """Ingest sensor data from ESP32 nodes.

    Expected JSON:
        { "node_id": int, "moisture_pct": float, "battery_v": float }
    """
    data = request.get_json(silent=True) or {}
    node_id = data.get("node_id")
    moisture_pct = data.get("moisture_pct")
    battery_v = data.get("battery_v")

    if node_id is None or moisture_pct is None:
        return jsonify({"error": "Missing node_id or moisture_pct"}), 400

    with get_db() as conn:
        conn.execute(
            "INSERT INTO telemetry (node_id, moisture_pct, battery_v) VALUES (?, ?, ?)",
            (node_id, moisture_pct, battery_v),
        )
        conn.execute(
            "UPDATE trees SET last_moisture = ? WHERE id = ?",
            (moisture_pct, node_id),
        )

    recalculate_urgency(node_id)
    return jsonify({"status": "stored"}), 201


@api_bp.route("/trees", methods=["GET"])
def get_trees() -> tuple:
    """Return all trees with current moisture and status."""
    with get_db() as conn:
        rows = conn.execute("SELECT * FROM trees").fetchall()
    return jsonify([dict(row) for row in rows]), 200


@api_bp.route("/trees/<int:tree_id>/water", methods=["POST"])
def water_tree(tree_id: int) -> tuple:
    """Record a citizen watering event.

    Expected JSON:
        { "liters": int, "citizen_name": str }
    """
    data = request.get_json(silent=True) or {}
    liters = data.get("liters", 0)
    citizen_name = data.get("citizen_name", "anonymous")

    with get_db() as conn:
        conn.execute(
            "INSERT INTO watering_events (tree_id, liters, citizen_name) VALUES (?, ?, ?)",
            (tree_id, liters, citizen_name),
        )
        conn.execute(
            "UPDATE trees SET status = 'green' WHERE id = ?",
            (tree_id,),
        )

    return jsonify({"status": "watered", "tree_id": tree_id}), 201


@api_bp.route("/route", methods=["GET"])
def get_route() -> tuple:
    """Return a priority route for water trucks (critical trees first)."""
    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM trees WHERE status = 'critical' OR last_moisture < 20 ORDER BY last_moisture ASC"
        ).fetchall()
    return jsonify([dict(row) for row in rows]), 200


@api_bp.route("/init", methods=["POST"])
def init_database() -> tuple:
    """Initialize the database schema."""
    init_db()
    return jsonify({"status": "initialized"}), 200
