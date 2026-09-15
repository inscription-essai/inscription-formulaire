// Gestion des requêtes OPTIONS (CORS)
function doOptions(e) {
  const output = ContentService.createTextOutput('OK');
  output.setMimeType(ContentService.MimeType.TEXT);
  
  // En-têtes CORS
  output.setHeader('Access-Control-Allow-Origin', '*');
  output.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  output.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  return output;
}
// ====================================================================
// GOOGLE APPS SCRIPT - À copier dans Google Apps Script Editor
// ====================================================================
// 
// ÉTAPES :
// 1. Aller sur : https://script.google.com/home
// 2. Cliquer sur "Nouveau projet"
// 3. Copier le code ci-dessous
// 4. Créer une nouvelle feuille Google Sheets avec les colonnes :
//    - Timestamp (Horodatage)
//    - Nom
//    - Prénom
//    - Email
//    - Mot de passe (optionnel, recommandé de ne pas stocker)
// 5. Remplacer SHEET_ID et SHEET_NAME
// 6. Publier le script (Déployer -> Nouveau déploiement -> Type: API Web)
// 7. Copier l'URL de déploiement dans script.js (GOOGLE_APPS_SCRIPT_URL)
//
// ====================================================================

// CONFIGURATION - À MODIFIER
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID'; // ID de votre Google Sheet
const SHEET_NAME = 'Réponses'; // Nom de la feuille (onglet)

// Fonction principale pour recevoir les données du formulaire
// Gérer les requêtes POST avec CORS
function handleCORS(e) {
  // Récupérer les paramètres
  const params = e.parameter;
  
  try {
    // Appeler doPost
    return doPost(e);
  } catch (error) {
    const output = ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    }));
    output.setMimeType(ContentService.MimeType.JSON);
    output.setHeader('Access-Control-Allow-Origin', '*');
    return output;
  }
}
function doPost(e) {
  // En-têtes CORS
  const output = ContentService.createTextOutput(JSON.stringify({
    success: false,
    error: 'Erreur'
  }));
  output.setHeader('Access-Control-Allow-Origin', '*');
  output.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  output.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  output.setMimeType(ContentService.MimeType.JSON);
  try {
    // Parser les données JSON
    const data = JSON.parse(e.postData.contents);

    // Ouvrir la feuille Google Sheets
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);

    // Ajouter une ligne avec les données
    sheet.appendRow([
      data.timestamp,
      data.nom,
      data.prenom,
      data.email,
      data.password // À NE PAS stocker en production ! Utiliser un hash
    ]);

    // Envoyer un email de confirmation à l'administrateur
    sendAdminNotification(data);

    // Envoyer un email de confirmation à l'utilisateur
    sendUserConfirmation(data.email, data.prenom);

    // Retourner une réponse de succès
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Données enregistrées avec succès'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Retourner une réponse d'erreur
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Fonction pour envoyer un email à l'administrateur
function sendAdminNotification(data) {
  const adminEmail = 'marie@email.fr'; // À REMPLACER par votre email

  const subject = `📝 Nouvelle inscription - ${data.prenom} ${data.nom}`;

  const message = `
    <h2>Nouvelle inscription reçue !</h2>
    <p><strong>Nom:</strong> ${data.nom}</p>
    <p><strong>Prénom:</strong> ${data.prenom}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Date:</strong> ${data.timestamp}</p>
    <hr>
    <p>Vous pouvez voir toutes les réponses dans votre Google Sheet.</p>
  `;

  try {
    GmailApp.sendEmail(adminEmail, subject, '', {
      htmlBody: message
    });
  } catch (e) {
    Logger.log('Erreur lors de l\'envoi d\'email administrateur: ' + e.toString());
  }
}

// Fonction pour envoyer un email de confirmation à l'utilisateur
function sendUserConfirmation(email, prenom) {
  const subject = '✓ Inscription confirmée';

  const message = `
    <h2>Bienvenue ${prenom} ! 🎉</h2>
    <p>Votre inscription a été confirmée avec succès.</p>
    <p>Vous pouvez désormais accéder à votre compte.</p>
    <br>
    <p>Cordialement,<br>L'équipe</p>
  `;

  try {
    GmailApp.sendEmail(email, subject, '', {
      htmlBody: message
    });
  } catch (e) {
    Logger.log('Erreur lors de l\'envoi d\'email utilisateur: ' + e.toString());
  }
}

// Fonction pour tester localement (optionnel)
function testPost() {
  const testData = {
    nom: 'Dupont',
    prenom: 'Marie',
    email: 'test@email.fr',
    password: 'TestPassword123!',
    timestamp: new Date().toLocaleString('fr-FR')
  };

  const e = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };

  const result = doPost(e);
  Logger.log(result.getContent());
}
