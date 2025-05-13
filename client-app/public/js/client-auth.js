const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:4000/cleint' 
  : 'http://auth-service:3001/client';

// Show the selected tab (login or register)
function showTab(tabName) {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
  });

  document.getElementById(`tab-${tabName}`).classList.add('active');

  document.getElementById('login-form').classList.toggle('hidden', tabName !== 'login');
  document.getElementById('register-form').classList.toggle('hidden', tabName !== 'register');
}

// Utility to show error message
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = message;
  setTimeout(() => errorElement.textContent = '', 3000);
}

// Utility to show success message
function showSuccess(elementId, message) {
  const successElement = document.getElementById(elementId);
  successElement.textContent = message;
  setTimeout(() => successElement.textContent = '', 3000);
}

// Attach event listeners after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Tab click listeners
  const loginTab = document.getElementById('tab-login');
  const registerTab = document.getElementById('tab-register');

  loginTab.addEventListener('click', () => showTab('login'));
  registerTab.addEventListener('click', () => showTab('register'));

  // Show login tab by default
  showTab('login');

  // Login form handler
  document.getElementById('client-login').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('clientToken', data.token);
        window.location.href = '/client/dashboard';
      } else {
        showError('login-error', data.error || 'Login failed');
      }
    } catch (err) {
      showError('login-error', 'Network error. Please try again.');
    }
  });

  // Registration form handler
  document.getElementById('client-register').addEventListener('submit', async (e) => {
    e.preventDefault();
    const clientData = {
      nom: document.getElementById('reg-nom').value,
      prenom: document.getElementById('reg-prenom').value,
      adresse: document.getElementById('reg-adresse').value,
      cin: document.getElementById('reg-cin').value,
      email: document.getElementById('reg-email').value,
      tel: document.getElementById('reg-tel').value,
      password: document.getElementById('reg-password').value
    };

    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData)
      });

      const data = await response.json();

      if (response.ok) {
        showSuccess('register-success', 'Registration successful! Please login.');
        document.getElementById('client-register').reset();
        showTab('login');
      } else {
        showError('register-error', data.error || 'Registration failed');
      }
    } catch (err) {
      showError('register-error', 'Network error. Please try again.');
    }
  });
});
