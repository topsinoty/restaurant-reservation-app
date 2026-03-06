# Restaurant Reservation System - Frontend

Next.js frontend for the CGI internship assignment. This app lets a guest search for available tables, view recommendations on a floor plan, and book a selected table through a Spring Boot API.

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- React Hook Form + Zod

## Implemented Requirements

### 1) Search and Filtering

The UI supports these filters:

- Date
- Time
- Party size
- Zone (`CENTER`, `CORNER`, `OUTDOOR`)
- Preferences:
  - Quiet / private
  - Window-side
  - Kids area nearby
  - Romantic
  - Great view

### 2) Table Recommendation and Selection Logic

- Availability and ranking are requested from backend endpoint:
- all available results are visually marked as recommended
- first ranked result is highlighted as the best table
- user can click a free table directly on the floor plan

### 3) Visual Floor Plan

- Tables are shown on a fixed hall layout grid.
- Occupied tables are visually distinct.
- Recommended tables are highlighted in blue.
- Best recommendation is highlighted in gold.
- Selected table is highlighted in black.

### Random Occupancy Demo State

- Before filters are submitted, the floor plan shows a demo occupancy state generated randomly in the frontend.
- After filters are submitted, occupancy and recommendations come from the backend search result.

### Booking Flow

- User selects a table on the floor plan.
- `POST /api/reservations/book` is sent with table id, date, time, and party size.
- On success, a booking id is shown and availability is refreshed.

## Project Structure

- `app/` - Next.js app router pages and global styles
- `components/layout/` - floor plan, reservation form, reservation client flow
- `lib/reservation-api.ts` - API calls to backend
- `types/` - shared frontend types for tables and reservations

## Run Locally

## 1. Start backend

Backend setup is in `../backend/README.md`.
Default API base URL expected by frontend is `http://localhost:8080`.

## 2. Install dependencies and run frontend

```bash
pnpm install
pnpm dev
```

Open: `http://localhost:3000`

## Configuration

Set custom backend base URL in `.env.local` if needed:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## Quality Checks

```bash
pnpm lint
pnpm build
```

## Assumptions and Limitations

- Reservation duration is handled by backend and currently fixed to 2 hours.
- No separate accessibility enum was defined in backend features, so other available preference tags are used.
- Admin table-layout editing is not implemented.
- Multi-table merge suggestions for very large groups are not implemented.
- Automated frontend test coverage is not implemented yet.

## Sources and Attribution

- UI foundation: shadcn/ui components
- Documentation references:
  - Next.js docs
  - React Hook Form docs
  - Zod docs

If you used larger snippets from external sources, StackOverflow, or AI tools, list them here before submission.

## Submission Notes

- Total time spent: 23h
- Main challenges:
  - Layout Rendering logic
    I started with a grid and later moved to an absolute position rendering
- How challenges were solved:
  - Trial and error and checking what looked better
- Unresolved issues and planned fixes:
  - I dont like the UI
