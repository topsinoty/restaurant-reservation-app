# Restaurant Reservation System - Backend

Spring Boot REST API for table availability search, recommendation ranking, booking, and cancellation.

## Tech Stack

- Java (configured in `pom.xml`)
- Spring Boot 4
- Spring Web MVC
- Spring Data JPA
- Bean Validation
- PostgreSQL
- Maven Wrapper (`./mvnw`)

## Core Features

- Generates table layout data on startup when database is empty.
- Provides all restaurant tables for floor plan rendering.
- Finds available tables for requested date/time/party size.
- Ranks tables based on fit and preference match.
- Creates bookings with overlap protection.
- Supports reservation listing, lookup by id, and cancellation.
- Reservation slot duration is fixed to 2 hours.

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

For the purpose of fast iteration a hard 2h is considered the duration

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
  "date": "2026-03-10",
  "time": "18:00:00",
  "people": 4,
  "preferredFeatures": ["QUIET", "WINDOW_SIDE"], //optional 
  "location": "CENTER" // optional
}
```

### Book table

```json
{
  "tableId": 7,
  "date": "2026-03-10",
  "time": "18:00:00",
  "people": 4
}
```

## Local Setup

## 1. Start PostgreSQL

From repository root (folder that contains `compose.yaml`):

```bash
docker compose up -d
```

## 2. Run backend

From `backend/` folder:

```bash
./mvnw spring-boot:run
```

The app seeds table data if table repository is empty.

## 3. Run checks

```bash
./mvnw test
```

## Configuration

Current `src/main/resources/application.properties`:

```properties
spring.application.name=Restaurant Reservation System
spring.datasource.name=reservation-db
spring.datasource.generate-unique-name=false
spring.jpa.hibernate.ddl-auto=create-only
```

If your local setup needs explicit datasource config, set `spring.datasource.url`, `spring.datasource.username`, and `spring.datasource.password`.

## Known Limitations

- Global exception mapping (`@ControllerAdvice`) is not implemented yet.
- Automated test coverage is minimal.

## Submission Notes

- Total time spent: 42
- Main challenges:
  - Learning spring-Boot
  - Understanding conventions of spring-boot and how to maximally utilize item
  - Flow of the project structure
  - Wrong structure for the project. I started the backend and the frontend in different branches. It made it weird for me.
- How challenges were solved:
  - Watched some videos:
  - Did some research for the structure and other people how had developed similar systems
  - Cross-examined with AI and google searches to see if i was heading in the right direction
  - Used git --allow-unrelated-histories. I couldnt successfully merge all the histories together but the branches are available for anyone interested in seeing the process from the beginning.
  - Information for compilation issues were solved from github gist and everything was easy if you searched it up.

- Unresolved issues/Maybe fixes:
  - Result DTO for the api
  - Weak error handling

## Sources and Attribution
- https://youtu.be/31KTdfRH6nY?si=h1ipJTms2Vw64MUv
- https://youtu.be/ZZTYQIUd_uY?si=LcCaH03Bae640JUs
- https://v2.tableonline.fi/instabook/bookings/2qFamxk/selection?locale=en
