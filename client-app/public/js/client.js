const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:4000/cleint' 
  : 'http://auth-service:3001/client';
  let authToken = localStorage.getItem('clientToken');

// Check if already logged in
if (authToken) {
  showClientDashboard();
  loadClientData();
}

// Tab switching
function showTab(tabName) {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelector(`.tab[onclick="showTab('${tabName}')"]`).classList.add('active');

  document.getElementById('login-form').classList.toggle('hidden', tabName !== 'login');
  document.getElementById('register-form').classList.toggle('hidden', tabName !== 'register');
}

// Login Handler
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
      authToken = data.token;
      localStorage.setItem('clientToken', authToken);
      showClientDashboard();
      loadClientData();
    } else {
      showError('login-error', data.error || 'Login failed');
    }
  } catch (err) {
    showError('login-error', 'Network error. Please try again.');
  }
});

// Registration Handler
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

// Load Client Data
async function loadClientData() {
  try {
    const response = await fetch(`${API_BASE_URL}/me`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    if (response.status === 401) {
      handleUnauthorized();
      return;
    }

    const client = await response.json();
    document.getElementById('client-name').textContent = `${client.nom} ${client.prenom}`;
    document.getElementById('client-email-display').textContent = client.email;
    document.getElementById('client-phone').textContent = client.tel;
    document.getElementById('client-address').textContent = client.adresse;
    document.getElementById('client-cin-display').textContent = client.cin;
  } catch (err) {
    console.error('Failed to load client data:', err);
    handleUnauthorized();
  }
}

// Logout Handler
document.getElementById('client-logout').addEventListener('click', () => {
  fetch(`${API_BASE_URL}/logout`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${authToken}` }
  }).finally(() => {
    localStorage.removeItem('clientToken');
    window.location.reload();
  });
});

// Helper Functions
function showClientDashboard() {
  document.getElementById('auth-forms').classList.add('hidden');
  document.getElementById('client-dashboard').classList.remove('hidden');
}

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = message;
  setTimeout(() => errorElement.textContent = '', 3000);
}

function showSuccess(elementId, message) {
  const successElement = document.getElementById(elementId);
  successElement.textContent = message;
  setTimeout(() => successElement.textContent = '', 3000);
}

function handleUnauthorized() {
  localStorage.removeItem('clientToken');
  window.location.reload();
}