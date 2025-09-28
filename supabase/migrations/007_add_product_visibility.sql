-- Add visible column to produits table for hide/show functionality
ALTER TABLE produits ADD COLUMN visible BOOLEAN DEFAULT TRUE;

-- Create index for better performance when filtering visible products
CREATE INDEX idx_produits_visible ON produits(visible);
