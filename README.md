# 🚑 MediRush v2.0 — Emergency Healthcare Platform

Real-time emergency healthcare access with live maps, hospital matching, and bed availability.

## Summary of Findings
The MediRush project faced database connection issues due to mismatched credentials in the `.env` file and `docker-compose.yml`. The following changes were made:

1. **Fixed Credential Mismatch**: Updated `DATABASE_URL` in `.env` to match the PostgreSQL credentials defined in `docker-compose.yml`:
   - From: `postgresql://postgres:Adi@PostGres20@localhost:5432/medirush?schema=public`
   - To: `postgresql://medirush:medirush@localhost:5432/medirush?schema=public`

2. **Aligned Prisma Versions**: Updated both `@prisma/client` and `prisma` CLI to version `7.9.1` in `package.json` to resolve version mismatch issues.

3. **Database Migration and Seeding**: Ran the following commands to reset the database and seed it with initial data:
   ```bash
   npx prisma migrate reset --schema server/prisma/schema.prisma
   npm run db:seed
   ```

4. **End-to-End Verification**: After confirming that the database tables were correctly set up, the server was run, and the SOS functionality was tested successfully.

## Commands to Reproduce
1. Update the `.env` file with correct database credentials:
   ```bash
   DATABASE_URL=postgresql://medirush:medirush@localhost:5432/medirush?schema=public
   ```
2. Align Prisma versions in `package.json`:
   ```json
   "@prisma/client": "^7.9.1",
   "prisma": "7.9.1"
   ```
3. Run the following commands:
   ```bash
   npx prisma migrate reset --schema server/prisma/schema.prisma
   npm run db:seed
   ```
4. Start the server:
   ```bash
   npm run server
   ```
5. Test the SOS functionality by triggering the event from the client.

## Quick Start

```bash
npm install
npm run dev
```
→ **http://localhost:5173**

## Screens

1. **Home** — SOS button, search radius slider
2. **Searching** — Live radar map as hospitals respond (Socket.io)
3. **Hospitals** — Responding hospitals list with ETA & beds
4. **Hospital Detail** — Real OpenStreetMap, route line, bed checker, Google Maps navigation

## Tech
- React 18 + Vite (frontend)
- Node.js + Express + Socket.io (backend)
- Leaflet + OpenStreetMap (maps — no API key needed!)
- Haversine distance calculation
- Real-time WebSocket events

## Map Integration
Uses **Leaflet + OpenStreetMap** (free, no API key required).
The "Confirm & Start Navigation" button opens **Google Maps** with directions.
For production, swap in `@googlemaps/js-api-loader` for turn-by-turn routing.

## Socket Events
| Client → Server | Description |
|---|---|
| `sos_trigger` | Start emergency, broadcast to hospitals |
| `check_bed` | Request bed availability |
| `sos_cancel` | Cancel session |

| Server → Client | Description |
|---|---|
| `hospital_response` | Hospital accepted/declined |
| `bed_response` | Bed availability result |
