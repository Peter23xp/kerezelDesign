// Configuration de sécurité pour l'administration
// À personnaliser selon vos besoins

const ADMIN_SECURITY_CONFIG = {
    // Identifiants par défaut (À CHANGER EN PRODUCTION !)
    credentials: {
        email: 'admin@kerezeldesign.com',
        password: 'KerezelAdmin2025!', // Mot de passe fort recommandé
        // Ajoutez d'autres comptes admin si nécessaire
        additionalAdmins: [
            // { email: 'admin2@kerezeldesign.com', password: 'MotDePasse2!' }
        ]
    },

    // Configuration de session
    session: {
        timeout: 30 * 60 * 1000, // 30 minutes
        maxAttempts: 5, // Tentatives de connexion max
        lockoutDuration: 15 * 60 * 1000, // 15 minutes de blocage
    },

    // Configuration de sécurité
    security: {
        requireHTTPS: true, // Exiger HTTPS en production
        enableTwoFactor: false, // 2FA (à implémenter si nécessaire)
        logAllActions: true, // Logger toutes les actions admin
        ipWhitelist: [], // Liste d'IP autorisées (vide = toutes autorisées)
    },

    // Configuration des notifications
    notifications: {
        emailOnLogin: true,
        emailOnSuspiciousActivity: true,
        adminEmail: 'admin@kerezeldesign.com',
    },

    // Configuration des fonctionnalités
    features: {
        allowBulkUpload: true,
        allowBulkDelete: true,
        allowDatabaseExport: false, // Sécurité
        allowSystemSettings: false, // Sécurité
    }
};

// Fonction pour valider les identifiants
function validateCredentials(email, password) {
    // Vérifier l'admin principal
    if (email === ADMIN_SECURITY_CONFIG.credentials.email && 
        password === ADMIN_SECURITY_CONFIG.credentials.password) {
        return { valid: true, role: 'admin' };
    }

    // Vérifier les admins supplémentaires
    for (const admin of ADMIN_SECURITY_CONFIG.credentials.additionalAdmins) {
        if (email === admin.email && password === admin.password) {
            return { valid: true, role: 'admin' };
        }
    }

    return { valid: false, role: null };
}

// Fonction pour logger les actions (sécurité)
function logAdminAction(action, details = {}) {
    if (!ADMIN_SECURITY_CONFIG.security.logAllActions) return;

    const logEntry = {
        timestamp: new Date().toISOString(),
        action: action,
        details: details,
        userAgent: navigator.userAgent,
        ip: 'client-side' // En production, récupérer l'IP côté serveur
    };

    console.log('🔒 Admin Action Log:', logEntry);
    
    // En production, envoyer ces logs à un service de monitoring
    // ou les stocker dans Supabase pour audit
}

// Fonction pour vérifier la sécurité
function checkSecurityRequirements() {
    const warnings = [];

    // Vérifier HTTPS
    if (ADMIN_SECURITY_CONFIG.security.requireHTTPS && location.protocol !== 'https:') {
        warnings.push('HTTPS requis pour l\'administration');
    }

    // Vérifier les mots de passe par défaut
    if (ADMIN_SECURITY_CONFIG.credentials.password === 'admin123' || 
        ADMIN_SECURITY_CONFIG.credentials.password === 'password') {
        warnings.push('Mot de passe par défaut détecté - Changez-le immédiatement !');
    }

    // Vérifier la configuration de session
    if (ADMIN_SECURITY_CONFIG.session.timeout > 60 * 60 * 1000) { // Plus d'1h
        warnings.push('Session trop longue - Considérez réduire le timeout');
    }

    return warnings;
}

// Export pour utilisation dans d'autres fichiers
if (typeof window !== 'undefined') {
    window.AdminSecurity = {
        config: ADMIN_SECURITY_CONFIG,
        validateCredentials,
        logAdminAction,
        checkSecurityRequirements
    };
}

// Instructions de sécurité
console.log(`
🔒 CONFIGURATION DE SÉCURITÉ ADMIN

IMPORTANT - À faire avant la mise en production :

1. CHANGEZ LES MOTS DE PASSE PAR DÉFAUT
   - Email: admin@kerezeldesign.com
   - Mot de passe: Changez 'KerezelAdmin2025!' par votre mot de passe

2. ACTIVEZ HTTPS
   - Configurez un certificat SSL sur votre domaine
   - Mettez requireHTTPS: true

3. CONFIGUREZ LA WHITELIST IP (optionnel)
   - Ajoutez vos IP dans ipWhitelist: ['votre.ip.ici']

4. ACTIVEZ LES LOGS DE SÉCURITÉ
   - Surveillez les tentatives de connexion
   - Configurez des alertes pour activité suspecte

5. SAUVEGARDEZ RÉGULIÈREMENT
   - Exportez votre base de données Supabase
   - Sauvegardez vos images

6. MONITORING
   - Surveillez l'utilisation du storage
   - Vérifiez les logs Supabase régulièrement

Pour plus de sécurité, considérez :
- Authentification à deux facteurs (2FA)
- Intégration avec Supabase Auth
- Limitation du taux de requêtes (rate limiting)
- Chiffrement des données sensibles
`);

// Vérifications automatiques
document.addEventListener('DOMContentLoaded', function() {
    const warnings = checkSecurityRequirements();
    if (warnings.length > 0) {
        console.warn('⚠️ AVERTISSEMENTS DE SÉCURITÉ:', warnings);
        
        // Afficher une alerte visuelle en développement
        if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
            warnings.forEach(warning => {
                console.warn('🔒 SÉCURITÉ:', warning);
            });
        }
    }
});
