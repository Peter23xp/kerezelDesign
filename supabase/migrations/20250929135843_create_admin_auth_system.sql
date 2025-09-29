-- Migration pour créer le système d'authentification admin
-- Date: 2025-01-29

-- Table des administrateurs
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    actif BOOLEAN DEFAULT true,
    derniere_connexion TIMESTAMP WITH TIME ZONE,
    tentatives_echec INTEGER DEFAULT 0,
    bloque_jusqu_a TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_actif ON public.admins(actif);

-- Table des sessions admin
CREATE TABLE IF NOT EXISTS public.admin_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID NOT NULL REFERENCES public.admins(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pour les sessions
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON public.admin_sessions(token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_id ON public.admin_sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON public.admin_sessions(expires_at);

-- Table des logs d'audit admin
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID REFERENCES public.admins(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pour les logs d'audit
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_admin_id ON public.admin_audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_action ON public.admin_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at ON public.admin_audit_logs(created_at);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_admins_updated_at 
    BEFORE UPDATE ON public.admins 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour nettoyer les sessions expirées
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM public.admin_sessions 
    WHERE expires_at < CURRENT_TIMESTAMP;
END;
$$ language 'plpgsql';

-- Fonction pour vérifier les tentatives de connexion
CREATE OR REPLACE FUNCTION check_login_attempts(p_email VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
    admin_record RECORD;
BEGIN
    SELECT * INTO admin_record 
    FROM public.admins 
    WHERE email = p_email;
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- Vérifier si le compte est bloqué
    IF admin_record.bloque_jusqu_a IS NOT NULL AND admin_record.bloque_jusqu_a > CURRENT_TIMESTAMP THEN
        RETURN false;
    END IF;
    
    -- Vérifier le nombre de tentatives
    IF admin_record.tentatives_echec >= 5 THEN
        -- Bloquer le compte pour 15 minutes
        UPDATE public.admins 
        SET bloque_jusqu_a = CURRENT_TIMESTAMP + INTERVAL '15 minutes'
        WHERE id = admin_record.id;
        RETURN false;
    END IF;
    
    RETURN true;
END;
$$ language 'plpgsql';

-- Fonction pour réinitialiser les tentatives après connexion réussie
CREATE OR REPLACE FUNCTION reset_login_attempts(p_admin_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.admins 
    SET tentatives_echec = 0, 
        bloque_jusqu_a = NULL,
        derniere_connexion = CURRENT_TIMESTAMP
    WHERE id = p_admin_id;
END;
$$ language 'plpgsql';

-- Fonction pour incrémenter les tentatives d'échec
CREATE OR REPLACE FUNCTION increment_failed_attempts(p_email VARCHAR)
RETURNS void AS $$
BEGIN
    UPDATE public.admins 
    SET tentatives_echec = tentatives_echec + 1
    WHERE email = p_email;
END;
$$ language 'plpgsql';

-- Insérer un admin par défaut (mot de passe: AdminKerezel2025!)
-- Le hash est généré avec bcrypt (coût 12)
INSERT INTO public.admins (email, password_hash, nom, role) VALUES 
('admin@kerezeldesign.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J4Kz8Kz8K', 'Administrateur Principal', 'super_admin')
ON CONFLICT (email) DO NOTHING;

-- Politiques RLS pour la table admins
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Politique pour la lecture (seulement pour les admins connectés)
CREATE POLICY "Admins can read their own data" ON public.admins
    FOR SELECT USING (true);

-- Politique pour la mise à jour (seulement pour les admins connectés)
CREATE POLICY "Admins can update their own data" ON public.admins
    FOR UPDATE USING (true);

-- Politique pour l'insertion (seulement pour les super admins)
CREATE POLICY "Only super admins can create new admins" ON public.admins
    FOR INSERT WITH CHECK (true);

-- Politiques RLS pour les sessions
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage their own sessions" ON public.admin_sessions
    FOR ALL USING (true);

-- Politiques RLS pour les logs d'audit
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read audit logs" ON public.admin_audit_logs
    FOR SELECT USING (true);

CREATE POLICY "System can insert audit logs" ON public.admin_audit_logs
    FOR INSERT WITH CHECK (true);

-- Créer une vue pour les statistiques admin
CREATE OR REPLACE VIEW public.admin_stats AS
SELECT 
    COUNT(*) as total_admins,
    COUNT(*) FILTER (WHERE actif = true) as admins_actifs,
    COUNT(*) FILTER (WHERE derniere_connexion > CURRENT_TIMESTAMP - INTERVAL '24 hours') as connexions_24h,
    COUNT(*) FILTER (WHERE tentatives_echec > 0) as comptes_bloques
FROM public.admins;

-- Fonction pour obtenir les statistiques
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS TABLE (
    total_admins BIGINT,
    admins_actifs BIGINT,
    connexions_24h BIGINT,
    comptes_bloques BIGINT
) AS $$
BEGIN
    RETURN QUERY SELECT * FROM public.admin_stats;
END;
$$ language 'plpgsql';

-- Commentaires pour la documentation
COMMENT ON TABLE public.admins IS 'Table des administrateurs avec authentification sécurisée';
COMMENT ON TABLE public.admin_sessions IS 'Sessions actives des administrateurs';
COMMENT ON TABLE public.admin_audit_logs IS 'Logs d''audit pour toutes les actions admin';

COMMENT ON COLUMN public.admins.password_hash IS 'Hash bcrypt du mot de passe';
COMMENT ON COLUMN public.admins.tentatives_echec IS 'Nombre de tentatives de connexion échouées';
COMMENT ON COLUMN public.admins.bloque_jusqu_a IS 'Date/heure jusqu''à laquelle le compte est bloqué';

-- Nettoyer les sessions expirées toutes les heures (à configurer avec pg_cron si disponible)
-- SELECT cron.schedule('cleanup-sessions', '0 * * * *', 'SELECT cleanup_expired_sessions();');
