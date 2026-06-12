# Health Tracker

A full-stack nutrition tracking application built with FastAPI and React. Users can upload meal images, extract food information using AI, retrieve nutritional data from USDA FoodData Central, and track daily macronutrients.

The project focuses primarily on backend engineering, API design, authentication, database interaction, external service integration, and containerized deployment.

---

## Features

### Authentication

* User registration
* Secure password hashing with bcrypt
* JWT access tokens
* JWT refresh tokens
* Protected routes

### AI Meal Analysis

Users can upload meal images and optionally provide additional context such as portion sizes.

The AI model:

* Identifies foods
* Estimates missing quantities
* Normalizes food names

Example:

```json
{
  "foods": [
    {
      "name": "biryani rice",
      "quantity": 300,
      "unit": "g"
    }
  ]
}
```

### USDA Nutrition Integration

Food names are matched against USDA FoodData Central.

The system calculates:

* Calories
* Protein
* Carbohydrates
* Fat

### Daily Macro Tracking

The API aggregates daily totals:

* Total calories
* Total protein
* Total carbohydrates
* Total fat

### Persistent Storage

Food entries are associated with authenticated users and stored in PostgreSQL.

---

## Architecture

```text
React + Vite
       ↓
FastAPI
       ↓
AI Service
       ↓
USDA FoodData Central
       ↓
PostgreSQL
```

---

## Tech Stack

### Backend

* FastAPI
* SQLModel
* PostgreSQL
* JWT Authentication
* Passlib
* Python

### Frontend

* React
* Vite

### External Services

* Google Gemini / OpenRouter
* USDA FoodData Central API

### Infrastructure

* Docker
* Docker Compose

---

## API Endpoints

### Authentication

```text
POST /register
POST /login
POST /refresh
```

### Meal Analysis

```text
POST /analyze-image
```

### Nutrition

```text
GET /daily-macros
```

---

## Security

* Password hashing with bcrypt
* JWT authentication
* Refresh token mechanism
* Protected endpoints
* User-specific records
* Environment variables isolated from source code

---

## Running with Docker

```bash
docker compose up
```

Backend:

```text
http://localhost:8000/docs
```

Frontend:

```text
http://localhost:5173
```

---

## Project Structure

```text
health-tracker/
│
├── main.py
├── models.py
├── db.py
├── security.py
├── ai_service.py
├── nutrition_service.py
├── service.py
├── config.py
├── exception.py
├── Dockerfile
├── docker-compose.yml
│
├── frontend/
│   ├── src/
│   └── Dockerfile
```

---

## Future Improvements

### Backend

* Redis caching
* Rate limiting
* Background tasks
* WebSockets
* Alembic migrations
* Activity tracking
* Maintenance calorie estimation

### Infrastructure

* Persistent Docker volumes
* Nginx reverse proxy
* CI/CD pipeline
* AWS deployment
* Monitoring and logging

---

## Goal

This project was built to practice backend engineering, authentication, API design, database interaction, AI integration, and modern containerized application development.
