// Configuration des performances pour Kerezel Design
(function() {
    'use strict';

    // Configuration des performances
    window.PerformanceConfig = {
        // Lazy loading
        lazyLoading: {
            enabled: true,
            rootMargin: '50px',
            threshold: 0.1
        },

        // Images WebP
        webp: {
            enabled: true,
            fallback: 'jpg'
        },

        // Préchargement
        preload: {
            criticalImages: [
                'photo/hero.jpg',
                'photo/dfa1aef3-f3e5-49af-8837-7b2a9c9d08e4.jpg'
            ],
            criticalFonts: [
                'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@300;400;500;600&display=swap'
            ]
        },

        // Compression
        compression: {
            enabled: true,
            level: 6
        }
    };

    // Fonction pour optimiser les images
    function optimizeImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Charger l'image WebP si supportée
                        if (window.PerformanceConfig.webp.enabled && supportsWebP()) {
                            const webpSrc = img.dataset.src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
                            img.src = webpSrc;
                        } else {
                            img.src = img.dataset.src;
                        }
                        
                        img.classList.remove('lazy');
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: window.PerformanceConfig.lazyLoading.rootMargin,
                threshold: window.PerformanceConfig.lazyLoading.threshold
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback pour les navigateurs plus anciens
            images.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            });
        }
    }

    // Vérifier le support WebP
    function supportsWebP() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    // Précharger les ressources critiques
    function preloadCriticalResources() {
        // Précharger les images critiques
        window.PerformanceConfig.preload.criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });

        // Précharger les polices critiques
        window.PerformanceConfig.preload.criticalFonts.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            document.head.appendChild(link);
        });
    }

    // Optimiser les performances au chargement
    function initPerformanceOptimizations() {
        // Précharger les ressources critiques
        preloadCriticalResources();

        // Optimiser les images
        optimizeImages();

        // Optimiser les animations
        optimizeAnimations();

        // Optimiser les scripts
        optimizeScripts();
    }

    // Optimiser les animations
    function optimizeAnimations() {
        // Réduire les animations sur les appareils lents
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            document.documentElement.style.setProperty('--animation-duration', '0.3s');
        }

        // Pause les animations quand l'utilisateur préfère moins de mouvement
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.01s');
        }
    }

    // Optimiser les scripts
    function optimizeScripts() {
        // Charger les scripts non critiques de manière asynchrone
        const scripts = document.querySelectorAll('script[data-async]');
        scripts.forEach(script => {
            script.async = true;
        });
    }

    // Mesurer les performances
    function measurePerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                    
                    console.log(`🚀 Temps de chargement: ${loadTime}ms`);
                    
                    // Envoyer les métriques si nécessaire
                    if (loadTime > 3000) {
                        console.warn('⚠️ Temps de chargement élevé détecté');
                    }
                }, 0);
            });
        }
    }

    // Initialiser les optimisations
    document.addEventListener('DOMContentLoaded', () => {
        initPerformanceOptimizations();
        measurePerformance();
    });

    // Exposer les fonctions globalement
    window.PerformanceUtils = {
        optimizeImages,
        supportsWebP,
        measurePerformance
    };

    console.log('✅ Optimisations de performance initialisées');
})();