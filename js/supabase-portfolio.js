// Configuration Supabase pour Kerezel Design Portfolio
(function() {
    'use strict';

    // Configuration Supabase
    const SUPABASE_URL = 'https://your-project.supabase.co';
    const SUPABASE_ANON_KEY = 'your-anon-key';

    // Client Supabase simplifié
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // API Portfolio
    window.SupabasePortfolio = {
        // Vérifier la connexion
        async checkConnection() {
            try {
                const { data, error } = await supabase.from('photos').select('count').limit(1);
                return !error;
            } catch (error) {
                console.error('Erreur de connexion Supabase:', error);
                return false;
            }
        },

        // Photos
        photos: {
            async get(filter = null) {
                try {
                    let query = supabase.from('photos').select('*').eq('visible', true);
                    
                    if (filter && filter !== 'all') {
                        query = query.eq('categorie', filter);
                    }
                    
                    const { data, error } = await query.order('date_creation', { ascending: false });
                    
                    if (error) throw error;
                    return data || [];
                } catch (error) {
                    console.error('Erreur lors du chargement des photos:', error);
                    return [];
                }
            },

            async getById(id) {
                try {
                    const { data, error } = await supabase
                        .from('photos')
                        .select('*')
                        .eq('id', id)
                        .single();
                    
                    if (error) throw error;
                    return data;
                } catch (error) {
                    console.error('Erreur lors du chargement de la photo:', error);
                    return null;
                }
            }
        },

        // Témoignages
        temoignages: {
            async get() {
                try {
                    const { data, error } = await supabase
                        .from('temoignages')
                        .select('*')
                        .eq('visible', true)
                        .order('date_creation', { ascending: false });
                    
                    if (error) throw error;
                    return data || [];
                } catch (error) {
                    console.error('Erreur lors du chargement des témoignages:', error);
                    return [];
                }
            }
        },

        // Services
        services: {
            async get() {
                try {
                    const { data, error } = await supabase
                        .from('services')
                        .select('*')
                        .eq('visible', true)
                        .order('ordre', { ascending: true });
                    
                    if (error) throw error;
                    return data || [];
                } catch (error) {
                    console.error('Erreur lors du chargement des services:', error);
                    return [];
                }
            }
        },

        // Articles de blog
        blog: {
            async get(limit = 6) {
                try {
                    const { data, error } = await supabase
                        .from('articles')
                        .select('*')
                        .eq('visible', true)
                        .order('date_creation', { ascending: false })
                        .limit(limit);
                    
                    if (error) throw error;
                    return data || [];
                } catch (error) {
                    console.error('Erreur lors du chargement des articles:', error);
                    return [];
                }
            },

            async getById(id) {
                try {
                    const { data, error } = await supabase
                        .from('articles')
                        .select('*')
                        .eq('id', id)
                        .single();
                    
                    if (error) throw error;
                    return data;
                } catch (error) {
                    console.error('Erreur lors du chargement de l\'article:', error);
                    return null;
                }
            }
        }
    };

    // Données de secours en cas d'erreur Supabase
    window.FallbackData = {
        photos: [
            {
                id: 'fallback-1',
                titre: 'Portrait Studio Premium',
                description: 'Séance portrait professionnelle avec éclairage studio',
                url_image: 'photo/hero.jpg',
                categorie: 'portrait',
                alt_text: 'Portrait studio professionnel',
                date_creation: new Date().toISOString()
            },
            {
                id: 'fallback-2',
                titre: 'Design Graphique Moderne',
                description: 'Création d\'identité visuelle pour entreprise',
                url_image: 'photo/dfa1aef3-f3e5-49af-8837-7b2a9c9d08e4.jpg',
                categorie: 'design',
                alt_text: 'Design graphique moderne',
                date_creation: new Date().toISOString()
            }
        ],
        temoignages: [
            {
                id: 'testimonial-1',
                auteur: 'Sarah M.',
                message: 'Service exceptionnel ! Kerezel a su capturer l\'essence de notre mariage avec une sensibilité artistique remarquable. Les photos sont magnifiques et nous rappellent chaque émotion de ce jour spécial.',
                note: 5,
                poste: 'Mariée',
                entreprise: '',
                date_creation: new Date().toISOString()
            },
            {
                id: 'testimonial-2',
                auteur: 'Jean K.',
                message: 'Professionnalisme et créativité au rendez-vous. Le travail de Kerezel sur notre identité visuelle a dépassé nos attentes. Un partenaire de confiance pour tous nos projets visuels.',
                note: 5,
                poste: 'Directeur Marketing',
                entreprise: 'TechCorp Goma',
                date_creation: new Date().toISOString()
            },
            {
                id: 'testimonial-3',
                auteur: 'Marie L.',
                message: 'Séance portrait incroyable ! Kerezel sait mettre en valeur la personnalité de chacun. L\'ambiance était détendue et les résultats sont à la hauteur de sa réputation.',
                note: 5,
                poste: 'Professionnelle',
                entreprise: '',
                date_creation: new Date().toISOString()
            }
        ]
    };

    // Fonction pour utiliser les données de secours
    window.useFallbackData = function() {
        console.log('🔄 Utilisation des données de secours');
        
        // Remplacer les méthodes Supabase par les données de secours
        window.SupabasePortfolio.photos.get = async function(filter = null) {
            let photos = window.FallbackData.photos;
            if (filter && filter !== 'all') {
                photos = photos.filter(photo => photo.categorie === filter);
            }
            return photos;
        };

        window.SupabasePortfolio.temoignages.get = async function() {
            return window.FallbackData.temoignages;
        };

        return true;
    };

    console.log('✅ SupabasePortfolio initialisé');
})();
