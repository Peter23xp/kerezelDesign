-- Migration pour ajouter la colonne is_visible à la table photos
-- Date: 2025-01-30
-- Description: Ajout de la colonne is_visible pour contrôler la visibilité des photos

-- Ajouter la colonne is_visible à la table photos
ALTER TABLE public.photos 
ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT TRUE;

-- Mettre à jour toutes les photos existantes pour qu'elles soient visibles par défaut
UPDATE public.photos 
SET is_visible = TRUE 
WHERE is_visible IS NULL;

-- Créer un index sur la colonne is_visible pour les performances
CREATE INDEX IF NOT EXISTS idx_photos_is_visible ON public.photos(is_visible) WHERE is_visible = TRUE;

-- Mettre à jour la politique RLS pour utiliser is_visible
DROP POLICY IF EXISTS "Photos visibles publiquement" ON public.photos;
CREATE POLICY "Photos visibles publiquement" ON public.photos
    FOR SELECT USING (is_visible = true);

-- Commentaire sur la colonne
COMMENT ON COLUMN public.photos.is_visible IS 'Contrôle la visibilité de la photo sur le site public';