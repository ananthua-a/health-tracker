# Health Tracker Frontend

This folder contains a separate frontend for the existing backend in the repository. It does not modify or interfere with the backend code.

## Setup

1. Open a terminal and navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend server:
   ```bash
   npm start
   ```

The frontend will run at `http://localhost:3000` and proxy API calls to `http://localhost:8000` by default.

## Configuration

- If your backend runs on a different host or port, set the `API_TARGET` environment variable before `npm start`.

Example:
```bash
API_TARGET=http://localhost:8000 npm start
```

## Usage

- Register a new user.
- Login with username and password.
- Upload a meal image and optionally provide a prompt.
- Load today&apos;s macros.

The frontend uses the backend endpoints via `/api/register`, `/api/login`, `/api/analyze-image`, and `/api/daily-macros`.
