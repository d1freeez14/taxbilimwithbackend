-- Initialize database with extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Note: Table modifications will be handled by the backend application
-- This file only contains database initialization extensions

-- Note: Indexes will be created by the backend after tables are created 