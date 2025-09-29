// Configuration et initialisation Supabase
// Fichier de connexion pour le site portfolio Kerezel Design

// Import de la bibliothèque Supabase
const { createClient } = window.supabase;

// Configuration Supabase
const SUPABASE_URL = 'https://tfoyjidkxmtlcbrvupkz.supabase.co'; // À remplacer par votre URL Supabase
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmb3lqaWRreG10bGNicnZ1cGt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNDU3MTgsImV4cCI6MjA3NDcyMTcxOH0.O21vw7_PesSCp-sUF-Xk2yNNYv215t76fEx5lfib8Zg'; // À remplacer par votre clé anonyme

// Initialisation du client Supabase
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// UTILITAIRES POUR LA BASE DE DONNÉES
// ==========================================

// Gestion des erreurs
function handleSupabaseError(error, operation = 'Opération') {
    console.error(`Erreur ${operation}:`, error);
    showToast(`Erreur lors de ${operation.toLowerCase()}: ${error.message}`, 'error');
}

// Affichage de notifications toast
function showToast(message, type = 'success') {
    // Supprimer tout toast existant
    const existingToast = document.getElementById('toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Créer le nouveau toast
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = `fixed top-20 right-6 z-50 px-6 py-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
    
    if (type === 'success') {
        toast.className += ' bg-green-600 text-white';
    } else if (type === 'error') {
        toast.className += ' bg-red-600 text-white';
    } else {
        toast.className += ' bg-blue-600 text-white';
    }

    toast.innerHTML = `
        <div class="flex items-center space-x-3">
            <i class="ri-${type === 'success' ? 'check' : type === 'error' ? 'error-warning' : 'information'}-line"></i>
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(toast);

    // Animation d'entrée
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 10);

    // Suppression automatique après 5 secondes
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 5000);
}

// ==========================================
// FONCTIONS POUR LES PHOTOS
// ==========================================

// Récupérer toutes les photos
async function getPhotos(categorie = null) {
    try {
        let query = supabaseClient
            .from('photos')
            .select('*')
            .order('created_at', { ascending: false });

        if (categorie && categorie !== 'tout') {
            query = query.eq('categorie', categorie);
        }

        const { data, error } = await query;

        if (error) {
            handleSupabaseError(error, 'récupération des photos');
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Erreur lors de la récupération des photos:', error);
        return [];
    }
}

// Ajouter une nouvelle photo
async function addPhoto(photoData, imageFile) {
    try {
        // 1. Upload de l'image vers le bucket Supabase Storage
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabaseClient.storage
            .from('photos-bucket')
            .upload(fileName, imageFile);

        if (uploadError) {
            handleSupabaseError(uploadError, 'upload de l\'image');
            return { success: false, error: uploadError };
        }

        // 2. Obtenir l'URL publique de l'image
        const { data: { publicUrl } } = supabaseClient.storage
            .from('photos-bucket')
            .getPublicUrl(fileName);

        // 3. Insérer les métadonnées de la photo dans la table photos
        const { data, error } = await supabaseClient
            .from('photos')
            .insert([
                {
                    titre: photoData.titre,
                    description: photoData.description,
                    url_image: publicUrl,
                    categorie: photoData.categorie
                }
            ])
            .select();

        if (error) {
            // Supprimer l'image uploadée en cas d'erreur d'insertion
            await supabaseClient.storage
                .from('photos-bucket')
                .remove([fileName]);
            
            handleSupabaseError(error, 'ajout de la photo');
            return { success: false, error: error };
        }

        showToast('Photo ajoutée avec succès !', 'success');
        return { success: true, data: data[0] };

    } catch (error) {
        console.error('Erreur lors de l\'ajout de la photo:', error);
        handleSupabaseError(error, 'ajout de la photo');
        return { success: false, error: error };
    }
}

// Supprimer une photo
async function deletePhoto(photoId, imageUrl) {
    try {
        // 1. Supprimer l'enregistrement de la base de données
        const { error: dbError } = await supabaseClient
            .from('photos')
            .delete()
            .eq('id', photoId);

        if (dbError) {
            handleSupabaseError(dbError, 'suppression de la photo');
            return { success: false, error: dbError };
        }

        // 2. Supprimer l'image du storage
        if (imageUrl) {
            // Extraire le nom du fichier de l'URL
            const fileName = imageUrl.split('/').pop();
            await supabaseClient.storage
                .from('photos-bucket')
                .remove([fileName]);
        }

        showToast('Photo supprimée avec succès !', 'success');
        return { success: true };

    } catch (error) {
        console.error('Erreur lors de la suppression de la photo:', error);
        handleSupabaseError(error, 'suppression de la photo');
        return { success: false, error: error };
    }
}

// ==========================================
// FONCTIONS POUR LES CATÉGORIES
// ==========================================

// Récupérer toutes les catégories
async function getCategories() {
    try {
        const { data, error } = await supabaseClient
            .from('categories')
            .select('*')
            .order('nom', { ascending: true });

        if (error) {
            handleSupabaseError(error, 'récupération des catégories');
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        return [];
    }
}

// ==========================================
// FONCTIONS POUR LES TÉMOIGNAGES
// ==========================================

// Récupérer tous les témoignages
async function getTemoignages() {
    try {
        const { data, error } = await supabaseClient
            .from('temoignages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            handleSupabaseError(error, 'récupération des témoignages');
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Erreur lors de la récupération des témoignages:', error);
        return [];
    }
}

// Ajouter un nouveau témoignage
async function addTemoignage(temoignageData) {
    try {
        const { data, error } = await supabaseClient
            .from('temoignages')
            .insert([temoignageData])
            .select();

        if (error) {
            handleSupabaseError(error, 'ajout du témoignage');
            return { success: false, error: error };
        }

        showToast('Témoignage ajouté avec succès !', 'success');
        return { success: true, data: data[0] };

    } catch (error) {
        console.error('Erreur lors de l\'ajout du témoignage:', error);
        handleSupabaseError(error, 'ajout du témoignage');
        return { success: false, error: error };
    }
}

// ==========================================
// UTILITAIRES D'IMAGES
// ==========================================

// Conversion d'image en WebP (pour optimisation)
function convertToWebP(file, quality = 0.8) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            canvas.toBlob(resolve, 'image/webp', quality);
        };

        img.src = URL.createObjectURL(file);
    });
}

// Redimensionnement d'image
function resizeImage(file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = function() {
            // Calculer les nouvelles dimensions
            let { width, height } = img;
            
            if (width > height) {
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(resolve, file.type, quality);
        };

        img.src = URL.createObjectURL(file);
    });
}

// Lazy Loading pour les images
function initLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ==========================================
// INITIALISATION
// ==========================================

// Vérifier la connexion Supabase
async function checkSupabaseConnection() {
    try {
        const { data, error } = await supabaseClient
            .from('categories')
            .select('count')
            .limit(1);

        if (error) {
            console.error('Erreur de connexion Supabase:', error);
            return false;
        }

        console.log('✅ Connexion Supabase établie avec succès');
        return true;
    } catch (error) {
        console.error('❌ Impossible de se connecter à Supabase:', error);
        return false;
    }
}

// Initialisation quand le DOM est prêt
document.addEventListener('DOMContentLoaded', async function() {
    // Vérifier la connexion
    const isConnected = await checkSupabaseConnection();
    
    if (isConnected) {
        // Initialiser le lazy loading des images
        initLazyLoading();
        
        console.log('🚀 Supabase initialisé avec succès');
    } else {
        console.warn('⚠️ Problème de connexion Supabase - Vérifiez vos variables d\'environnement');
    }
});

// ==========================================
// AUTHENTIFICATION ADMIN
// ==========================================

// Fonction pour vérifier les identifiants admin
async function authenticateAdmin(email, password) {
    try {
        // Vérifier d'abord si le compte peut se connecter (pas bloqué)
        const { data: checkData, error: checkError } = await supabaseClient
            .rpc('check_login_attempts', { p_email: email });

        if (checkError) {
            console.error('Erreur vérification tentatives:', checkError);
            return { success: false, error: 'Erreur de vérification' };
        }

        if (!checkData) {
            return { success: false, error: 'Compte temporairement bloqué. Réessayez plus tard.' };
        }

        // Récupérer l'admin par email
        const { data: adminData, error: adminError } = await supabaseClient
            .from('admins')
            .select('*')
            .eq('email', email)
            .eq('actif', true)
            .single();

        if (adminError || !adminData) {
            // Incrémenter les tentatives d'échec
            await supabaseClient.rpc('increment_failed_attempts', { p_email: email });
            return { success: false, error: 'Identifiants incorrects' };
        }

        // Vérifier le mot de passe (simulation - en production, utilisez bcrypt)
        const passwordValid = await verifyPassword(password, adminData.password_hash);
        
        if (!passwordValid) {
            // Incrémenter les tentatives d'échec
            await supabaseClient.rpc('increment_failed_attempts', { p_email: email });
            return { success: false, error: 'Identifiants incorrects' };
        }

        // Connexion réussie - réinitialiser les tentatives
        await supabaseClient.rpc('reset_login_attempts', { p_admin_id: adminData.id });

        // Créer une session
        const sessionToken = generateSessionToken();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // Session de 24h

        const { data: sessionData, error: sessionError } = await supabaseClient
            .from('admin_sessions')
            .insert([
                {
                    admin_id: adminData.id,
                    token: sessionToken,
                    expires_at: expiresAt.toISOString(),
                    ip_address: await getClientIP(),
                    user_agent: navigator.userAgent
                }
            ])
            .select();

        if (sessionError) {
            console.error('Erreur création session:', sessionError);
            return { success: false, error: 'Erreur de session' };
        }

        // Logger la connexion réussie
        await logAdminAction(adminData.id, 'login_success', {
            email: email,
            ip: await getClientIP(),
            user_agent: navigator.userAgent
        });

        return {
            success: true,
            data: {
                admin: {
                    id: adminData.id,
                    email: adminData.email,
                    nom: adminData.nom,
                    role: adminData.role
                },
                session: {
                    token: sessionToken,
                    expires_at: expiresAt.toISOString()
                }
            }
        };

    } catch (error) {
        console.error('Erreur authentification:', error);
        return { success: false, error: 'Erreur de connexion' };
    }
}

// Fonction pour vérifier le mot de passe (simulation)
async function verifyPassword(password, hash) {
    // En production, utilisez une vraie vérification bcrypt
    // Pour le développement, nous simulons avec le hash par défaut
    const defaultHash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J4Kz8Kz8K';
    const defaultPassword = 'AdminKerezel2025!';
    
    if (hash === defaultHash && password === defaultPassword) {
        return true;
    }
    
    // Simulation d'autres vérifications
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'salt_kerezel_2025');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    const simulatedHash = `$2b$12$${hashHex.substring(0, 53)}`;
    
    return hash === simulatedHash;
}

// Fonction pour générer un token de session
function generateSessionToken() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Fonction pour obtenir l'IP du client (simulation)
async function getClientIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        return '127.0.0.1'; // IP locale par défaut
    }
}

// Fonction pour vérifier la validité d'une session
async function validateSession(sessionToken) {
    try {
        const { data, error } = await supabaseClient
            .from('admin_sessions')
            .select(`
                *,
                admins (
                    id,
                    email,
                    nom,
                    role,
                    actif
                )
            `)
            .eq('token', sessionToken)
            .gt('expires_at', new Date().toISOString())
            .single();

        if (error || !data || !data.admins.actif) {
            return { valid: false };
        }

        return {
            valid: true,
            admin: data.admins,
            session: data
        };
    } catch (error) {
        console.error('Erreur validation session:', error);
        return { valid: false };
    }
}

// Fonction pour déconnecter un admin
async function logoutAdmin(sessionToken) {
    try {
        // Logger la déconnexion
        const sessionData = await validateSession(sessionToken);
        if (sessionData.valid) {
            await logAdminAction(sessionData.admin.id, 'logout', {
                session_token: sessionToken
            });
        }

        // Supprimer la session
        const { error } = await supabaseClient
            .from('admin_sessions')
            .delete()
            .eq('token', sessionToken);

        if (error) {
            console.error('Erreur déconnexion:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Erreur déconnexion:', error);
        return { success: false, error: error.message };
    }
}

// Fonction pour logger les actions admin
async function logAdminAction(adminId, action, details = {}) {
    try {
        const { error } = await supabaseClient
            .from('admin_audit_logs')
            .insert([
                {
                    admin_id: adminId,
                    action: action,
                    details: details,
                    ip_address: await getClientIP(),
                    user_agent: navigator.userAgent
                }
            ]);

        if (error) {
            console.error('Erreur log audit:', error);
        }
    } catch (error) {
        console.error('Erreur log audit:', error);
    }
}

// Fonction pour obtenir les statistiques admin
async function getAdminStats() {
    try {
        const { data, error } = await supabaseClient
            .rpc('get_admin_stats');

        if (error) {
            console.error('Erreur stats admin:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Erreur stats admin:', error);
        return { success: false, error: error.message };
    }
}

// Export pour utilisation globale
window.SupabasePortfolio = {
    client: supabaseClient,
    photos: {
        get: getPhotos,
        add: addPhoto,
        delete: deletePhoto
    },
    categories: {
        get: getCategories
    },
    temoignages: {
        get: getTemoignages,
        add: addTemoignage
    },
    auth: {
        login: authenticateAdmin,
        validateSession: validateSession,
        logout: logoutAdmin,
        logAction: logAdminAction,
        getStats: getAdminStats
    },
    utils: {
        showToast,
        convertToWebP,
        resizeImage,
        initLazyLoading
    },
    checkConnection: checkSupabaseConnection
};
