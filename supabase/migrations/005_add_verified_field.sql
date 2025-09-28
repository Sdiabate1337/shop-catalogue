-- Add verified field to vendeurs table
-- By default, vendors are not verified (false)

ALTER TABLE vendeurs 
ADD COLUMN verified BOOLEAN DEFAULT false;

-- Add comment to explain the field
COMMENT ON COLUMN vendeurs.verified IS 'Indicates if the vendor account is verified via WhatsApp';
