-- Add verification fields to vendeurs table
ALTER TABLE vendeurs 
ADD COLUMN whatsapp_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN verification_code TEXT,
ADD COLUMN verification_expires_at TIMESTAMP WITH TIME ZONE;
