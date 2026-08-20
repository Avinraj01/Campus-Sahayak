# Deployment

## Backend

The backend lives in `backend/` and is deployed as a FastAPI application.

- Dependencies: `backend/requirements.txt`
- Render configuration: `backend/render.yaml`
- Application: `backend/server.py`
- Environment template: `backend/.env.example`

Typical local run:

```bash
cd backend
pip install -r requirements.txt
python server.py
```

## Frontend

The frontend lives in `frontend/` and is a React application.

```bash
cd frontend
npm install
npm start
```

## Environment variables

Keep real secrets out of Git. Configure the required backend values through the deployment platform or a local `.env` file. Use `.env.example` files as templates.

## Deployment checks

`backend/deployment_check.py` is a diagnostic utility for checking backend deployment readiness. It is not required to run the application itself.
