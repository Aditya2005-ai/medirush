-- Initialize PostGIS and create basic tables for MediRush
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  phone TEXT UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('user','hospital')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- hospitals
CREATE TABLE IF NOT EXISTS hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  location GEOGRAPHY(POINT,4326) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_hospitals_location ON hospitals USING GIST (location);

-- hospital beds
CREATE TABLE IF NOT EXISTS hospital_beds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID REFERENCES hospitals(id) ON DELETE CASCADE,
  bed_type TEXT NOT NULL,
  total INT DEFAULT 0,
  available INT DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT now()
);

-- emergency requests
CREATE TABLE IF NOT EXISTS emergency_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  radius_meters INT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('searching','assigned','cancelled','completed')) DEFAULT 'searching',
  assigned_hospital_id UUID REFERENCES hospitals(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  assigned_at TIMESTAMPTZ
);

-- hospital notifications
CREATE TABLE IF NOT EXISTS hospital_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  emergency_request_id UUID REFERENCES emergency_requests(id),
  hospital_id UUID REFERENCES hospitals(id),
  status TEXT NOT NULL CHECK (status IN ('notified','accepted','rejected','timeout')) DEFAULT 'notified',
  notified_at TIMESTAMPTZ DEFAULT now(),
  responded_at TIMESTAMPTZ
);

-- devices (for push tokens)
CREATE TABLE IF NOT EXISTS devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  platform TEXT,
  push_token TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT,
  entity_id UUID,
  action TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
