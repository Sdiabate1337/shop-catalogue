-- Migration pour supporter plusieurs images par produit
-- Créer une table séparée pour les images de produits

CREATE TABLE images_produit (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    produit_id UUID NOT NULL REFERENCES produits(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    ordre INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX idx_images_produit_produit_id ON images_produit(produit_id);
CREATE INDEX idx_images_produit_ordre ON images_produit(produit_id, ordre);

-- Activer RLS
ALTER TABLE images_produit ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour images_produit
CREATE POLICY "Public can view product images" ON images_produit
    FOR SELECT USING (true);

CREATE POLICY "Users can manage images of their own products" ON images_produit
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM produits p
            JOIN catalogues c ON p.catalogue_id = c.id
            JOIN vendeurs v ON c.vendeur_id = v.id
            WHERE p.id = images_produit.produit_id
            AND v.user_id = auth.uid()
        )
    );

-- Migrer les images existantes depuis la colonne image_url
INSERT INTO images_produit (produit_id, image_url, ordre)
SELECT id, image_url, 0
FROM produits 
WHERE image_url IS NOT NULL AND image_url != '';
