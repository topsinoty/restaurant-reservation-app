# Restaurant Reservation System

Full-stack restaurant reservation prototype built for the CGI suvepraktika assignment. The repository contains a Spring Boot backend and a Next.js frontend for searching availability, recommending tables, visualizing the floor plan, and booking a table.

## Stack Overview

- Backend: Java 25, Spring Boot 4, Spring Data JPA, Bean Validation, PostgreSQL, H2 for tests
- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS 4, React Hook Form, Zod, shadcn/ui
- Tooling: Maven Wrapper, pnpm, Docker Compose

## Repository Structure

- `backend/` - Spring Boot API and business logic
- `frontend/` - Next.js client application
- `compose.yaml` - local PostgreSQL container

Detailed component-level documentation:

- `backend/README.md`
- `frontend/README.md`

## Implemented Scope

- Seeded restaurant floor plan with coordinates, capacities, locations, and feature tags
- Availability search by date, time, party size, zone, and preferred features
- Backend recommendation ranking based on feature matches and smallest suitable capacity
- Floor plan view with neutral, available, occupied, best, and selected table states after a search
- Reservation booking from the selected table
- Reservation listing, lookup, and cancellation endpoints
- Backend unit tests for core service logic

## Core Assignment Check

Covered:

- Search and filtering by date, time, people count, zone, and preferences
- Table recommendation shown directly on the floor plan
- Visual distinction between unavailable tables and the best recommendation after a search
- Booking flow from the UI through the backend API

Missing or partial:

- Swagger / OpenAPI documentation is not implemented in the backend
- Randomly generated already-booked tables on initial app load are not implemented; a clean database starts with free tables until reservations are created
- There is no explicit accessibility preference flag, although other preferences such as quiet, window-side, kids-area, romantic, and great-view are supported

## Assumptions

- The floor plan is the main entry view instead of a schedule view
- One reservation is assigned to one table
- Reservation duration is fixed to 2 hours
- Table positions are seeded from code and treated as static
- Recommendation quality is intentionally simple and still open to refinement

## Quick Start

### Prerequisites

- Docker
- .env file

### Create the env file

Use the `.env.example` as basis

```bash
cat .env.example > .env
```

### Start the full stack

From the repository root:

```bash
docker compose up --build
```

Frontend URL: `http://localhost:3000`

Backend base URL: `http://localhost:8080`

PostgreSQL is still exposed on `localhost:5432` with:

- Database: `restaurantDB`
- User: `sa`
- Password: `supersecret`


The Docker Compose backend uses `SPRING_JPA_HIBERNATE_DDL_AUTO=update`, so a clean PostgreSQL volume is initialized automatically. The database is persisted in the `postgres_data` Docker volume.

The frontend build uses `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080` by default. To point the browser client somewhere else, rebuild with:

```bash
NEXT_PUBLIC_API_BASE_URL=http://your-api-host:8080 docker compose up --build
```

If one of the default host ports is already busy, override the published port:

```bash
FRONTEND_PORT=3001 docker compose up --build
```

## Known Limitations

- Backend table ranking still needs refinement
- Backend Swagger / OpenAPI docs are missing
- Backend test coverage is still limited, and frontend tests are not implemented yet

## Submission Notes

- Approximate total time spent: about 122 hours
- Backend time: about 63 hours
- Frontend time: about 53 hours
- Main challenges:
  - Learning Spring Boot while doing the assignment
  - Reworking the reservation model after an early data-model mistake made the calculations awkward
  - Moving the frontend floor plan from a simple grid to coordinate-based positioning
  - Combining frontend and backend work that started in separate branches
  - Reading Docs and configuring Docker for seamless build
- How those challenges were handled:
  - Official docs and tutorial material
  - Trial and error
  - Looking at similar reservation flows and UI patterns for reference
  - AI-assisted research and debugging support

## Attribution

- Backend references are listed in `backend/README.md`
- Frontend references are listed in `frontend/README.md`
- AI tools were used for research, debugging guidance, and checking implementation direction. Final project-specific code was adapted manually.
