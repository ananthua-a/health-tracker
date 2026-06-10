
# Calorie Tracker V1

A backend-focused  calorie tracking application built with FastAPI. Users can upload meal images, automatically extract food information using an AI model, fetch nutritional data from USDA FoodData Central, and track daily macronutrients.

---

## Overview

Calorie Tracker V1 focuses primarily on backend engineering concepts rather than UI complexity.

The system combines:

* Authentication and authorization
* REST API development
* Database design
* AI integration
* External API consumption
* Daily nutrition aggregation

The frontend is intentionally lightweight while most of the logic resides inside the backend.

---

## Features

### User Authentication

* User registration
* Secure password hashing with bcrypt
* JWT access tokens
* JWT refresh tokens
* Protected routes

### AI Meal Analysis

Users can upload a meal image and optionally provide extra information such as portion sizes.

The AI model:

* identifies foods
* estimates missing quantities
* normalizes food names

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

### Food Entry Storage

Each analyzed food item is stored in the database and associated with the authenticated user.

### Daily Macro Aggregation

The API calculates daily totals:

* Total calories
* Total protein
* Total carbohydrates
* Total fat

---

## Backend Architecture

```text
Frontend
     ↓
FastAPI
     ↓
AI Service
     ↓
USDA FoodData Central
     ↓
SQLModel + SQLite/PostgreSQL
```

The AI layer is responsible only for identifying foods and quantities.

Nutritional values are retrieved from USDA to provide deterministic and reliable macro calculations.

---

## Tech Stack

### Backend

* FastAPI
* SQLModel
* SQLite/PostgreSQL
* JWT Authentication
* Passlib
* Python

### External Services

* Google Gemini / OpenRouter
* USDA FoodData Central API

### Frontend

* React
* Vite

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

### Daily Nutrition

```text
GET /daily-macros
```

---

## Security

* Password hashing using bcrypt
* JWT access tokens
* Refresh token mechanism
* Protected endpoints
* User-specific food records

---

## Example Workflow

1. User logs in.
2. User uploads a meal image.
3. AI identifies foods and quantities.
4. USDA provides nutritional information.
5. Food entries are stored.
6. Daily totals are calculated.

---

## Project Structure

```text
health-tracker/

main.py
models.py
db.py
security.py
nutrition_service.py
ai_service.py
service.py
config.py
exception.py
```

---

## Future Improvements

### Backend

* Docker support
* Redis caching
* Rate limiting
* Background tasks
* PostgreSQL migrations with Alembic
* Activity tracking integration
* Maintenance calorie calculations

### Infrastructure

* Docker Compose
* AWS deployment
* CI/CD pipeline
* Monitoring and logging

---

## Goal

This project was built primarily to practice backend development, API design, authentication, database interaction, and external service integration using FastAPI.
