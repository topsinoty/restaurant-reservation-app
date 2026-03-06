# Restaurant Reservation System


## Initial repos

- frontend : https://github.com/topsinoty/restaurant-reservation-frontend
- backend : https://github.com/topsinoty/restaurant-reservation-system
---

Full-stack restaurant reservation app built for the CGI internship assignment.

This repository contains:

- Spring Boot backend API for availability search, recommendation ranking, and booking
- Next.js frontend for filtering, floor-plan table selection, and reservation flow

## Repository Structure

- `backend/` - Spring Boot service
- `frontend/` - Next.js application
- `compose.yaml` - local PostgreSQL container

Detailed docs:

- Backend setup and API details: `backend/README.md`
- Frontend setup and UI behavior: `frontend/README.md`

## Assignment Coverage

Implemented:

- Reservation search with filters (date, time, people, zone, preferences)
- Table recommendation flow backed by ranking logic in API
- Interactive visual floor plan with occupied/recommended/best/selected states
- Booking selected table from UI

Not implemented:

- Admin drag-and-drop table layout editor
- Dynamic table merge for very large groups
- Extended automated test coverage

## Quick Start

## 1. Start PostgreSQL

From repository root:

```bash
docker compose up -d
```

## 2. Run backend

From `backend/`:

```bash
./mvnw spring-boot:run
```

Backend base URL: `http://localhost:8080`

## 3. Run frontend

From `frontend/`:

```bash
pnpm install
pnpm dev
```

Frontend URL: `http://localhost:3000`

## 4. Useful checks

Frontend:

```bash
cd frontend
pnpm lint
pnpm build
```

Backend:

```bash
cd backend
./mvnw test
```

## Notes Before Submission

Fill in actual values in both:

- `frontend/README.md` (time spent, challenges, unresolved parts, references)
- `backend/README.md` (time spent, challenges, unresolved parts, references)
