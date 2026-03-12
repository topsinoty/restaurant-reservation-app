# Restaurant Reservation System - Backend

Spring Boot REST API for restaurant table discovery, availability search, booking, and cancellation. This service was built for the CGI internship assignment and is intended to power the floor-plan based frontend in the same repository.

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

- Seeds a static restaurant floor plan when the table repository is empty.
- Exposes all restaurant tables with coordinates, capacity, zone, and feature tags.
- Searches for available tables by date, time, party size, optional location, and optional preferences.
- Creates reservations with overlap protection.
- Lists reservations, fetches a reservation by id, and deletes a reservation by id.
- Uses a fixed 2-hour reservation duration.

## Data Model Summary

### RestaurantTable

- `id`
- `capacity`
- `location` (`CENTER`, `CORNER`, `OUTDOOR`)
- `features` (`GREAT_VIEW`, `KIDS_AREA`, `QUIET`, `ROMANTIC`, `BUSY`, `WINDOW_SIDE`)
- `x`, `y` coordinates for floor plan placement

### Reservation

- `id`
- `date`
- `time` (start)
- `endTime` (auto: `time + 2h`)
- `people`
- linked `restaurantTable`

## Availability Rules

A table is available when there is no overlapping reservation for that table and date.

Overlap condition used in queries:

- existing start `< requested end`
- existing end `> requested start`

For fast iteration a hard 2h is considered the duration of a reservation

Search constraints:

- capacity must be `>= requested people`
- optional location filter
- ranking applied to matching candidates

## API Endpoints

Base routes:

- Tables: `/api/tables`
- Reservations: `/api/reservations`

### Tables

- `GET /api/tables`
  - Returns all tables with coordinates and features.

### Reservations

- `GET /api/reservations`
  - List all reservations.
- `GET /api/reservations/{id}`
  - Get reservation by id.
- `POST /api/reservations/available`
  - Search available and ranked tables.
- `POST /api/reservations/book`
  - Create reservation for selected table.
- `DELETE /api/reservations/cancel/{id}`
  - Cancel reservation.

## Example Request Bodies

### Search availability

```json
{
  "success": true,
  "message": "Fetched available tables",
  "data": [
    {
      "id": 28,
      "location": "OUTDOOR",
      "features": [
        "BUSY",
        "GREAT_VIEW"
      ],
      "capacity": 3
    }
  ]
}
```

### Book table

```json
{
  "success": true,
  "message": "Table #22 has been reserved for 14:00-16:00",
  "data": {
    "id": 7,
    "date": "2026-05-06",
    "time": "14:00:00",
    "people": 3,
    "table": 22
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

The current default runtime config uses `spring.jpa.hibernate.ddl-auto=validate`, which expects the schema to already exist. On a brand-new local database, run the backend once with schema generation enabled:

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
```

Tests use the in-memory H2 configuration from `src/test/resources/application.properties`.

## Known Limitations

- Table ranking still needs refinement.
- There is no migration setup yet, so a clean PostgreSQL database needs one schema-initialization run before `ddl-auto=validate` works.

## Submission Notes

- Time spent on the backend: about 56 hours.
- Main challenges:
  - Learning Spring Boot during the assignment.
  - Understanding Spring conventions and project structure.
  - Getting the reservation model and calculations into a workable shape.
  - Managing frontend and backend work that started in separate branches.
- How those challenges were handled:
  - Official documentation and tutorial videos.
  - Looking at similar reservation flows for reference.
  - AI-assisted research and debugging support.
  - Trial and error while reshaping the project structure and data flow.
- Unresolved issues:
  - Ranking logic can be improved further.
  - Backend test coverage is still very light.
  - Database migrations should replace the current first-run schema workaround.

## Sources and Attribution

- Spring Boot tutorial references:
  - https://youtu.be/31KTdfRH6nY?si=h1ipJTms2Vw64MUv
  - https://youtu.be/ZZTYQIUd_uY?si=LcCaH03Bae640JUs
- Reservation flow inspiration:
  - https://v2.tableonline.fi/instabook/bookings/2qFamxk/selection?locale=en
- AI tools were used for research, debugging guidance, checking implementation direction and documentation. Final 
  code and all decision were adapted manually to fit this project.
