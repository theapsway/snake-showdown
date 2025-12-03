# Snake Showdown Backend

## Setup (First Time Only)

Install dependencies using `uv`:

```bash
cd /workspaces/snake-showdown/backend

# Sync dependencies from pyproject.toml and uv.lock
~/.local/bin/uv sync
```

This will create a virtual environment and install all dependencies.

## Running the Backend

To start the backend server:

```bash
cd /workspaces/snake-showdown/backend

# Run using uv
~/.local/bin/uv run uvicorn snake_showdown.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at:
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

## Quick Start (Copy & Paste)

**First time setup + run:**
```bash
cd /workspaces/snake-showdown/backend && ~/.local/bin/uv sync && ~/.local/bin/uv run uvicorn snake_showdown.main:app --reload --host 0.0.0.0 --port 8000
```

**Subsequent runs:**
```bash
cd /workspaces/snake-showdown/backend && ~/.local/bin/uv run uvicorn snake_showdown.main:app --reload --host 0.0.0.0 --port 8000
```

## Running Tests

```bash
cd /workspaces/snake-showdown/backend
~/.local/bin/uv run pytest
```

## Development

The backend uses:
- **FastAPI** for the web framework
- **Uvicorn** as the ASGI server
- **uv** for dependency management

### Adding Dependencies

```bash
~/.local/bin/uv add <package-name>
```

### Adding Dev Dependencies

```bash
~/.local/bin/uv add --dev <package-name>
```
