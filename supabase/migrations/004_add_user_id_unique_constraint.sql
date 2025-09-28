-- Clean up duplicate vendeurs before adding unique constraint
-- Keep only the most recent vendeur for each user_id
DELETE FROM vendeurs 
WHERE id NOT IN (
    SELECT DISTINCT ON (user_id) id 
    FROM vendeurs 
    ORDER BY user_id, created_at DESC
);

-- Add unique constraint on user_id to ensure one shop per user for v1
ALTER TABLE vendeurs ADD CONSTRAINT vendeurs_user_id_unique UNIQUE (user_id);

-- Add comment to explain the constraint
COMMENT ON CONSTRAINT vendeurs_user_id_unique ON vendeurs IS 'Ensures one shop per user for v1';
