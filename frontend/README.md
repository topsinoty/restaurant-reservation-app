# Restaurant Reservation System - Frontend

Next.js frontend for the CGI internship assignment. The app lets a guest browse the restaurant floor plan, apply reservation filters, inspect available tables, and submit a booking for a selected table.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- React Hook Form
- Zod
- shadcn/ui components

## Implemented Functionality

- Displays a visual floor plan based on table coordinates from the backend
- Lets the user filter by date, time, party size, zone, and preferred features
- Highlights available, best, selected, and occupied tables after availability has been searched
- Lets the user select a table directly from the floor plan
- Sends a booking request for the selected table
- Shows a booking summary panel for the active search

## UI Behavior

- Table layout data is loaded from `GET /api/tables`
- Availability search is sent to `POST /api/reservations/available`
- Booking is sent to `POST /api/reservations/book`
- Before filters are applied, the floor plan is shown in a neutral state and table selection is disabled
- After filters are applied, occupied, available, and best-table states come from the backend search result
- The booking dialog collects a guest name for the UI flow, but that value is not persisted in the backend yet

## Project Structure

- `app/` - app router entrypoints and global styling
- `components/layout/` - reservation flow, floor plan, and form components
- `components/ui/` - shadcn components
- `lib/` - API helpers, labels, and utility functions
- `types/` - shared frontend types

## Run Locally

### Prerequisites

- Node.js
- pnpm (npm also works)
- Running backend API on `http://localhost:8080` by default

### 1. Install dependencies

```bash
pnpm install
```

or

```bash
npm install
```

### 2. Start the development server

```bash
pnpm dev
```

or

```bash
npm run dev
```

Open `http://localhost:3000`.

## Configuration

Set a custom backend base URL in `.env.local` if needed:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## Quality Checks

```bash
pnpm lint
pnpm build
```

or

```bash
npm run lint
npm run build
```

## Assumptions

- Reservation duration is handled by the backend and is currently fixed to 2 hours
- Table positions are static and come from backend seed data
- Available-table results and the best-table ranking are based on the backend response
- The floor plan is the primary view instead of a time-slot schedule

## Known Limitations

- There is no automated frontend test coverage yet
- UI polish can still be improved
- Randomly generated occupied tables are not shown before a search; the initial view is neutral until availability is requested
- The guest name entered in the booking dialog is not saved yet
- Admin table editing and dynamic multi-table merge suggestions are not implemented yet

## Submission Notes

- Time spent on the frontend: about 53 hours
- Main challenges:
  - Rendering the floor plan in a way that felt readable and interactive
  - Designing something that worked and still felt like my style
  - Moving from a simple grid approach to absolute positioning based on table coordinates
- How those challenges were handled:
  - Trial and error
  - Reviewing documentation and existing UI patterns
  - Adjusting the layout until the interaction flow felt usable
- Unresolved issues:
  - The UI can still be improved visually
  - The best-table ranking is intentionally backend-driven, so frontend behavior depends on backend ranking quality
  - Initial random occupied-table generation from the assignment brief is still missing

## Sources and Attribution

- shadcn/ui for UI component foundations
- https://time.openstatus.dev/
- Official documentation:
  - https://nextjs.org/docs
  - https://react-hook-form.com/
  - https://zod.dev/
- AI tools were used for documentation and code review.