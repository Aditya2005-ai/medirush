# MediRush database architecture

## Layout

```text
server/
  config/
    db.js                         # singleton Prisma client only
  prisma/
    schema.prisma                 # canonical data model
    migrations/
      20260822000000_initial_schema/
        migration.sql             # generated PostgreSQL DDL
    seed.js                       # idempotent development seed
    init_postgis.sql              # optional PostGIS bootstrap
```

## Operating the database

1. Start Postgres: `docker compose up -d db`
2. Copy `.env.example` to `.env` and configure `DATABASE_URL`.
3. Apply the checked-in migration: `npm run db:migrate`
4. Load development data: `npm run db:seed`

`seed.js` creates ten hospitals, twenty hospital-specialty allocations, and linked department, equipment, infrastructure, and resource rows. Its placeholder passwords are deliberately unusable for real authentication.

## Models

| Area | Models | Purpose |
| --- | --- | --- |
| Identity | `User`, `RefreshToken`, `DeviceToken` | Authentication, authorization roles, session revocation, and push delivery targets. |
| Hospital account | `Hospital`, `HospitalProfile`, `HospitalInfrastructure` | Keeps login identity separate from regulated profile, address/location, licensing, and capacity. |
| Clinical capability | `DoctorSpecialty`, `HospitalDoctor`, `Department`, `HospitalDepartment`, `EquipmentType`, `HospitalEquipment`, `HospitalResource` | Normalized capability catalog and per-hospital availability, including specialization-level doctor counts. |
| user | `user` | A user profile linked one-to-one with a user account, with emergency contact fields separated from authentication. |
| Dispatch | `EmergencyRequest`, `EmergencyRequirement`, `HospitalResponse`, `EmergencyTimeline` | Core dispatch lifecycle, AI-generated requirements, ranked responses, and immutable lifecycle milestones. Only `ACCEPTED` responses should be exposed to the user UI. |
| Communication | `Notification` | Channel, delivery, and read states for hospital and user alerts without embedding provider payloads as JSON. |
| Financial and admission | `Payment`, `QrAdmission` | Gateway-ready payment metadata and expiring QR-based arrival verification. |
| Governance | `ResourceHistory`, `AuditLog` | Capacity changes and security/business actions with actor and timestamp attribution. |

## Scale and integrity decisions

- UUID keys keep identifiers safe across services and future multi-region writes.
- Location is stored as indexed latitude/longitude decimals. Add a PostGIS geography column plus GiST index when radius queries move into the database.
- Lookup catalogs avoid duplicating department, specialty, and equipment names.
- Requests retain selected hospital history with `SET NULL`; operational children use cascade only where removal cannot orphan a clinical record.
- Soft deletion is used for users, hospitals, users, and emergency requests; time-sensitive operational data remains auditable.
- Composite indexes support the dispatch hot paths: hospital availability, emergency state, response ranking/status, and timeline retrieval.
