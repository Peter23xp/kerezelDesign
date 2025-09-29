# 🔐 Système d'Authentification Admin - Kerezel Design

## 🎯 **Vue d'ensemble**

Le système d'authentification admin utilise maintenant **Supabase** comme base de données pour stocker les informations de connexion de manière sécurisée, remplaçant les données mockées en local.

## 🏗️ **Architecture du système**

### **Base de données Supabase :**

#### **1. Table `admins`**
```sql
- id (UUID) : Identifiant unique
- email (VARCHAR) : Email de connexion (unique)
- password_hash (VARCHAR) : Hash bcrypt du mot de passe
- nom (VARCHAR) : Nom de l'administrateur
- role (VARCHAR) : Rôle (admin, super_admin)
- actif (BOOLEAN) : Statut du compte
- derniere_connexion (TIMESTAMP) : Dernière connexion
- tentatives_echec (INTEGER) : Nombre d'échecs de connexion
- bloque_jusqu_a (TIMESTAMP) : Blocage temporaire
- created_at, updated_at (TIMESTAMP) : Dates de création/modification
```

#### **2. Table `admin_sessions`**
```sql
- id (UUID) : Identifiant unique
- admin_id (UUID) : Référence vers admins
- token (VARCHAR) : Token de session unique
- expires_at (TIMESTAMP) : Expiration de la session
- ip_address (INET) : Adresse IP de connexion
- user_agent (TEXT) : Navigateur utilisé
- created_at (TIMESTAMP) : Date de création
```

#### **3. Table `admin_audit_logs`**
```sql
- id (UUID) : Identifiant unique
- admin_id (UUID) : Référence vers admins
- action (VARCHAR) : Action effectuée
- details (JSONB) : Détails de l'action
- ip_address (INET) : Adresse IP
- user_agent (TEXT) : Navigateur utilisé
- created_at (TIMESTAMP) : Date de l'action
```

## 🔧 **Fonctionnalités de sécurité**

### **1. Protection contre les attaques par force brute :**
- **Limite de tentatives** : 5 tentatives maximum
- **Blocage temporaire** : 15 minutes après 5 échecs
- **Compteur automatique** : Incrémentation des échecs
- **Réinitialisation** : Remise à zéro après connexion réussie

### **2. Gestion des sessions :**
- **Tokens sécurisés** : Génération aléatoire de 64 caractères
- **Expiration** : Sessions de 24 heures
- **Validation en temps réel** : Vérification toutes les 5 minutes
- **Nettoyage automatique** : Suppression des sessions expirées

### **3. Logs d'audit complets :**
- **Toutes les connexions** : Succès et échecs
- **Actions admin** : Upload, suppression, modification
- **Informations contextuelles** : IP, navigateur, timestamp
- **Traçabilité complète** : Historique des actions

## 🚀 **Utilisation**

### **Identifiants par défaut :**
- **Email** : `admin@kerezeldesign.com`
- **Mot de passe** : `AdminKerezel2025!`

### **Création d'un nouvel admin :**

1. **Via l'interface web** (`create-admin.html`) :
   - Ouvrez `create-admin.html` dans votre navigateur
   - Remplissez le formulaire
   - Cliquez sur "Créer l'Administrateur"

2. **Via le code** :
   ```javascript
   await AdminManager.createAdmin(
       'nouveau@admin.com',
       'MotDePasseSecurise123!',
       'Nouvel Admin',
       'admin'
   );
   ```

### **Connexion au dashboard :**

1. Ouvrez `admin-dashboard.html`
2. Entrez vos identifiants
3. Le système vérifie automatiquement :
   - Validité des identifiants
   - Statut du compte (non bloqué)
   - Nombre de tentatives
4. Création d'une session sécurisée
5. Redirection vers le dashboard

## 📊 **Fonctions disponibles**

### **Authentification :**
```javascript
// Connexion
const result = await SupabasePortfolio.auth.login(email, password);

// Validation de session
const validation = await SupabasePortfolio.auth.validateSession(token);

// Déconnexion
await SupabasePortfolio.auth.logout(token);

// Statistiques admin
const stats = await SupabasePortfolio.auth.getStats();
```

### **Gestion des admins :**
```javascript
// Créer un admin
await AdminManager.createAdmin(email, password, nom, role);

// Lister les admins
await AdminManager.listAdmins();

// Désactiver un admin
await AdminManager.deactivateAdmin(adminId);

// Réinitialiser les tentatives
await AdminManager.resetLoginAttempts(adminId);
```

## 🔒 **Sécurité en production**

### **Recommandations importantes :**

1. **Changez le mot de passe par défaut** :
   ```sql
   UPDATE admins 
   SET password_hash = '$2b$12$NOUVEAU_HASH_BCRYPT' 
   WHERE email = 'admin@kerezeldesign.com';
   ```

2. **Utilisez HTTPS** en production

3. **Surveillez les logs d'audit** :
   ```sql
   SELECT * FROM admin_audit_logs 
   WHERE action = 'login_failed' 
   ORDER BY created_at DESC;
   ```

4. **Limitez les IP autorisées** (optionnel) :
   ```sql
   ALTER TABLE admin_sessions 
   ADD CONSTRAINT check_ip_whitelist 
   CHECK (ip_address IN ('192.168.1.100', '10.0.0.50'));
   ```

### **Monitoring :**

- **Sessions actives** :
  ```sql
  SELECT COUNT(*) FROM admin_sessions 
  WHERE expires_at > NOW();
  ```

- **Tentatives d'intrusion** :
  ```sql
  SELECT email, tentatives_echec, bloque_jusqu_a 
  FROM admins 
  WHERE tentatives_echec > 0;
  ```

- **Activité récente** :
  ```sql
  SELECT * FROM admin_audit_logs 
  WHERE created_at > NOW() - INTERVAL '24 hours'
  ORDER BY created_at DESC;
  ```

## 🛠️ **Dépannage**

### **Problèmes courants :**

#### **"Compte temporairement bloqué"**
- **Cause** : Trop de tentatives de connexion échouées
- **Solution** : Attendre 15 minutes ou réinitialiser manuellement
- **Commande SQL** :
  ```sql
  UPDATE admins 
  SET tentatives_echec = 0, bloque_jusqu_a = NULL 
  WHERE email = 'admin@kerezeldesign.com';
  ```

#### **"Session expirée"**
- **Cause** : Session de plus de 24h ou token invalide
- **Solution** : Se reconnecter normalement

#### **"Erreur de connexion Supabase"**
- **Cause** : Problème de réseau ou configuration
- **Solution** : Vérifier `supabase.js` et la connexion internet

### **Logs de débogage :**
Ouvrez la console (F12) pour voir :
- Tentatives de connexion
- Erreurs d'authentification
- Validation des sessions
- Actions d'audit

## 📈 **Avantages du nouveau système**

### **Sécurité renforcée :**
- ✅ **Données centralisées** dans Supabase
- ✅ **Protection contre les attaques** par force brute
- ✅ **Sessions sécurisées** avec tokens uniques
- ✅ **Logs d'audit complets** pour traçabilité

### **Scalabilité :**
- ✅ **Multiples administrateurs** supportés
- ✅ **Rôles et permissions** configurables
- ✅ **Sessions concurrentes** gérées
- ✅ **Nettoyage automatique** des données

### **Maintenance :**
- ✅ **Interface de gestion** intégrée
- ✅ **Statistiques en temps réel**
- ✅ **Monitoring automatique**
- ✅ **Récupération facile** en cas de problème

---

## 🎯 **Résumé**

Vous avez maintenant un **système d'authentification professionnel** qui :

- 🔐 **Stocke les identifiants** dans Supabase (plus de données mockées)
- 🛡️ **Protège contre les attaques** par force brute
- 📊 **Gère les sessions** de manière sécurisée
- 📝 **Log toutes les actions** pour audit
- 🚀 **Évolue facilement** pour de nouveaux admins

**Le système est prêt pour la production !** 🎉
