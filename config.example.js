// =============================================
// Configuration Supabase pour Kerezel Design
// =============================================

// INSTRUCTIONS :
// 1. Copiez ce fichier et renommez-le en "config.local.js"
// 2. Remplacez les valeurs par vos vraies données Supabase
// 3. Dans supabase.js, importez ces variables au lieu des constantes hardcodées

const SUPABASE_CONFIG = {
    // URL de votre projet Supabase
    // Trouvez cette URL dans : Supabase Dashboard > Settings > API
    url: 'https://votre-projet-id.supabase.co',
    
    // Clé publique anonyme Supabase  
    // Trouvez cette clé dans : Supabase Dashboard > Settings > API > anon public
    anonKey: 'votre-cle-anonyme-publique-ici',
    
    // Configuration du bucket de stockage
    bucketName: 'photos-bucket',
    
    // Limites
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
    
    // Paramètres d'optimisation d'images
    imageOptimization: {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.8,
        autoConvertToWebP: true,
        compressionThreshold: 2 * 1024 * 1024 // 2MB
    }
};

// Configuration du site
const SITE_CONFIG = {
    name: 'Kerezel Design',
    tagline: 'Visual Artist',
    description: 'Photographe et designer graphique professionnel à Goma',
    url: 'https://votre-site.netlify.app',
    email: 'kerezeldesign@gmail.com',
    phone: '+243976854161',
    address: 'Avenue du Lac 123, Goma, RD Congo',
    
    // Réseaux sociaux
    social: {
        instagram: 'https://www.instagram.com/kerezeldesign/',
        facebook: 'https://www.facebook.com/kerezeldesign/',
        twitter: 'https://twitter.com/kerezeldesign',
        whatsapp: 'https://wa.me/243976854161'
    },
    
    // Configuration Formspree pour le formulaire de contact
    formspreeId: 'mjkydypn' // Remplacez par votre propre ID
};

// Analytics et services tiers (optionnel)
const SERVICES_CONFIG = {
    // Google Analytics
    googleAnalyticsId: null, // 'G-XXXXXXXXXX'
    
    // Hotjar (heatmaps)
    hotjarId: null,
    
    // Crisp Chat
    crispWebsiteId: null
};

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SUPABASE_CONFIG,
        SITE_CONFIG,
        SERVICES_CONFIG
    };
}

// Pour utilisation directe dans le navigateur
if (typeof window !== 'undefined') {
    window.CONFIG = {
        SUPABASE_CONFIG,
        SITE_CONFIG,
        SERVICES_CONFIG
    };
}

// =============================================
// Comment utiliser cette configuration
// =============================================

/*
Dans supabase.js, au lieu de :
const SUPABASE_URL = 'EXPO_PUBLIC_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'EXPO_PUBLIC_SUPABASE_ANON_KEY';

Utilisez :
const SUPABASE_URL = SUPABASE_CONFIG.url;
const SUPABASE_ANON_KEY = SUPABASE_CONFIG.anonKey;

Pour les variables d'environnement Netlify :
- Allez dans : Site Settings > Environment variables
- Ajoutez : EXPO_PUBLIC_SUPABASE_URL et EXPO_PUBLIC_SUPABASE_ANON_KEY
- Les valeurs seront automatiquement injectées à la compilation
*/

// =============================================
// Liens utiles
// =============================================

/*
Dashboard Supabase : https://app.supabase.com/
Documentation API : https://supabase.com/docs/reference/javascript/
Netlify Dashboard : https://app.netlify.com/
Formspree Dashboard : https://formspree.io/forms
*/
