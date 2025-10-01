# Structure du Projet Kerezel Design

## 📁 Organisation des fichiers

Le projet a été réorganisé pour une meilleure lisibilité et maintenance :

### 🏠 Racine du projet
- `package.json` - Configuration npm
- `package-lock.json` - Verrouillage des dépendances
- `node_modules/` - Modules Node.js
- `supabase/` - Configuration et migrations Supabase

### 📄 Pages (`pages/`)
Tous les fichiers HTML de l'application :
- `index.html` - Page d'accueil
- `services.html` - Page des services
- `blog.html` - Page du blog
- `portfolio-*.html` - Pages de portfolio (branding, design, mariage, portrait, produit)
- `admin.html` - Interface d'administration
- `admin-dashboard.html` - Tableau de bord admin
- `create-admin.html` - Création d'administrateur

### 🎨 Assets (`assets/`)
Ressources statiques :
- `images/` - Toutes les images du projet (ancien dossier `photo`)
  - `Affiche/` - Images d'affiches
  - `affiche anniversaire/` - Images d'anniversaire
  - `mariage/` - Photos de mariage
  - `portrait studio/` - Portraits studio
  - `produit/` - Photos de produits
- `dist/` - Fichiers CSS compilés (Tailwind)

### 📜 Scripts (`scripts/`)
Fichiers JavaScript :
- `admin-manager.js` - Gestion des administrateurs
- `admin-security.js` - Sécurité admin
- `supabase.js` - Configuration Supabase
- `config.example.js` - Exemple de configuration
- `tailwind.config.js` - Configuration Tailwind
- `js/` - Scripts supplémentaires
  - `performance.js` - Optimisations de performance
  - `supabase-portfolio.js` - Fonctionnalités portfolio Supabase
  - `supabase.js` - Scripts Supabase

### 🎨 Styles (`styles/`)
Fichiers CSS :
- `styles.css` - Styles principaux

### ⚙️ Configuration (`config/`)
Fichiers de configuration :
- `database-setup.sql` - Script de base de données
- `netlify.toml` - Configuration Netlify
- `robots.txt` - Configuration robots
- `sitemap.xml` - Plan du site

### 📚 Documentation (`docs/`)
Tous les fichiers de documentation :
- `README.md` - Documentation principale
- `ADMIN-README.md` - Documentation admin
- `AUTH-SYSTEM-README.md` - Documentation système d'authentification
- `MOBILE-OPTIMIZATION-README.md` - Documentation optimisation mobile
- `PORTFOLIO-README.md` - Documentation portfolio
- `SUPABASE-*.md` - Documentation Supabase et corrections

## 🚀 Avantages de cette organisation

1. **Séparation claire** : Chaque type de fichier a son dossier dédié
2. **Maintenance facilitée** : Plus facile de trouver et modifier les fichiers
3. **Évolutivité** : Structure prête pour l'ajout de nouvelles fonctionnalités
4. **Collaboration** : Structure standardisée pour les développeurs
5. **Déploiement** : Configuration centralisée dans le dossier `config/`

## 📝 Notes importantes

- Le fichier `index.html` principal reste dans `pages/` pour le déploiement
- Les chemins dans les fichiers HTML devront être mis à jour pour refléter la nouvelle structure
- Les imports JavaScript devront être ajustés selon la nouvelle organisation
