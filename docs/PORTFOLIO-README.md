# Kerezel Design - Portfolio Premium

Un site web professionnel moderne pour photographe et designer graphique, développé avec les dernières technologies web.

## 🎨 Caractéristiques Premium

### Design & UX
- **Identité visuelle harmonisée** : Palette de couleurs dorée (#D4AF37) et noir profond (#0F0F0F)
- **Typographie premium** : Playfair Display (serif) + Poppins (sans-serif)
- **Animations fluides** : AOS (Animate On Scroll) avec micro-interactions
- **Design responsive** : Mobile-first avec breakpoints optimisés
- **Accessibilité** : Navigation clavier, contrastes optimisés, aria-labels

### Fonctionnalités Avancées
- **Galerie portfolio dynamique** : Layout masonry avec filtres interactifs
- **Lightbox premium** : Modal fullscreen avec informations détaillées
- **Carrousel de témoignages** : Auto-play avec contrôles tactiles
- **Système de design cohérent** : Composants réutilisables et modulaires
- **Performance optimisée** : Lazy loading, WebP, scripts asynchrones

### Pages & Sections
1. **Accueil** : Hero fullscreen avec storytelling et statistiques
2. **À propos** : Présentation personnelle avec compétences
3. **Portfolio** : Galerie dynamique avec filtres et lightbox
4. **Services** : Page dédiée avec tarifs et FAQ complète
5. **Blog** : Articles SEO avec pagination et newsletter
6. **Contact** : Formulaire optimisé avec intégration WhatsApp

## 🚀 Technologies Utilisées

### Frontend
- **HTML5** : Structure sémantique et SEO optimisé
- **CSS3** : Animations avancées et design moderne
- **Tailwind CSS** : Framework CSS utilitaire avec configuration personnalisée
- **JavaScript ES6+** : Code modulaire et performant
- **AOS Library** : Animations au scroll

### Backend & Data
- **Supabase** : Base de données et authentification
- **Formspree** : Gestion des formulaires de contact
- **CDN** : Ressources optimisées (fonts, icons)

### Performance & SEO
- **Lazy Loading** : Chargement différé des images
- **WebP Support** : Images optimisées avec fallback
- **Sitemap XML** : Structure SEO complète
- **Meta Tags** : Open Graph et Twitter Cards
- **Schema.org** : Données structurées pour les moteurs de recherche

## 📁 Structure du Projet

```
kerezel-design/
├── index.html              # Page d'accueil principale
├── services.html           # Page services avec FAQ
├── blog.html              # Page blog/articles
├── admin.html             # Interface d'administration
├── styles.css             # Styles Tailwind personnalisés
├── tailwind.config.js     # Configuration Tailwind
├── package.json           # Dépendances et scripts
├── sitemap.xml           # Sitemap pour SEO
├── robots.txt            # Configuration robots
├── js/
│   ├── supabase.js       # Client Supabase simplifié
│   ├── supabase-portfolio.js # API Portfolio
│   └── performance.js    # Optimisations performance
├── photo/               # Dossier images
└── dist/               # CSS compilé
```

## 🛠️ Installation & Configuration

### Prérequis
- Node.js (v14+)
- npm ou yarn
- Compte Supabase

### Installation
```bash
# Cloner le projet
git clone [url-du-repo]
cd kerezel-design

# Installer les dépendances
npm install

# Compiler le CSS
npm run build-css

# Ou en mode développement
npm run dev
```

### Configuration Supabase
1. Créer un projet Supabase
2. Configurer les tables :
   ```sql
   -- Table photos
   CREATE TABLE photos (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     titre TEXT NOT NULL,
     description TEXT,
     url_image TEXT NOT NULL,
     categorie TEXT NOT NULL,
     alt_text TEXT,
     visible BOOLEAN DEFAULT true,
     date_creation TIMESTAMP DEFAULT NOW()
   );

   -- Table témoignages
   CREATE TABLE temoignages (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     auteur TEXT NOT NULL,
     message TEXT NOT NULL,
     note INTEGER CHECK (note >= 1 AND note <= 5),
     poste TEXT,
     entreprise TEXT,
     visible BOOLEAN DEFAULT true,
     date_creation TIMESTAMP DEFAULT NOW()
   );
   ```
3. Mettre à jour les URLs dans `js/supabase-portfolio.js`

## 🎯 Fonctionnalités Détaillées

### Galerie Portfolio
- **Layout Masonry** : Grille adaptative avec hauteurs variables
- **Filtres dynamiques** : Par catégorie (Portrait, Design, Événements, etc.)
- **Lightbox premium** : Modal avec informations détaillées et actions
- **Lazy loading** : Chargement optimisé des images
- **Responsive** : Adaptation mobile/tablet/desktop

### Système de Design
- **Palette harmonisée** : 50 nuances de chaque couleur principale
- **Composants réutilisables** : Boutons, cartes, inputs standardisés
- **Animations cohérentes** : Transitions fluides et micro-interactions
- **Typographie hiérarchisée** : Tailles et poids optimisés

### Performance
- **Lazy Loading** : Images chargées à la demande
- **WebP Support** : Format moderne avec fallback
- **Scripts asynchrones** : Chargement non-bloquant
- **Préchargement** : Ressources critiques optimisées
- **Compression** : Assets minifiés et optimisés

## 📱 Responsive Design

### Breakpoints
- **Mobile** : < 768px (1 colonne)
- **Tablet** : 768px - 1024px (2 colonnes)
- **Desktop** : > 1024px (3+ colonnes)

### Optimisations Mobile
- Menu burger avec animations
- Images adaptatives
- Boutons tactiles optimisés
- Performance mobile-first

## 🔧 Personnalisation

### Couleurs
Modifier `tailwind.config.js` :
```javascript
colors: {
  primary: {
    500: '#D4AF37', // Couleur principale
    // ... autres nuances
  }
}
```

### Contenu Dynamique
Les données sont gérées via Supabase :
- Photos du portfolio
- Témoignages clients
- Articles de blog
- Services et tarifs

### Animations
Personnaliser dans `styles.css` :
```css
@keyframes customAnimation {
  /* Votre animation */
}
```

## 📊 SEO & Performance

### Optimisations SEO
- Meta tags complets
- Schema.org structured data
- Sitemap XML automatique
- URLs sémantiques
- Alt tags descriptifs

### Métriques Performance
- **Lighthouse Score** : 90+ sur tous les critères
- **Core Web Vitals** : Optimisés
- **Mobile Performance** : Score élevé
- **Accessibility** : Conforme WCAG 2.1

## 🚀 Déploiement

### Netlify (Recommandé)
1. Connecter le repository GitHub
2. Configuration automatique détectée
3. Variables d'environnement Supabase
4. Déploiement automatique

### Autres Plateformes
- **Vercel** : Compatible
- **GitHub Pages** : Avec configuration manuelle
- **Serveur traditionnel** : Upload des fichiers

## 📈 Analytics & Monitoring

### Intégrations Recommandées
- **Google Analytics** : Suivi des visiteurs
- **Google Search Console** : Performance SEO
- **Hotjar** : Analyse comportementale
- **Supabase Analytics** : Métriques backend

## 🔒 Sécurité

### Bonnes Pratiques
- Validation côté client et serveur
- Sanitisation des données
- HTTPS obligatoire
- Headers de sécurité
- Rate limiting sur les formulaires

## 📞 Support & Maintenance

### Maintenance Régulière
- Mise à jour des dépendances
- Optimisation des images
- Ajout de nouveaux projets
- Mise à jour du contenu

### Support Technique
- Documentation complète
- Code commenté
- Architecture modulaire
- Tests de régression

## 🎨 Personnalisation Avancée

### Ajout de Nouvelles Sections
1. Créer le HTML dans `index.html`
2. Ajouter les styles dans `styles.css`
3. Configurer les animations AOS
4. Tester le responsive

### Intégration de Nouvelles Fonctionnalités
1. Développer le composant JavaScript
2. Ajouter les styles Tailwind
3. Intégrer avec Supabase si nécessaire
4. Tester et optimiser

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.

## 👨‍💻 Développeur

**Peter AKILIMALI**
- Portfolio : [Votre portfolio]
- Email : [Votre email]
- LinkedIn : [Votre LinkedIn]

---

*Ce projet a été développé avec passion pour créer une expérience utilisateur exceptionnelle et mettre en valeur le talent artistique de Kerezel Design.*
