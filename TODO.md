# Implementation Plan - Node.js MySQL API for Real Estate DBMS

## [x] Step 1: Project Setup

- Create package.json ✓
- Create .env template ✓
- Node.js/npm install (user: download from nodejs.org)
- npm install

## [ ] Step 2: Backend Server (server.js)

- Express app port 3000
- MySQL2 pool connection
- Init DB from sql/ files on startup
- API endpoints for all frontend needs
- CORS + static file serving

## [ ] Step 3: Frontend API Integration

- Refactor js/app.js: replace local DB with fetch('/api/\*')

## [ ] Step 4: Test All Functionality

- All nav, buttons, modals, CRUD, charts

**Next user action:** Install Node.js from https://nodejs.org (LTS), restart VSCode terminal, run `npm install`
