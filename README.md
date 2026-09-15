# 📝 Formulaire d'Inscription Modern

Un formulaire d'inscription modern et sécurisé avec intégration Google Sheets, inspiré du design de ChatGPT.

## ✨ Caractéristiques

- ✅ Design moderne et responsive (style ChatGPT)
- ✅ Validation en temps réel des champs
- ✅ Indicateur de force du mot de passe
- ✅ Intégration Google Sheets automatique
- ✅ Envoi d'emails de confirmation
- ✅ Sécurisé et facile à déployer
- ✅ Fonctionne sur Cloudflare Pages (gratuit)

## 📋 Contenu du Projet

```
inscription-formulaire/
├── index.html              # Formulaire HTML
├── styles.css              # Styles CSS (design moderne)
├── script.js               # Logique JavaScript
├── google-apps-script.js   # Script Google pour collecter les données
├── README.md               # Ce fichier
└── SETUP.md                # Guide de configuration détaillé
```

## 🚀 Installation & Configuration

### Étape 1 : Créer une Google Sheet

1. Allez sur [Google Sheets](https://sheets.google.com)
2. Créez une nouvelle feuille : **"Formulaire d'Inscription"**
3. Créez les colonnes suivantes (première ligne) :
   - `Timestamp`
   - `Nom`
   - `Prénom`
   - `Email`
   - `Mot de passe` (optionnel)

4. Copiez l'ID de la feuille depuis l'URL :
   ```
   https://docs.google.com/spreadsheets/d/[ID_ICI]/edit#gid=0
   ```

### Étape 2 : Configurer Google Apps Script

1. Allez sur [Google Apps Script](https://script.google.com)
2. Créez un **nouveau projet**
3. Copiez le code de `google-apps-script.js` dans l'éditeur
4. **Remplacez les valeurs** :
   ```javascript
   const SHEET_ID = 'VOTRE_ID_ICI';
   const SHEET_NAME = 'Réponses'; // Nom de l'onglet
   const adminEmail = 'votre-email@gmail.com'; // Votre email
   ```
5. **Enregistrez** le projet (Ctrl+S)
6. **Testez** avec la fonction `testPost()` (Exécuter -> testPost)
7. **Publiez** le script :
   - Cliquez sur **"Déployer"** → **"Nouveau déploiement"**
   - Type: **"API Web"**
   - Exécuter comme: **Votre compte Google**
   - Accès: **N'importe quel utilisateur anonyme**
   - Cliquez sur **"Déployer"**
8. **Copiez l'URL de déploiement** (exemple : `https://script.google.com/macros/d/...`)

### Étape 3 : Configurer le Formulaire

1. Ouvrez `script.js`
2. Remplacez la ligne :
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/d/YOUR_SCRIPT_ID/useless/do?user_content_key=YOUR_KEY';
   ```
   Par votre URL de déploiement Google Apps Script

3. **Enregistrez** le fichier

### Étape 4 : Déployer sur Cloudflare Pages

#### Option A : Via GitHub (Recommandé)

1. **Connectez votre repo GitHub** à Cloudflare Pages
2. Allez sur [Cloudflare Pages](https://pages.cloudflare.com)
3. Cliquez **"Créer un projet"** → **"Connecter un compte Git"**
4. Sélectionnez ce repository (`inscription-formulaire`)
5. Paramètres de build :
   - **Framework**: Aucun
   - **Répertoire racine**: `/`
   - **Commande de build**: (laissez vide)
6. Cliquez **"Enregistrer et déployer"**

#### Option B : Upload manuel

1. Compressez les fichiers : `index.html`, `styles.css`, `script.js`
2. Allez sur [Cloudflare Pages](https://pages.cloudflare.com)
3. **"Créer un projet"** → **"Charger directement"**
4. Uploadez les fichiers
5. Confirmez le déploiement

### ✅ Vérification

1. Accédez à votre lien Cloudflare Pages
2. Testez le formulaire
3. Vérifiez que les données apparaissent dans votre Google Sheet
4. Vérifiez que vous avez reçu l'email de confirmation

## 🔒 Sécurité

⚠️ **Important** : 
- Ne **stockez jamais** les mots de passe en clair dans Google Sheets
- Les mots de passe doivent être **hashés** côté serveur
- Utilisez **HTTPS** (Cloudflare Pages le fait automatiquement)
- Limitez l'accès à votre Google Sheet

## 🎨 Personnalisation

### Changer les couleurs

Modifiez les variables CSS dans `styles.css` :
```css
:root {
    --primary-color: #10a37f;      /* Vert ChatGPT */
    --primary-dark: #0d8f6f;
    --bg-primary: #ffffff;          /* Fond blanc */
    --text-primary: #0d0d0d;        /* Texte noir */
}
```

### Ajouter des champs

1. Ajoutez un nouveau champ dans `index.html` :
```html
<div class="form-group">
    <label for="telephone">Téléphone</label>
    <input type="tel" id="telephone" name="telephone" required>
    <span class="error-message" id="telephoneError"></span>
</div>
```

2. Ajoutez la validation dans `script.js` :
```javascript
inputs.telephone = document.getElementById('telephone');
errorMessages.telephone = document.getElementById('telephoneError');

// Dans le switch de validateField()
case 'telephone':
    if (!value) error = 'Le téléphone est requis';
    else if (!/^\d{10}$/.test(value)) error = 'Format invalide';
    break;
```

3. Ajoutez la colonne dans votre Google Sheet

## 📧 Emails de Confirmation

Les emails sont envoyés via Gmail App Script :
- **À l'admin** : Notification de nouvelle inscription
- **À l'utilisateur** : Confirmation d'inscription

Vous pouvez personnaliser les templates dans `google-apps-script.js` :
```javascript
function sendAdminNotification(data) {
  // Modifier le subject et le message HTML
}
```

## 🐛 Troubleshooting

### Le formulaire ne soumet pas les données
- ✓ Vérifiez que l'URL Google Apps Script est correcte
- ✓ Vérifiez que le script est publié comme "API Web"
- ✓ Vérifiez que l'accès est "N'importe quel utilisateur anonyme"

### Les emails ne s'envoient pas
- ✓ Vérifiez que les adresses emails sont correctes
- ✓ Vérifiez les logs Google Apps Script
- ✓ Vérifiez que votre compte Gmail n'a pas de restrictions

### Les données ne s'ajoutent pas à la Google Sheet
- ✓ Vérifiez que le SHEET_ID est correct
- ✓ Vérifiez que le SHEET_NAME correspond à un onglet existant
- ✓ Vérifiez les logs Google Apps Script (Menu: Exécutions)

## 📱 Responsive Design

Le formulaire est **entièrement responsive** et s'affiche correctement sur :
- Desktop
- Tablette
- Mobile

## 🌐 Domaine Personnalisé

Pour ajouter votre propre domaine à Cloudflare Pages :
1. Allez dans les paramètres de votre projet Cloudflare Pages
2. Cliquez sur **"Domaine personnalisé"**
3. Ajoutez votre domaine
4. Suivez les instructions DNS

## 📊 Google Sheet Columns

| Colonne | Type | Description |
|---------|------|-------------|
| Timestamp | Texte | Date et heure d'inscription |
| Nom | Texte | Nom de l'utilisateur |
| Prénom | Texte | Prénom de l'utilisateur |
| Email | Texte | Email de l'utilisateur |
| Mot de passe | Texte | Mot de passe (à hashé) |

## 📝 Licence

Libre d'utilisation et de modification.

## 💡 Suggestions d'Amélioration

- [ ] Ajouter CAPTCHA (Google reCAPTCHA)
- [ ] Hasher les mots de passe
- [ ] Ajouter la vérification d'email
- [ ] Ajouter une authentification 2FA
- [ ] Sauvegarder dans une vraie base de données

## 📞 Support

Pour toute question ou problème, consultez :
- [Documentation Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Documentation Google Apps Script](https://developers.google.com/apps-script)
- [Google Sheets API](https://developers.google.com/sheets/api)

---

**Créé avec ❤️ pour une inscription facile et sécurisée**
