# MAKE WORK FLOW - Technical Task

This is a monorepo containing a fullstack application built for the MAKE WORK FLOW technical task.

## Project Structure
- `frontend/`: React + TypeScript + Vite, using Tanstack Router and Tanstack Query.
- `backend/`: FastAPI + SQLAlchemy 2, managed with `uv`.
- `docker-compose.yml`: Root compose file for running the frontend, backend, and PostgreSQL database.

## How to Run

The setup is entirely self-contained. You can start by simply running:

```bash
docker compose up --build -d
```

Once the containers are running:
- **Frontend**: Available at `http://localhost:5173`
- **Backend API**: Available at `http://localhost:8000`

> **Note on `.env` file:** I have intentionally committed the `.env` file to this repository. While I am fully aware that this is a security anti-pattern and should never be done in a production environment, I included it here specifically to ensure this setup requires absolutely zero manual configuration and runs seamlessly out of the box for your review.
