-- Migration pour configurer les politiques de stockage
-- Date: 2025-01-29
-- Description: Configuration des politiques RLS pour le bucket photos-bucket

-- ==========================================
-- POLITIQUES DE STOCKAGE POUR PHOTOS-BUCKET
-- ==========================================

-- Politique pour permettre l'upload public (À SÉCURISER EN PRODUCTION)
CREATE POLICY "Permettre upload public photos-bucket" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'photos-bucket');

-- Politique pour permettre la lecture publique
CREATE POLICY "Permettre lecture publique photos-bucket" ON storage.objects
    FOR SELECT USING (bucket_id = 'photos-bucket');

-- Politique pour permettre la suppression publique (pour l'admin)
CREATE POLICY "Permettre suppression publique photos-bucket" ON storage.objects
    FOR DELETE USING (bucket_id = 'photos-bucket');

-- Politique pour permettre la mise à jour publique (pour l'admin)
CREATE POLICY "Permettre mise à jour publique photos-bucket" ON storage.objects
    FOR UPDATE USING (bucket_id = 'photos-bucket');

-- ==========================================
-- VÉRIFICATION
-- ==========================================

-- Vérifier que le bucket existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE id = 'photos-bucket'
    ) THEN
        RAISE NOTICE 'ATTENTION: Le bucket photos-bucket n''existe pas encore. Créez-le via l''interface Supabase Storage.';
    ELSE
        RAISE NOTICE 'Bucket photos-bucket trouvé. Politiques appliquées avec succès.';
    END IF;
END $$;
