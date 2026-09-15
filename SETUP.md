# 🔧 Guide de Configuration Complet

## 📍 Sommaire
1. [Google Sheets](#-google-sheets)
2. [Google Apps Script](#-google-apps-script)
3. [Configuration du Formulaire](#-configuration-du-formulaire)
4. [Déploiement Cloudflare](#-déploiement-cloudflare)
5. [Test & Vérification](#-test--vérification)

---

## 1️⃣ Google Sheets

### Créer la feuille de calcul

1. Accédez à [Google Sheets](https://sheets.google.com)
2. Cliquez sur **"Créer"** → **"Feuille de calcul vierge"**
3. Nommez-la : `Formulaire d'Inscription`

### Ajouter les colonnes

Dans la première ligne, créez ces en-têtes :

| A | B | C | D | E |
|---|---|---|---|---|
| Timestamp | Nom | Prénom | Email | Mot de passe |

**Exemple :**
```
Cellule A1: Timestamp
Cellule B1: Nom
Cellule C1: Prénom
Cellule D1: Email
Cellule E1: Mot de passe
```

### Obtenir l'ID de la feuille

L'URL ressemble à :
```
https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7/edit#gid=0
```

**Copiez la partie :** `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7`

---

## 2️⃣ Google Apps Script

### Accéder à Google Apps Script

1. Allez sur [Google Apps Script](https://script.google.com/home)
2. Cliquez sur **"Nouveau projet"** (à gauche)
3. Nommez le projet : `Inscription Formulaire`

### Copier le code

1. Ouvrez le fichier `google-apps-script.js` de ce repository
2. **Copiez tout le code**
3. Collez-le dans l'éditeur Google Apps Script
4. **Remplacez les 3 valeurs** (cherchez `YOUR_` ou `VOTRE_`) :

```javascript
// Ligne 14 - Mettez votre ID Google Sheets
const SHEET_ID = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7';

// Ligne 15 - Vérifiez que c'est le nom exact de l'onglet
const SHEET_NAME = 'Feuille 1';

// Ligne 50 - Mettez votre email
const adminEmail = 'votre.email@gmail.com';
```

### Enregistrer & Tester

1. Appuyez sur **Ctrl+S** (ou Cmd+S) pour enregistrer
2. En haut, sélectionnez la fonction : **"testPost"**
3. Cliquez sur le bouton **"Exécuter"** ▶️
4. **Autorisez** si demandé
5. Vérifiez dans la console que c'est un succès ✓

### Publier le script

1. Cliquez sur **"Déployer"** (en haut à droite)
2. Sélectionnez **"Nouveau déploiement"**
3. Cliquez sur l'icône ⚙️ (Type de déploiement)
4. Sélectionnez **"API Web"**
5. Paramètres :
   - **Exécuter en tant que :** Votre compte (prénom Nom)
   - **Accès :** Tout le monde anonyme
6. Cliquez sur **"Déployer"**
7. **Copiez l'URL** qui ressemble à :
   ```
   https://script.google.com/macros/d/1abcdef123456789/useless/do
   ```

---

## 3️⃣ Configuration du Formulaire

### Ouvrir le fichier script.js

1. Dans votre repository GitHub, ouvrez `script.js`
2. Cherchez la ligne 1 :
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/d/YOUR_SCRIPT_ID/useless/do?user_content_key=YOUR_KEY';
   ```

### Remplacer l'URL

Remplacez par l'URL complète copiée plus haut :
```javascript
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/d/1abcdef123456789/useless/do';
```

### Enregistrer

Cliquez sur **"Commit changes"** pour enregistrer

---

## 4️⃣ Déploiement Cloudflare

### Option A : Déploiement Automatique (Recommandé)

#### Étape 1 : Connecter GitHub à Cloudflare

1. Allez sur [Cloudflare Pages](https://pages.cloudflare.com)
2. Cliquez sur **"Créer un projet"**
3. Sélectionnez **"Connecter un compte Git"**
4. Autorisez Cloudflare à accéder à votre GitHub
5. Sélectionnez votre repository : **`inscription-essai/inscription-formulaire`**

#### Étape 2 : Configurer le build

Les paramètres par défaut conviennent :
- **Framework** : Aucun (ou None)
- **Répertoire racine** : `/` (ou vide)
- **Commande de build** : Vide

Cliquez sur **"Enregistrer et déployer"** ✓

#### Étape 3 : Attendre le déploiement

Cloudflare construira automatiquement votre site. Attendez que le statut passe à ✓ Déployé.

**Votre URL ressemblera à :**
```
https://inscription-formulaire-xxxxxx.pages.dev
```

### Option B : Upload Direct

1. Allez sur [Cloudflare Pages](https://pages.cloudflare.com)
2. Cliquez sur **"Créer un projet"** → **"Charger directement"**
3. Téléchargez les 3 fichiers :
   - `index.html`
   - `styles.css`
   - `script.js`
4. Nommez le projet : `inscription-formulaire`
5. Cliquez sur **"Déployer le site"** ✓

---

## 5️⃣ Test & Vérification

### Tester le formulaire

1. Ouvrez votre lien Cloudflare Pages
2. Remplissez le formulaire avec des données de test :
   - Nom: `Dupont`
   - Prénom: `Marie`
   - Email: `test@votremail.com`
   - Mot de passe: `TestPassword123!`
3. Cochez la case "J'accepte les conditions"
4. Cliquez sur **"S'inscrire"**

### Vérifications

✓ **Message de succès** apparaît ?
```
✓ Inscription réussie! Vérifiez votre email.
```

✓ **Email de confirmation** reçu (vérifiez aussi les spams) ?

✓ **Données dans Google Sheets** ?
Allez dans votre Google Sheet et vérifiez que la ligne a été ajoutée.

---

## 🔗 Ajouter un Domaine Personnalisé

### Avec un domaine Cloudflare

1. Cliquez sur votre projet dans Cloudflare Pages
2. Allez dans **"Paramètres"** → **"Domaine personnalisé"**
3. Entrez votre domaine (ex: `inscription.example.com`)
4. Cliquez sur **"Continuer"**
5. Confirmez la configuration DNS

### Avec un domaine externe

1. Accédez aux paramètres DNS de votre registraire
2. Ajoutez un **enregistrement CNAME** :
   ```
   Nom: inscription
   Valeur: inscription-formulaire-xxxxxx.pages.dev
   ```
3. Attendez 24h pour la propagation DNS

---

## 🐛 Troubleshooting

### Le formulaire ne envoie pas les données

**Symptôme :** Message d'erreur lors de la soumission

**Solutions :**
1. Vérifiez l'URL dans `script.js`
2. Vérifiez que le Google Apps Script est publié
3. Ouvrez la console du navigateur (F12) pour voir l'erreur
4. Vérifiez les logs Google Apps Script

**Accédez aux logs :**
- Google Apps Script → Menu **"Exécutions"** (à gauche)
- Vous verrez les erreurs en rouge

### Pas de données dans Google Sheets

**Solutions :**
1. Vérifiez le SHEET_ID (bon format ?)
2. Vérifiez le SHEET_NAME (correspond au nom de l'onglet ?)
3. Testez avec la fonction `testPost()` dans Google Apps Script
4. Vérifiez les permissions : Allez dans votre Google Sheet → Partage

### Les emails ne s'envoient pas

**Solutions :**
1. Vérifiez l'adresse email dans `google-apps-script.js`
2. Vérifiez votre dossier spam/courrier indésirable
3. Vérifiez les logs Google Apps Script pour les erreurs

---

## ✅ Checklist Finale

Avant de considérer que c'est terminé :

- [ ] Google Sheets créée avec colonnes
- [ ] Google Apps Script créé et testé
- [ ] URL Google Apps Script copié
- [ ] URL mise à jour dans `script.js`
- [ ] Formulaire déployé sur Cloudflare
- [ ] Test du formulaire complet effectué
- [ ] Données reçues dans Google Sheets
- [ ] Email de confirmation reçu

---

**Vous êtes prêt ! 🎉**

Partagez le lien Cloudflare avec vos utilisateurs !
