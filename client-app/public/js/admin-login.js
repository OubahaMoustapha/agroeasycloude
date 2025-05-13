// Use the correct URL based on environment
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:4000' 
  : 'http://auth-service:3001';
  const loginForm = document.getElementById('login');
const loginError = document.getElementById('login-error');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  try {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login: username, password })
    });

    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('adminToken', data.token);
      window.location.href = '/admin/dashboard';
    } else {
      showError(data.error || 'Login failed');
    }
  } catch (err) {
    showError('Network error. Please try again.');
  }
});

function showError(message) {
  loginError.textContent = message;
  setTimeout(() => loginError.textContent = '', 3000);
}