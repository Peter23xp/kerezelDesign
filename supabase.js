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
    utils: {
        showToast,
        convertToWebP,
        resizeImage,
        initLazyLoading
    },
    checkConnection: checkSupabaseConnection
};
