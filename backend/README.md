# Restaurant Reservation System - Backend

Spring Boot REST API for restaurant table discovery, availability search, recommendation ranking, booking, and cancellation. This service was built for the CGI internship assignment and powers the floor-plan based frontend in the same repository.

## Tech Stack

- Java 25
- Spring Boot 4
- Spring Web MVC
- Spring Data JPA
- Bean Validation
- PostgreSQL for local runtime
- H2 for tests
- Maven Wrapper (`./mvnw`)

## Implemented Functionality

- Seeds a restaurant floor plan when the table repository is empty
- Exposes all restaurant tables with coordinates, capacity, zone, and feature tags
- Searches for available tables by date, time, party size, optional location, and optional preferences
- Ranks matching tables by preference matches first and smallest suitable capacity second
- Creates reservations with overlap protection
- Lists reservations, fetches a reservation by id, and deletes a reservation by id
- Uses a fixed 2-hour reservation duration

## Data Model Summary

### `RestaurantTable`

- `id`
- `capacity`
- `location` (`CENTER`, `CORNER`, `OUTDOOR`)
- `features` (`GREAT_VIEW`, `KIDS_AREA`, `QUIET`, `ROMANTIC`, `BUSY`, `WINDOW_SIDE`)
- `x`, `y` coordinates for floor plan placement

### `Reservation`

- `id`
- `date`
- `time` (start time)
- `endTime` (computed as `time + 2h`)
- `people`
- linked `restaurantTable`

## Recommendation and Availability Rules

A table is considered available when there is no overlapping reservation for that table on the same date.

Overlap rule:

- existing start `< requested end`
- existing end `> requested start`

Search constraints:

- capacity must be `>= requested people`
- location filter is optional
- preferred features are optional
- matching tables are sorted by:
  - number of requested features matched
  - then smallest suitable capacity

## API Endpoints

Base routes:

- Tables: `/api/tables`
- Reservations: `/api/reservations`

### Tables

- `GET /api/tables`
  - Returns all tables with coordinates, capacity, location, and features.

### Reservations

- `GET /api/reservations`
  - Returns all reservations.
- `GET /api/reservations/{id}`
  - Returns one reservation by id.
- `POST /api/reservations/available`
  - Returns ranked available tables for the requested date, time, party size, zone, and preferences.
- `POST /api/reservations/book`
  - Creates a reservation for the chosen table.
- `DELETE /api/reservations/{id}`
  - Cancels a reservation by id.

## Example Payloads

### Search request

```json
{
  "date": "2026-05-06",
  "time": "18:00:00",
  "people": 4,
  "location": "CORNER",
  "preferredFeatures": ["QUIET", "WINDOW_SIDE"]
}
```

### Search response

```json
{
  "success": true,
  "message": "Fetched available tables",
  "data": [
    {
      "id": 12,
      "location": "CORNER",
      "features": ["QUIET", "WINDOW_SIDE"],
      "capacity": 4
    }
  ]
}
```

### Booking request

```json
{
  "tableId": 12,
  "date": "2026-05-06",
  "time": "18:00:00",
  "people": 4
}
```

### Booking response

```json
{
  "success": true,
  "message": "Table #12 has been reserved for 18:00-20:00",
  "data": {
    "id": 7,
    "date": "2026-05-06",
    "time": "18:00:00",
    "people": 4,
    "table": 12
  }
}
```

## Run Locally

### Prerequisites

- Docker
- Java 25

### 1. Start PostgreSQL

From the repository root:

```bash
docker compose up -d
```

### 2. Initialize the schema on a clean database

The current runtime config uses `spring.jpa.hibernate.ddl-auto=validate`, which expects the schema to already exist. On a brand-new local database, run the backend once with schema generation enabled:

```bash
SPRING_JPA_HIBERNATE_DDL_AUTO=create-only ./mvnw spring-boot:run
```

After the schema has been created, stop the application.

### 3. Run the backend normally

```bash
./mvnw spring-boot:run
```

The app seeds table data automatically when the table repository is empty.

### 4. Run tests

```bash
./mvnw test
```

## Configuration

Current runtime configuration in `src/main/resources/application.properties`:

```properties
spring.application.name=Restaurant Reservation System
spring.datasource.name=reservation-db
spring.datasource.generate-unique-name=false
spring.jpa.hibernate.ddl-auto=validate
spring.web.resources.add-mappings=false
```

Tests use the H2 configuration from `src/test/resources/application.properties`.

## Assignment Notes and Limitations

- Swagger / OpenAPI documentation is not implemented. Because of that, this README acts as the API reference.
- Random initial occupied tables are not seeded, so a clean database starts with no reservations.
- Table ranking is intentionally simple and can be improved further.
- There is no database migration setup yet, so a clean PostgreSQL database needs one schema-initialization run before `ddl-auto=validate` works.
- There is no explicit accessibility preference in the current feature model.

## Submission Notes

- Time spent on the backend: about 61 hours
- Main challenges:
  - Learning Spring Boot after receiving the task
  - Understanding Spring conventions and project structure
  - Reworking the reservation model after an early model mistake made the calculations awkward
  - Managing frontend and backend work that started in separate branches
- How those challenges were handled:
  - Official documentation and tutorial videos
  - Looking at similar reservation flows for reference
  - AI-assisted research and debugging support
  - Trial and error while reshaping the project structure and data flow
- Unresolved issues:
  - Swagger / OpenAPI is still missing
  - Ranking logic can be improved further
  - Backend test coverage is still fairly light
  - Database migrations should replace the current first-run schema workaround

## Sources and Attribution

- Spring Boot tutorial references:
  - https://youtu.be/31KTdfRH6nY?si=h1ipJTms2Vw64MUv
  - https://youtu.be/ZZTYQIUd_uY?si=LcCaH03Bae640JUs
- Reservation flow inspiration:
  - https://v2.tableonline.fi/instabook/bookings/2qFamxk/selection?locale=en
  - https://booking.taltech.ee/ruumi-otsing
- AI tools were used for research, debugging guidance, checking implementation direction, and documentation. Final code and decisions were adapted manually to fit this project.
