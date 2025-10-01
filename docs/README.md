# 🎨 Kerezel Design - Portfolio de Photographe Professionnel

Site portfolio moderne et dynamique avec intégration Supabase pour un photographe et designer graphique professionnel basé à Goma.

## ✨ Fonctionnalités

### 🔥 Fonctionnalités principales
- **Portfolio dynamique** : Chargement des photos depuis Supabase avec filtrage par catégorie
- **Interface d'administration** : Ajout/suppression de photos via une interface web intuitive
- **Témoignages dynamiques** : Gestion des avis clients depuis la base de données
- **Design responsive** : Parfaitement optimisé pour mobile, tablette et desktop
- **Performance optimisée** : Lazy loading, WebP, préchargement des ressources critiques

### 💼 Fonctionnalités avancées
- **SEO optimisé** : Meta tags, Schema.org, Open Graph
- **Accessibilité** : Navigation clavier, liens skip, aria-labels
- **Upload d'images** : Drag & drop avec prévisualisation et optimisation automatique
- **Gestion des erreurs** : Fallback en cas de panne Supabase
- **Notifications** : System de toast pour le feedback utilisateur

## 🚀 Installation

### Prérequis
- Un compte [Supabase](https://supabase.com/)
- Un hébergeur web (Netlify, Vercel, etc.)
- Navigateur moderne

### 1. Configuration Supabase

#### A. Créer le projet Supabase
1. Créez un nouveau projet sur [Supabase](https://supabase.com/)
2. Notez votre `URL du projet` et `Clé publique anon`

#### B. Installer la base de données
1. Allez dans l'éditeur SQL de votre projet Supabase
2. Copiez et exécutez le contenu du fichier `database-setup.sql`
3. Vérifiez que les tables sont créées : `photos`, `categories`, `temoignages`

#### C. Créer le bucket de stockage
1. Allez dans **Storage** → **Create bucket**
2. Nom : `photos-bucket`
3. Public : **Activé**
4. File size limit : `50MB`
5. Allowed MIME types : `image/jpeg, image/jpg, image/png, image/webp, image/gif`

### 2. Configuration du site

#### A. Modifier les variables Supabase
Dans le fichier `supabase.js`, remplacez :
```javascript
const SUPABASE_URL = 'VOTRE_URL_SUPABASE';
const SUPABASE_ANON_KEY = 'VOTRE_CLE_ANONYME';
```

#### B. Variables d'environnement (optionnel)
Si vous préférez utiliser des variables d'environnement :
```bash
# .env
EXPO_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anonyme
```

### 3. Déploiement

#### Option 1 : Netlify
1. Uploadez les fichiers sur GitHub
2. Connectez votre repo à Netlify
3. Déployez automatiquement

#### Option 2 : Manuel
1. Uploadez tous les fichiers sur votre serveur web
2. Assurez-vous que `index.html` est accessible à la racine

## 📁 Structure du projet

```
kerezelDesign/
├── index.html              # Page principale
├── admin.html              # Interface d'administration  
├── supabase.js             # Configuration et API Supabase
├── database-setup.sql      # Script de création de la BDD
├── README.md               # Ce fichier
├── photo/                  # Images existantes (backup)
│   ├── hero.jpg
│   ├── mariage/
│   ├── portrait studio/
│   └── ...
└── portfolio-*.html        # Pages portfolio spécialisées
```

## 🔧 Utilisation

### Interface utilisateur (index.html)
- **Navigation fluide** : Menu responsive avec animations
- **Portfolio filtrable** : Cliquez sur les catégories pour filtrer
- **Témoignages automatiques** : Chargés depuis Supabase
- **Modal photo** : Cliquez sur une photo pour l'agrandir
- **Contact** : Formulaire fonctionnel via Formspree

### Interface d'administration (admin.html)
Accédez à `/admin.html` pour :

#### Ajouter une photo
1. **Upload** : Glissez-déposez ou cliquez pour sélectionner
2. **Métadonnées** : Titre, description, catégorie
3. **Options** : Photo mise en avant, ordre d'affichage
4. **Optimisation** : Compression automatique si > 2MB

#### Gérer les témoignages  
1. Nom, entreprise, poste
2. Message et note (1-5 étoiles)
3. Visibilité (publié/brouillon)

#### Galerie d'administration
- Visualiser toutes les photos
- Filtrer par catégorie  
- Supprimer les photos indésirables

### Categories disponibles
- `portfolio` : Photos générales de portfolio
- `design` : Travaux de design graphique
- `evenement` : Photographie d'événements
- `portrait` : Photos de portrait studio
- `produit` : Photographie de produits
- `branding` : Identité visuelle et branding
- `blog` : Photos pour articles de blog

## 🛡️ Sécurité

### En développement
Les politiques RLS sont configurées pour permettre toutes les opérations (temporaire).

### En production (recommandé)
1. **Supprimez les politiques temporaires** dans `database-setup.sql`
2. **Créez un système d'authentification admin** :
```sql
-- Exemple de politique sécurisée
CREATE POLICY "Seuls les admins peuvent ajouter des photos" ON public.photos
    FOR INSERT WITH CHECK (auth.role() = 'admin');
```

3. **Protégez admin.html** avec un mot de passe
4. **Activez HTTPS** sur votre domaine
5. **Limitez les uploads** selon vos besoins

## ⚡ Performance

### Optimisations incluses
- **Lazy loading** : Images chargées à la demande
- **WebP conversion** : Compression automatique
- **CDN ready** : Ressources externes optimisées
- **Preload** : Ressources critiques préchargées
- **Minification** : CSS et JS optimisés

### Métriques cibles
- **First Contentful Paint** : < 2s
- **Largest Contentful Paint** : < 2.5s
- **Cumulative Layout Shift** : < 0.1
- **First Input Delay** : < 100ms

## 🎨 Personnalisation

### Couleurs
Modifiez dans `index.html` (section Tailwind config) :
```javascript
colors: {
    primary: '#D4AF37',    // Doré principal
    secondary: '#1A1A1A'   // Gris foncé
}
```

### Polices
Changez dans la section `<head>` :
```html
<link href="https://fonts.googleapis.com/css2?family=VotrePolice&display=swap" rel="stylesheet">
```

### Images de fond
Remplacez les URLs dans les sections hero et about.

## 🐛 Dépannage

### Problèmes courants

#### 1. "Erreur de connexion Supabase"
- Vérifiez vos clés dans `supabase.js`
- Confirmez que les tables existent
- Testez les politiques RLS

#### 2. "Images ne s'uploadent pas"
- Vérifiez que le bucket `photos-bucket` existe
- Confirmez qu'il est public
- Testez les permissions de storage

#### 3. "Portfolio vide"
- Ajoutez des photos via l'admin
- Vérifiez la console pour les erreurs
- Testez la requête Supabase manuellement

#### 4. "Site lent"
- Activez la compression sur votre serveur
- Utilisez un CDN pour les images
- Optimisez la taille des images avant upload

### Debug mode
Ouvrez la console développeur (F12) pour voir :
- État de la connexion Supabase
- Erreurs de chargement
- Performances des requêtes

## 📞 Support

### Auto-diagnostic
1. **Console développeur** : Recherchez les erreurs en rouge
2. **Network tab** : Vérifiez les requêtes Supabase
3. **Tests manuels** : Testez chaque fonctionnalité séparément

### Ressources utiles
- [Documentation Supabase](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [AOS Animations](https://michalsnik.github.io/aos/)

## 🔄 Mises à jour

### Changelog
- **v1.0** : Site statique initial
- **v2.0** : Intégration Supabase dynamique
- **v2.1** : Interface d'administration
- **v2.2** : Optimisations SEO et performance

### Roadmap
- [ ] Mode sombre
- [ ] Galerie avancée avec zoom
- [ ] Intégration réseaux sociaux
- [ ] Analytics intégrées
- [ ] PWA (Progressive Web App)

## 📜 Licence

Ce projet est sous licence MIT. Libre d'utilisation, modification et distribution.

---

## 🎯 Guide rapide

### Pour démarrer en 5 minutes :

1. **Créez un projet Supabase**
2. **Exécutez `database-setup.sql`**
3. **Créez le bucket `photos-bucket`**
4. **Modifiez les clés dans `supabase.js`**
5. **Uploadez sur votre hébergeur**

### Pour ajouter votre première photo :

1. **Allez sur `/admin.html`**
2. **Glissez-déposez une image**
3. **Remplissez le titre et la catégorie**
4. **Cliquez sur "Ajouter la photo"**
5. **Vérifiez sur la page d'accueil**

✨ **Votre portfolio est maintenant dynamique et prêt à impressionner vos clients !**

---

*Développé avec ❤️ pour les créatifs qui veulent un portfolio moderne et professionnel.*
