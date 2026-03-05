# Restaurant Reservation System

A Spring Boot REST API for searching, booking, listing, and cancelling restaurant table reservations.

## Tech Stack

- Java 25 (from `pom.xml`)
- Spring Boot 4.0.3
- Spring Web MVC
- Spring Data JPA
- PostgreSQL
- Maven Wrapper (`./mvnw`)
- Docker Compose (optional, for local Postgres)

## What This Service Does

- Seeds 20 random restaurant tables on startup if no tables exist.
- Finds available tables for a requested date/time/party size.
- Ranks candidate tables by feature match, then by capacity.
- Books a reservation for a specific table if no time overlap exists.
- Lists reservations and retrieves reservation by ID.
- Cancels reservations.

Reservation duration is fixed at **2 hours**.

## Project Structure

```text
.
├── compose.yaml
├── pom.xml
├── src
│   ├── main
│   │   ├── java/com/topsinoty/reservationSystem
│   │   │   ├── MainApplication.java
│   │   │   ├── config/DataInitializer.java
│   │   │   ├── controller/ReservationController.java
│   │   │   ├── dto/
│   │   │   ├── model/
│   │   │   ├── repository/
│   │   │   └── service/ReservationService.java
│   │   └── resources/application.properties
│   └── test/java/com/topsinoty/reservation_system/MainApplicationTests.java
└── mvnw
```

## Domain Model

### `RestaurantTable`

- `id: Long`
- `location: Location` (`CENTER`, `OUTDOOR`, `CORNER`)
- `capacity: int`
- `features: Set<Feature>`
- `reservations: Set<Reservation>`

### `Reservation`

- `id: Long`
- `date: LocalDate`
- `time: LocalTime` (start)
- `endTime: LocalTime` (auto-calculated = start + 2 hours)
- `people: Integer`
- `restaurantTable: RestaurantTable`

### `Feature` enum

- `GREAT_VIEW`, `KIDS_AREA`, `QUIET`, `ROMANTIC`, `BUSY`, `WINDOW_SIDE`

## Availability Rules

A table is considered available for a requested time window if there is **no overlapping reservation** for the same table and date:

- existing reservation start `<` requested end
- existing reservation end `>` requested start

Search endpoint returns tables where:

- table capacity `>= requested people`
- no overlap with requested slot
- optional location filter is satisfied

Results are sorted by:

1. Number of matching preferred features (descending)
2. Table capacity (ascending)

## API

Base path: `/api/reservations`

### 1. List all reservations

- `GET /api/reservations`
- Response: `200 OK`

```json
[
  {
    "id": 1,
    "time": "18:00:00",
    "date": "2026-03-10",
    "people": 4,
    "restaurant_table_id": 7
  }
]
```

### 2. Get reservation by ID

- `GET /api/reservations/{id}`
- Response: `200 OK`

```json
{
  "id": 1,
  "time": "18:00:00",
  "date": "2026-03-10",
  "people": 4,
  "restaurant_table_id": 7
}
```

### 3. Search available tables

- `POST /api/reservations/available`
- Request body:

```json
{
  "date": "2026-03-10",
  "time": "18:00:00",
  "people": 4,
  "preferredFeatures": ["QUIET", "WINDOW_SIDE"],
  "location": "CENTER"
}
```

- Response: `200 OK`

```json
[
  {
    "id": 7,
    "location": "CENTER",
    "features": ["QUIET", "WINDOW_SIDE"],
    "people": 4
  }
]
```

### 4. Book reservation

- `POST /api/reservations/book`
- Request body:

```json
{
  "tableId": 7,
  "date": "2026-03-10",
  "time": "18:00:00",
  "people": 4
}
```

- Response: `201 Created`

```json
{
  "id": 12,
  "date": "2026-03-10",
  "time": "18:00:00",
  "capacity": 4,
  "table": 7
}
```

### 5. Cancel reservation

- `DELETE /api/reservations/cancel/{id}`
- Response: `204 No Content`

## Validation

Current DTO/entity validation includes:

- Booking date must be present or future (`@FutureOrPresent` in booking request).
- Search and booking require non-null `date`, `time`, and positive `people`.
- Reservation entity enforces positive people and future date.

## Local Development

## 1. Start PostgreSQL

```bash
docker compose up -d
```

`compose.yaml` provisions:

- DB: `restaurantDB`
- User: `sa`
- Password: `password`
- Port: `5432`

## 2. Run the app

```bash
./mvnw spring-boot:run
```

The app seeds 20 random tables at startup if the table repository is empty.

## 3. Run tests

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

Notes:

- `ddl-auto=create-only` creates schema but does not update/drop automatically.
- For explicit DB connection settings, add standard `spring.datasource.url`, `spring.datasource.username`, and `spring.datasource.password` entries if needed for your environment.

## Known Gaps / Improvement Areas

- Error handling is currently exception-based without a global `@ControllerAdvice` mapping.
- API response naming is inconsistent in a few DTOs (`capacity` field carries booked people count, and some fields are named `people` where they represent capacity).
- Test coverage is minimal (only context load test).
- `notes.md` indicates this project was built while learning the framework and still has model/design follow-up work.

## Quick cURL Examples

```bash
# search
curl -X POST http://localhost:8080/api/reservations/available \
  -H "Content-Type: application/json" \
  -d '{
    "date":"2026-03-10",
    "time":"18:00:00",
    "people":4,
    "preferredFeatures":["QUIET"],
    "location":"CENTER"
  }'

# book
curl -X POST http://localhost:8080/api/reservations/book \
  -H "Content-Type: application/json" \
  -d '{
    "tableId":7,
    "date":"2026-03-10",
    "time":"18:00:00",
    "people":4
  }'

# list
curl http://localhost:8080/api/reservations

# cancel
curl -X DELETE http://localhost:8080/api/reservations/cancel/12
```
