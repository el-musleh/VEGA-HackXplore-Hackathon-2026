"""Urgency engine: combine moisture + weather forecast → tier."""

from backend.models import get_db


def recalculate_urgency(node_id: int) -> None:
    """Recalculate and store the urgency status for a tree.

    Tiers:
        - critical: moisture < 20%
        - warning:  moisture 20–40%
        - ok:       moisture > 40%
    """
    with get_db() as conn:
        row = conn.execute(
            "SELECT last_moisture FROM trees WHERE id = ?", (node_id,)
        ).fetchone()

    if row is None or row["last_moisture"] is None:
        return

    moisture = row["last_moisture"]
    if moisture < 20:
        status = "critical"
    elif moisture < 40:
        status = "warning"
    else:
        status = "ok"

    with get_db() as conn:
        conn.execute(
            "UPDATE trees SET status = ? WHERE id = ?",
            (status, node_id),
        )
