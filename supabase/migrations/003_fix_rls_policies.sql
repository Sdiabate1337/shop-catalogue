-- Supprimer les anciennes politiques RLS
DROP POLICY IF EXISTS "Users can view their own vendeur profile" ON vendeurs;
DROP POLICY IF EXISTS "Users can insert their own vendeur profile" ON vendeurs;
DROP POLICY IF EXISTS "Users can update their own vendeur profile" ON vendeurs;

DROP POLICY IF EXISTS "Users can view their own catalogues" ON catalogues;
DROP POLICY IF EXISTS "Users can insert their own catalogues" ON catalogues;
DROP POLICY IF EXISTS "Users can update their own catalogues" ON catalogues;

-- Créer des politiques RLS simplifiées et robustes pour vendeurs
CREATE POLICY "vendeurs_select_policy" ON vendeurs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "vendeurs_insert_policy" ON vendeurs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "vendeurs_update_policy" ON vendeurs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "vendeurs_delete_policy" ON vendeurs
    FOR DELETE USING (auth.uid() = user_id);

-- Créer des politiques RLS pour catalogues
CREATE POLICY "catalogues_select_policy" ON catalogues
    FOR SELECT USING (
        vendeur_id IN (
            SELECT id FROM vendeurs WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "catalogues_insert_policy" ON catalogues
    FOR INSERT WITH CHECK (
        vendeur_id IN (
            SELECT id FROM vendeurs WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "catalogues_update_policy" ON catalogues
    FOR UPDATE USING (
        vendeur_id IN (
            SELECT id FROM vendeurs WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "catalogues_delete_policy" ON catalogues
    FOR DELETE USING (
        vendeur_id IN (
            SELECT id FROM vendeurs WHERE user_id = auth.uid()
        )
    );

-- Les politiques pour produits restent inchangées (déjà correctes)
