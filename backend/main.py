"""Flask application entry point for Vegas La Vega backend."""

from flask import Flask

from backend.routes import api_bp


def create_app() -> Flask:
    """Create and configure the Flask application."""
    app = Flask(__name__)
    app.register_blueprint(api_bp, url_prefix="/api")
    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, host="0.0.0.0", port=5000)
