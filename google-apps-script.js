// ====================================================================
// GOOGLE APPS SCRIPT - À copier dans Google Apps Script Editor
// ====================================================================

// CONFIGURATION - À MODIFIER
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID'; // ID de votre Google Sheet
const SHEET_NAME = 'Réponses'; // Nom de la feuille (onglet)
const adminEmail = 'marie@email.fr'; // À REMPLACER par votre email

// ====================================================================
// GESTION DES REQUÊTES CORS
// ====================================================================

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
// FONCTION PRINCIPALE - RECEVOIR LES DONNÉES
// ====================================================================

function doPost(e) {
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
    const output = ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Données enregistrées avec succès'
    }));
    output.setMimeType(ContentService.MimeType.JSON);
    output.setHeader('Access-Control-Allow-Origin', '*');
    output.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    output.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    return output;

  } catch (error) {
    // Retourner une réponse d'erreur
    const output = ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    }));
    output.setMimeType(ContentService.MimeType.JSON);
    output.setHeader('Access-Control-Allow-Origin', '*');
    
    return output;
  }
}

// ====================================================================
// FONCTION - EMAIL À L'ADMINISTRATEUR
// ====================================================================

function sendAdminNotification(data) {
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

// ====================================================================
// FONCTION - EMAIL À L'UTILISATEUR
// ====================================================================

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

// ====================================================================
// FONCTION DE TEST
// ====================================================================

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
