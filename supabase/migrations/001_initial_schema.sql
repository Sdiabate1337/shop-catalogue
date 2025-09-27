-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create vendeurs table
CREATE TABLE vendeurs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nom_boutique TEXT NOT NULL,
    devise TEXT NOT NULL DEFAULT 'XOF',
    whatsapp TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create catalogues table
CREATE TABLE catalogues (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    vendeur_id UUID NOT NULL REFERENCES vendeurs(id) ON DELETE CASCADE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create produits table
CREATE TABLE produits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    catalogue_id UUID NOT NULL REFERENCES catalogues(id) ON DELETE CASCADE,
    nom TEXT NOT NULL,
    description TEXT,
    prix DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_vendeurs_user_id ON vendeurs(user_id);
CREATE INDEX idx_catalogues_vendeur_id ON catalogues(vendeur_id);
CREATE INDEX idx_catalogues_slug ON catalogues(slug);
CREATE INDEX idx_produits_catalogue_id ON produits(catalogue_id);

-- Enable Row Level Security (RLS)
ALTER TABLE vendeurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalogues ENABLE ROW LEVEL SECURITY;
ALTER TABLE produits ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for vendeurs
CREATE POLICY "Users can view their own vendeur profile" ON vendeurs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vendeur profile" ON vendeurs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vendeur profile" ON vendeurs
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for catalogues
CREATE POLICY "Users can view their own catalogues" ON catalogues
    FOR SELECT USING (
        vendeur_id IN (
            SELECT id FROM vendeurs WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can view catalogues for public access" ON catalogues
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own catalogues" ON catalogues
    FOR INSERT WITH CHECK (
        vendeur_id IN (
            SELECT id FROM vendeurs WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own catalogues" ON catalogues
    FOR UPDATE USING (
        vendeur_id IN (
            SELECT id FROM vendeurs WHERE user_id = auth.uid()
        )
    );

-- Create RLS policies for produits
CREATE POLICY "Anyone can view produits for public access" ON produits
    FOR SELECT USING (true);

CREATE POLICY "Users can insert produits in their catalogues" ON produits
    FOR INSERT WITH CHECK (
        catalogue_id IN (
            SELECT c.id FROM catalogues c
            JOIN vendeurs v ON c.vendeur_id = v.id
            WHERE v.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update produits in their catalogues" ON produits
    FOR UPDATE USING (
        catalogue_id IN (
            SELECT c.id FROM catalogues c
            JOIN vendeurs v ON c.vendeur_id = v.id
            WHERE v.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete produits in their catalogues" ON produits
    FOR DELETE USING (
        catalogue_id IN (
            SELECT c.id FROM catalogues c
            JOIN vendeurs v ON c.vendeur_id = v.id
            WHERE v.user_id = auth.uid()
        )
    );
