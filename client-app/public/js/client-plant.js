document.addEventListener('DOMContentLoaded', () => {
  const API_BASE_URL = "http://localhost:4003/api/plants";
  const authToken = localStorage.getItem('clientToken');

  if (!authToken) {
    window.location.href = '/client/login';
    return;
  }

  // Load client name (optional: if plant API has /me route)
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
  });

  // Fetch plants
  fetch(`${API_BASE_URL}/client`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  })
  .then(response => response.json())
  .then(plants => {
    const container = document.getElementById('plants-container');
    plants.forEach(plant => {
      const card = document.createElement('div');
      card.className = 'plant-card';
      card.innerHTML = `
        <h3>${plant.name}</h3>
        <p>${plant.description}</p>
        <p>Type: ${plant.type}</p>
      `;
      container.appendChild(card);
    });
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
