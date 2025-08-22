# Notes App Frontend (React)

Modern, minimalistic light-themed UI for managing personal notes. Features a top navigation bar, category sidebar, and main content area for browsing and editing notes.

## Features

- Create, edit, delete notes
- View list of notes with categories
- Global search and category filter
- Clean, responsive, and accessible UI
- Environment-based backend API configuration

## Environment

Copy `.env.example` to `.env` and set:

```
REACT_APP_API_BASE_URL=http://localhost:4000
```

Do not include a trailing slash. If omitted, the app will call the same origin.

## Backend Contract

This UI expects these endpoints:
- GET    /notes
- POST   /notes
- PUT    /notes/:id
- DELETE /notes/:id

Notes should include fields similar to:
```
{
  "id": "string",
  "title": "string",
  "content": "string",
  "category": "Personal|Work|Ideas|Archive|Uncategorized",
  "tags": ["string", ...],
  "createdAt": "ISO date",
  "updatedAt": "ISO date"
}
```

## Scripts

- `npm start` - Run development server
- `npm test` - Run tests
- `npm run build` - Production build

## Design

Color palette:
- Primary: #1976d2
- Secondary: #424242
- Accent: #ffca28

The UI is implemented with vanilla CSS (no external UI libs) in `src/App.css`.
