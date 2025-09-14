-- Migration: Add additional fields to certificates table
-- Date: 2025-09-15

-- Add new columns to certificates table
ALTER TABLE certificates 
ADD COLUMN IF NOT EXISTS title VARCHAR(255),
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS certificate_type VARCHAR(50) DEFAULT 'COMPLETION',
ADD COLUMN IF NOT EXISTS instructor_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS completion_date DATE,
ADD COLUMN IF NOT EXISTS certificate_number VARCHAR(100),
ADD COLUMN IF NOT EXISTS verification_code VARCHAR(50),
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS pdf_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS share_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'ACTIVE',
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Create index for certificate_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_certificates_certificate_number ON certificates(certificate_number);

-- Create index for verification_code for faster lookups
CREATE INDEX IF NOT EXISTS idx_certificates_verification_code ON certificates(verification_code);

-- Create index for status for filtering
CREATE INDEX IF NOT EXISTS idx_certificates_status ON certificates(status);

-- Update existing certificates with default values
UPDATE certificates 
SET 
    title = 'Сертификат о прохождении курса',
    description = 'Данный сертификат подтверждает успешное прохождение курса',
    certificate_type = 'COMPLETION',
    status = 'ACTIVE',
    updated_at = CURRENT_TIMESTAMP
WHERE title IS NULL;

-- Add trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_certificates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_certificates_updated_at
    BEFORE UPDATE ON certificates
    FOR EACH ROW
    EXECUTE FUNCTION update_certificates_updated_at();
