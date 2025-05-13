const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:4000' 
  : 'http://auth-service:3001';
  let authToken = localStorage.getItem('adminToken');

// Check if user is logged in
if (!authToken) {
  window.location.href = '/admin/login';
}

// DOM Elements
const logoutBtn = document.getElementById('logout-btn');
const clientsTable = document.getElementById('clients-table').querySelector('tbody');
const newClientForm = document.getElementById('new-client-form');

// Load clients on page load
loadClients();

// Logout handler
logoutBtn.addEventListener('click', () => {
  fetch(`${API_BASE_URL}/admin/logout`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${authToken}` }
  }).finally(() => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  });
});

// Load Clients
async function loadClients() {
  try {
    const response = await fetch(`${API_BASE_URL}/clients`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    if (response.status === 401) {
      handleUnauthorized();
      return;
    }

    const clients = await response.json();
    renderClients(clients);
  } catch (err) {
    console.error('Failed to load clients:', err);
    showError('Failed to load clients');
  }
}

// Render Clients
function renderClients(clients) {
  clientsTable.innerHTML = '';
  
  clients.forEach(client => {
    const row = document.createElement('tr');
    row.dataset.id = client._id;
    row.innerHTML = `
      <td>${client._id}</td>
      <td contenteditable="true" data-field="nom">${client.nom}</td>
      <td contenteditable="true" data-field="prenom">${client.prenom}</td>
      <td contenteditable="true" data-field="adresse">${client.adresse}</td>
      <td contenteditable="true" data-field="cin">${client.cin}</td>
      <td contenteditable="true" data-field="email">${client.email}</td>
      <td contenteditable="true" data-field="tel">${client.tel}</td>
      <td>
        <button class="action-btn save-btn" onclick="saveClient('${client._id}')">Save</button>
        <button class="action-btn delete-btn" onclick="deleteClient('${client._id}')">Delete</button>
      </td>
    `;
    clientsTable.appendChild(row);
  });
}

// Delete Client
window.deleteClient = async (clientId) => {
  if (!confirm('Are you sure you want to delete this client?')) return;

  try {
    const response = await fetch(`${API_BASE_URL}/clients/${clientId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    if (response.status === 401) {
      handleUnauthorized();
      return;
    }

    if (response.ok) {
      loadClients();
    } else {
      showError('Failed to delete client');
    }
  } catch (err) {
    console.error('Delete failed:', err);
    showError('Failed to delete client');
  }
};

// Save Client
window.saveClient = async (clientId) => {
  const row = document.querySelector(`tr[data-id="${clientId}"]`);
  if (!row) return;

  const updatedClient = {
    nom: row.querySelector('[data-field="nom"]').textContent,
    prenom: row.querySelector('[data-field="prenom"]').textContent,
    adresse: row.querySelector('[data-field="adresse"]').textContent,
    cin: row.querySelector('[data-field="cin"]').textContent,
    email: row.querySelector('[data-field="email"]').textContent,
    tel: row.querySelector('[data-field="tel"]').textContent
  };

  // Validate required fields
  if (!updatedClient.nom || !updatedClient.prenom || !updatedClient.adresse || 
      !updatedClient.cin || !updatedClient.email || !updatedClient.tel) {
    showError('All fields are required');
    loadClients(); // Reload to discard changes
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/clients/${clientId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(updatedClient)
    });

    if (response.status === 401) {
      handleUnauthorized();
      return;
    }

    if (!response.ok) {
      showError('Failed to update client');
      loadClients(); // Reload to discard changes
    }
  } catch (err) {
    console.error('Save failed:', err);
    showError('Failed to update client');
    loadClients(); // Reload to discard changes
  }
};

// Add New Client
if (newClientForm) {
  newClientForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nom = document.getElementById('client-nom').value;
    const prenom = document.getElementById('client-prenom').value;
    const adresse = document.getElementById('client-adresse').value;
    const cin = document.getElementById('client-cin').value;
    const email = document.getElementById('client-email').value;
    const tel = document.getElementById('client-tel').value;
    const password = document.getElementById('client-password').value;

    try {
      const response = await fetch(`${API_BASE_URL}/clients`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ nom, prenom, adresse, cin, tel, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        loadClients();
        newClientForm.reset();
      } else {
        showError(data.error || 'Failed to create client');
      }
    } catch (err) {
      console.error('Create failed:', err);
      showError('Failed to create client');
    }
  });
}

// Helper Functions
function showError(message) {
  // Create or use an existing error display element
  let errorDisplay = document.getElementById('error-display');
  if (!errorDisplay) {
    errorDisplay = document.createElement('div');
    errorDisplay.id = 'error-display';
    errorDisplay.className = 'error-message';
    errorDisplay.style.position = 'fixed';
    errorDisplay.style.top = '20px';
    errorDisplay.style.right = '20px';
    errorDisplay.style.padding = '10px 20px';
    errorDisplay.style.backgroundColor = '#f8d7da';
    errorDisplay.style.color = '#721c24';
    errorDisplay.style.borderRadius = '5px';
    errorDisplay.style.zIndex = '1000';
    document.body.appendChild(errorDisplay);
  }
  
  errorDisplay.textContent = message;
  setTimeout(() => {
    errorDisplay.textContent = '';
  }, 3000);
}

function handleUnauthorized() {
  localStorage.removeItem('adminToken');
  window.location.href = '/admin/login';
}

// Make functions available globally
window.loadClients = loadClients;