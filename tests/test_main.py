"""Tests for backend.main."""

from backend.main import create_app


def test_app_exists() -> None:
    """Verify Flask app can be created without error."""
    app = create_app()
    assert app is not None
