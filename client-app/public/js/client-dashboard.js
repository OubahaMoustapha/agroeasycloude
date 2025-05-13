document.addEventListener('DOMContentLoaded', () => {
  const authToken = localStorage.getItem('clientToken');
  
  if (!authToken) {
    window.location.href = '/client/login';
    return;
  }

  // Load client name
  fetch(`${API_BASE_URL}/me`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  })
  .then(response => {
    if (response.status === 401) {
      localStorage.removeItem('clientToken');
      window.location.href = '/client/login';
    }
    return response.json();
  })
  .then(client => {
    document.getElementById('client-name').textContent = `${client.nom} ${client.prenom}`;
  })
  .catch(err => {
    console.error('Error loading client data:', err);
    localStorage.removeItem('clientToken');
    window.location.href = '/client/login';
  });

  // Logout handler
  document.getElementById('client-logout').addEventListener('click', () => {
    fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` }
    }).finally(() => {
      localStorage.removeItem('clientToken');
      window.location.href = '/client/login';
    });
  });
});