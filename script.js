// Configuration - À mettre à jour avec votre URL Google Apps Script
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx44wWpA2aPcliDg_68WIKQuTWDCrnNyP3hSyw2AZ4l0G1bkJwHtjCAEgRNWu6c0o0_/exec';

console.log("SCRIPT.JS EST BIEN CHARGÉ");

// Éléments du formulaire
const form = document.getElementById('signupForm');
const submitBtn = document.getElementById('submitBtn');
const formMessage = document.getElementById('formMessage');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const togglePasswordBtn = document.getElementById('togglePassword');
const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');
const passwordStrength = document.getElementById('passwordStrength');

// Validation en temps réel
const inputs = {
    nom: document.getElementById('nom'),
    prenom: document.getElementById('prenom'),
    email: document.getElementById('email'),
    password: passwordInput,
    confirmPassword: confirmPasswordInput,
    terms: document.getElementById('terms')
};

const errorMessages = {
    nom: document.getElementById('nomError'),
    prenom: document.getElementById('prenomError'),
    email: document.getElementById('emailError'),
    password: document.getElementById('passwordError'),
    confirmPassword: document.getElementById('confirmPasswordError'),
    terms: document.getElementById('termsError')
};

// Listeners pour validation en temps réel
Object.keys(inputs).forEach(key => {
    if (key !== 'terms') {
        inputs[key].addEventListener('blur', () => validateField(key));
        inputs[key].addEventListener('input', () => {
            clearError(key);
            if (key === 'password') updatePasswordStrength();
        });
    } else {
        inputs[key].addEventListener('change', () => clearError(key));
    }
});

// Toggle password visibility
togglePasswordBtn.addEventListener('click', (e) => {
    e.preventDefault();
    togglePasswordVisibility(passwordInput, togglePasswordBtn);
});

toggleConfirmPasswordBtn.addEventListener('click', (e) => {
    e.preventDefault();
    togglePasswordVisibility(confirmPasswordInput, toggleConfirmPasswordBtn);
});

function togglePasswordVisibility(input, button) {
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    button.classList.toggle('active');
}

// Validation des champs
function validateField(fieldName) {
    const value = inputs[fieldName].value.trim();
    let error = '';

    switch (fieldName) {
        case 'nom':
            if (!value) error = 'Le nom est requis';
            else if (value.length < 2) error = 'Le nom doit contenir au moins 2 caractères';
            else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(value)) error = 'Le nom contient des caractères invalides';
            break;

        case 'prenom':
            if (!value) error = 'Le prénom est requis';
            else if (value.length < 2) error = 'Le prénom doit contenir au moins 2 caractères';
            else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(value)) error = 'Le prénom contient des caractères invalides';
            break;

        case 'email':
            if (!value) error = 'L\'email est requis';
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Email invalide';
            break;

        case 'password':
            if (!value) error = 'Le mot de passe est requis';
            else if (value.length < 8) error = 'Le mot de passe doit contenir au moins 8 caractères';
            else if (!/(?=.*[a-z])/.test(value)) error = 'Doit contenir au moins une minuscule';
            else if (!/(?=.*[A-Z])/.test(value)) error = 'Doit contenir au moins une majuscule';
            else if (!/(?=.*\d)/.test(value)) error = 'Doit contenir au moins un chiffre';
            break;

        case 'confirmPassword':
            if (!value) error = 'Veuillez confirmer le mot de passe';
            else if (value !== inputs.password.value) error = 'Les mots de passe ne correspondent pas';
            break;
    }

    if (error) {
        showError(fieldName, error);
        return false;
    }
    return true;
}

function validateCheckbox() {
    if (!inputs.terms.checked) {
        showError('terms', 'Vous devez accepter les conditions d\'utilisation');
        return false;
    }
    return true;
}

function showError(fieldName, message) {
    errorMessages[fieldName].textContent = message;
    if (fieldName !== 'terms') {
        inputs[fieldName].closest('.form-group').classList.add('error');
    }
}

function clearError(fieldName) {
    errorMessages[fieldName].textContent = '';
    if (fieldName !== 'terms') {
        inputs[fieldName].closest('.form-group').classList.remove('error');
    }
}

// Force du mot de passe
function updatePasswordStrength() {
    const password = passwordInput.value;
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    passwordStrength.classList.remove('weak', 'medium', 'strong');
    if (strength <= 2) passwordStrength.classList.add('weak');
    else if (strength <= 3) passwordStrength.classList.add('medium');
    else passwordStrength.classList.add('strong');
}

// Soumission du formulaire
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;

    Object.keys(inputs).forEach(key => {
        if (key !== 'terms') {
            if (!validateField(key)) {
                isValid = false;
            }
        }
    });

    if (!validateCheckbox()) {
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    const formData = {
        nom: inputs.nom.value.trim(),
        prenom: inputs.prenom.value.trim(),
        email: inputs.email.value.trim(),
        password: inputs.password.value,
        timestamp: new Date().toLocaleString('fr-FR')
    };

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    formMessage.classList.remove('success', 'error');
    formMessage.textContent = '';

    try {
        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.status === 'success') {
            showSuccessMessage('✓ Inscription réussie ! La mise à niveau sera effective d'ici 2 à 3 jours.');
            form.reset();
            passwordStrength.classList.remove('weak', 'medium', 'strong');
        } else {
            throw new Error(result.message || 'Erreur lors de l’inscription');
        }

    } catch (error) {
        showErrorMessage('✕ ' + error.message);
        console.error('Erreur:', error);

    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
});

function showSuccessMessage(message) {
    formMessage.textContent = message;
    formMessage.classList.add('success');
    formMessage.classList.remove('error');
    setTimeout(() => {
        formMessage.classList.remove('success');
    }, 5000);
}

function showErrorMessage(message) {
    formMessage.textContent = message;
    formMessage.classList.add('error');
    formMessage.classList.remove('success');
}

// Animation au chargement
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});
