// Script pour générer les hashs de mots de passe et gérer les admins
// Utilisez ce script pour créer de nouveaux comptes admin

// Fonction pour générer un hash bcrypt (nécessite une bibliothèque bcrypt)
async function generatePasswordHash(password) {
    // En production, utilisez une bibliothèque bcrypt côté serveur
    // Pour le développement, nous utilisons une fonction simple
    
    // Simulation d'un hash bcrypt (en production, utilisez une vraie librairie)
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'salt_kerezel_2025');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Format bcrypt simulé (en production, utilisez bcrypt)
    return `$2b$12$${hashHex.substring(0, 53)}`;
}

// Fonction pour créer un nouvel admin
async function createAdmin(email, password, nom, role = 'admin') {
    try {
        const passwordHash = await generatePasswordHash(password);
        
        const { data, error } = await supabaseClient
            .from('admins')
            .insert([
                {
                    email: email,
                    password_hash: passwordHash,
                    nom: nom,
                    role: role,
                    actif: true
                }
            ])
            .select();

        if (error) {
            console.error('Erreur création admin:', error);
            return { success: false, error: error.message };
        }

        console.log('✅ Admin créé avec succès:', data[0]);
        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Erreur:', error);
        return { success: false, error: error.message };
    }
}

// Fonction pour lister tous les admins
async function listAdmins() {
    try {
        const { data, error } = await supabaseClient
            .from('admins')
            .select('id, email, nom, role, actif, derniere_connexion, created_at')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erreur récupération admins:', error);
            return { success: false, error: error.message };
        }

        console.log('📋 Liste des admins:', data);
        return { success: true, data: data };
    } catch (error) {
        console.error('Erreur:', error);
        return { success: false, error: error.message };
    }
}

// Fonction pour désactiver un admin
async function deactivateAdmin(adminId) {
    try {
        const { data, error } = await supabaseClient
            .from('admins')
            .update({ actif: false })
            .eq('id', adminId)
            .select();

        if (error) {
            console.error('Erreur désactivation admin:', error);
            return { success: false, error: error.message };
        }

        console.log('✅ Admin désactivé:', data[0]);
        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Erreur:', error);
        return { success: false, error: error.message };
    }
}

// Fonction pour réinitialiser les tentatives de connexion
async function resetLoginAttempts(adminId) {
    try {
        const { data, error } = await supabaseClient
            .from('admins')
            .update({ 
                tentatives_echec: 0, 
                bloque_jusqu_a: null 
            })
            .eq('id', adminId)
            .select();

        if (error) {
            console.error('Erreur réinitialisation tentatives:', error);
            return { success: false, error: error.message };
        }

        console.log('✅ Tentatives réinitialisées:', data[0]);
        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Erreur:', error);
        return { success: false, error: error.message };
    }
}

// Export des fonctions pour utilisation dans d'autres fichiers
if (typeof window !== 'undefined') {
    window.AdminManager = {
        generatePasswordHash,
        createAdmin,
        listAdmins,
        deactivateAdmin,
        resetLoginAttempts
    };
}

// Instructions d'utilisation
console.log(`
🔐 GESTIONNAIRE D'ADMINISTRATEURS

Fonctions disponibles :
- AdminManager.createAdmin(email, password, nom, role)
- AdminManager.listAdmins()
- AdminManager.deactivateAdmin(adminId)
- AdminManager.resetLoginAttempts(adminId)

Exemple d'utilisation :
AdminManager.createAdmin('admin@kerezeldesign.com', 'MonMotDePasse123!', 'Admin Principal', 'super_admin')
`);

// Test de connexion Supabase
document.addEventListener('DOMContentLoaded', async function() {
    try {
        const { data, error } = await supabaseClient
            .from('admins')
            .select('count')
            .limit(1);
            
        if (error) {
            console.error('❌ Erreur connexion Supabase:', error);
        } else {
            console.log('✅ Connexion Supabase réussie pour AdminManager');
        }
    } catch (error) {
        console.error('❌ Erreur:', error);
    }
});
