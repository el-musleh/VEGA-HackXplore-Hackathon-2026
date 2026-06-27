"""Route optimizer: greedy critical-first routing for water trucks."""

from backend.models import get_db


def get_critical_route() -> list[dict]:
    """Return a list of critical trees ordered by moisture (lowest first)."""
    with get_db() as conn:
        rows = conn.execute(
            """
            SELECT id, lat, lon, name, last_moisture, status
            FROM trees
            WHERE status = 'critical' OR last_moisture < 20
            ORDER BY last_moisture ASC
            """
        ).fetchall()
    return [dict(row) for row in rows]
