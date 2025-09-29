-- ==========================================
-- CONFIGURATION DE LA BASE DE DONNÉES SUPABASE
-- Portfolio Kerezel Design
-- ==========================================

-- Activation de l'extension UUID (si pas déjà activée)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- CRÉATION DES TABLES
-- ==========================================

-- Table des catégories
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des photos
CREATE TABLE IF NOT EXISTS public.photos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT,
    url_image TEXT NOT NULL,
    categorie VARCHAR(50) NOT NULL CHECK (
        categorie IN ('portfolio', 'blog', 'design', 'evenement', 'portrait', 'produit', 'branding')
    ),
    alt_text VARCHAR(255),
    taille_fichier INTEGER,
    format_image VARCHAR(10),
    largeur INTEGER,
    hauteur INTEGER,
    is_featured BOOLEAN DEFAULT FALSE,
    ordre_affichage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des témoignages
CREATE TABLE IF NOT EXISTS public.temoignages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    auteur VARCHAR(100) NOT NULL,
    entreprise VARCHAR(100),
    poste VARCHAR(100),
    message TEXT NOT NULL,
    note INTEGER CHECK (note >= 1 AND note <= 5) DEFAULT 5,
    photo_auteur TEXT,
    is_visible BOOLEAN DEFAULT TRUE,
    ordre_affichage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table des projets détaillés (optionnelle, pour des cas d'usage futurs)
CREATE TABLE IF NOT EXISTS public.projets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description_courte TEXT,
    description_complete TEXT,
    client VARCHAR(100),
    date_realisation DATE,
    technologies TEXT[],
    url_externe TEXT,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table de liaison entre projets et photos
CREATE TABLE IF NOT EXISTS public.projets_photos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    projet_id UUID REFERENCES public.projets(id) ON DELETE CASCADE,
    photo_id UUID REFERENCES public.photos(id) ON DELETE CASCADE,
    is_cover BOOLEAN DEFAULT FALSE,
    ordre INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(projet_id, photo_id)
);

-- ==========================================
-- CRÉATION DES INDEX POUR LES PERFORMANCES
-- ==========================================

-- Index sur les catégories de photos pour les filtres
CREATE INDEX IF NOT EXISTS idx_photos_categorie ON public.photos(categorie);
CREATE INDEX IF NOT EXISTS idx_photos_created_at ON public.photos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_photos_is_featured ON public.photos(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_photos_ordre_affichage ON public.photos(ordre_affichage);

-- Index sur les témoignages
CREATE INDEX IF NOT EXISTS idx_temoignages_is_visible ON public.temoignages(is_visible) WHERE is_visible = TRUE;
CREATE INDEX IF NOT EXISTS idx_temoignages_created_at ON public.temoignages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_temoignages_ordre_affichage ON public.temoignages(ordre_affichage);

-- Index sur les projets
CREATE INDEX IF NOT EXISTS idx_projets_is_visible ON public.projets(is_visible) WHERE is_visible = TRUE;
CREATE INDEX IF NOT EXISTS idx_projets_date_realisation ON public.projets(date_realisation DESC);

-- ==========================================
-- INSERTION DES DONNÉES INITIALES
-- ==========================================

-- Insertion des catégories par défaut
INSERT INTO public.categories (nom, description) VALUES 
    ('Portfolio', 'Photos de portfolio général'),
    ('Blog', 'Photos pour articles de blog'),
    ('Design', 'Travaux de design graphique'),
    ('Événement', 'Photographie d''événements'),
    ('Portrait', 'Photos de portrait studio'),
    ('Produit', 'Photographie de produits'),
    ('Branding', 'Identité visuelle et branding')
ON CONFLICT (nom) DO NOTHING;

-- Insertion de témoignages par défaut (reprenant ceux du site existant)
INSERT INTO public.temoignages (auteur, entreprise, poste, message, note, ordre_affichage) VALUES 
    (
        'Marie Bisengimana', 
        '', 
        'Mariée, Goma',
        'Kerezel a photographié notre mariage et nous sommes absolument ravis du résultat. Les photos sont magnifiques et capturent parfaitement l''émotion de cette journée spéciale. Un vrai professionnel !',
        5,
        1
    ),
    (
        'Jean Kabeya', 
        'Kabeya Solutions', 
        'Directeur',
        'J''ai fait appel à Kerezel pour la création du logo et de l''identité visuelle de mon entreprise. Le résultat est au-delà de mes attentes. Un travail créatif, professionnel et livré dans les délais.',
        5,
        2
    ),
    (
        'Claire Mukeshimana', 
        'GomaTech', 
        'Responsable événementiel',
        'Nous avons engagé Kerezel pour photographier notre conférence annuelle. Les photos sont superbes et ont parfaitement capturé l''essence de notre événement. Très professionnel et facile à travailler avec.',
        5,
        3
    );

-- ==========================================
-- FONCTIONS DE MISE À JOUR AUTOMATIQUE
-- ==========================================

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON public.categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_photos_updated_at 
    BEFORE UPDATE ON public.photos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_temoignages_updated_at 
    BEFORE UPDATE ON public.temoignages 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projets_updated_at 
    BEFORE UPDATE ON public.projets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- CONFIGURATION DE ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Activation de RLS sur toutes les tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.temoignages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projets_photos ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- POLITIQUES RLS - LECTURE PUBLIQUE
-- ==========================================

-- Catégories : lecture publique
CREATE POLICY "Catégories visibles publiquement" ON public.categories
    FOR SELECT USING (true);

-- Photos : lecture publique
CREATE POLICY "Photos visibles publiquement" ON public.photos
    FOR SELECT USING (true);

-- Témoignages : lecture publique (seulement les visibles)
CREATE POLICY "Témoignages visibles publiquement" ON public.temoignages
    FOR SELECT USING (is_visible = true);

-- Projets : lecture publique (seulement les visibles)
CREATE POLICY "Projets visibles publiquement" ON public.projets
    FOR SELECT USING (is_visible = true);

-- Liaison projets-photos : lecture publique
CREATE POLICY "Liaison projets-photos visible publiquement" ON public.projets_photos
    FOR SELECT USING (true);

-- ==========================================
-- POLITIQUES RLS - ÉCRITURE ADMINISTRATEUR
-- ==========================================

-- Note: Ces politiques nécessitent un système d'authentification admin
-- Pour l'instant, elles sont désactivées pour permettre l'insertion depuis le frontend
-- En production, vous devriez créer un rôle admin spécifique

-- Photos : insertion/mise à jour/suppression réservée aux admins
-- CREATE POLICY "Admins peuvent gérer les photos" ON public.photos
--     FOR ALL USING (auth.role() = 'admin');

-- Témoignages : insertion/mise à jour/suppression réservée aux admins  
-- CREATE POLICY "Admins peuvent gérer les témoignages" ON public.temoignages
--     FOR ALL USING (auth.role() = 'admin');

-- Politique temporaire pour permettre toutes les opérations (À SÉCURISER EN PRODUCTION)
CREATE POLICY "Accès complet temporaire - photos" ON public.photos
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Accès complet temporaire - témoignages" ON public.temoignages  
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Accès complet temporaire - catégories" ON public.categories
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Accès complet temporaire - projets" ON public.projets
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Accès complet temporaire - projets_photos" ON public.projets_photos
    FOR ALL USING (true) WITH CHECK (true);

-- ==========================================
-- CONFIGURATION DU BUCKET STORAGE
-- ==========================================

-- NOTE: La création du bucket doit être faite via l'interface Supabase ou via l'API
-- Voici les commandes équivalentes :

/*
-- Créer le bucket photos-bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'photos-bucket',
    'photos-bucket', 
    true,
    52428800, -- 50MB
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
);

-- Politique pour permettre l'upload public (À SÉCURISER EN PRODUCTION)
CREATE POLICY "Permettre upload public" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'photos-bucket');

CREATE POLICY "Permettre lecture publique" ON storage.objects
    FOR SELECT USING (bucket_id = 'photos-bucket');

CREATE POLICY "Permettre suppression publique" ON storage.objects
    FOR DELETE USING (bucket_id = 'photos-bucket');
*/

-- ==========================================
-- VUES UTILES POUR L'AFFICHAGE
-- ==========================================

-- Vue pour les photos avec informations complètes
CREATE OR REPLACE VIEW public.photos_completes AS
SELECT 
    p.*,
    CASE 
        WHEN p.created_at > CURRENT_DATE - INTERVAL '30 days' THEN true 
        ELSE false 
    END as is_recent
FROM public.photos p
ORDER BY p.is_featured DESC, p.ordre_affichage, p.created_at DESC;

-- Vue pour les témoignages visibles triés
CREATE OR REPLACE VIEW public.temoignages_affiches AS
SELECT *
FROM public.temoignages 
WHERE is_visible = true
ORDER BY ordre_affichage, created_at DESC;

-- Vue pour les statistiques du portfolio
CREATE OR REPLACE VIEW public.portfolio_stats AS
SELECT 
    COUNT(*) as total_photos,
    COUNT(*) FILTER (WHERE is_featured) as photos_mises_en_avant,
    COUNT(*) FILTER (WHERE created_at > CURRENT_DATE - INTERVAL '30 days') as photos_recentes,
    COUNT(DISTINCT categorie) as nombre_categories,
    (SELECT COUNT(*) FROM public.temoignages WHERE is_visible = true) as total_temoignages
FROM public.photos;

-- ==========================================
-- COMMENTAIRES FINAUX
-- ==========================================

COMMENT ON TABLE public.categories IS 'Catégories pour organiser les photos';
COMMENT ON TABLE public.photos IS 'Table principale des photos du portfolio';
COMMENT ON TABLE public.temoignages IS 'Témoignages clients affichés sur le site';
COMMENT ON TABLE public.projets IS 'Projets détaillés avec plusieurs photos';
COMMENT ON TABLE public.projets_photos IS 'Liaison many-to-many entre projets et photos';

COMMENT ON COLUMN public.photos.categorie IS 'Doit être: portfolio, blog, design, evenement, portrait, produit, ou branding';
COMMENT ON COLUMN public.temoignages.note IS 'Note sur 5 étoiles (1-5)';
COMMENT ON COLUMN public.photos.is_featured IS 'Si true, la photo sera mise en avant sur la page d''accueil';

-- ==========================================
-- INSTRUCTIONS POST-SETUP
-- ==========================================

/*
INSTRUCTIONS D'INSTALLATION :

1. Copiez ce script dans l'éditeur SQL de votre projet Supabase
2. Exécutez le script pour créer toutes les tables et configurations
3. Créez le bucket 'photos-bucket' via l'interface Supabase Storage :
   - Allez dans Storage → Créer un bucket
   - Nom: photos-bucket  
   - Public: Activé
   - Taille max: 50MB
   - MIME types autorisés: image/jpeg, image/png, image/webp, image/gif

4. Dans votre fichier supabase.js, remplacez :
   - EXPO_PUBLIC_SUPABASE_URL par votre vraie URL Supabase
   - EXPO_PUBLIC_SUPABASE_ANON_KEY par votre vraie clé anonyme

5. SÉCURITÉ EN PRODUCTION :
   - Supprimez les politiques "Accès complet temporaire"
   - Créez un système d'authentification admin
   - Implémentez des politiques RLS plus strictes
   - Limitez les uploads selon vos besoins

6. OPTIMISATION :
   - Configurez un CDN pour les images
   - Ajoutez la compression automatique d'images
   - Surveillez l'utilisation du storage
*/
