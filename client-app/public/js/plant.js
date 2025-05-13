const API_BASE_URL = "http://localhost:4003/api/plants";
let authToken = localStorage.getItem('adminToken');

// Check if user is logged in
if (!authToken) {
  window.location.href = '/admin/login';
}

// DOM Elements
const logoutBtn = document.getElementById('logout-btn');
const plantsTable = document.getElementById('plant-table').querySelector('tbody');
const plantForm = document.getElementById('plant-form');

// Load plants on page load
loadPlants();

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

// Load Plants
async function loadPlants() {
  try {
    const response = await fetch(API_BASE_URL, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      handleUnauthorized();
      return;
    }

    const plants = await response.json();
    renderPlants(plants);
  } catch (err) {
    console.error('Failed to load plants:', err);
    showError('Failed to load plants');
  }
}

// Render Plants
function renderPlants(plants) {
  plantsTable.innerHTML = '';

  plants.forEach(plant => {
    const row = document.createElement('tr');
    row.dataset.id = plant._id;
    row.innerHTML = `
      <td>${plant._id}</td>
      <td contenteditable="true" data-field="titre">${plant.titre}</td>
      <td contenteditable="true" data-field="info_plantation">${plant.info_plantation}</td>
      <td contenteditable="true" data-field="info_materiaux">${plant.info_materiaux}</td>
      <td contenteditable="true" data-field="info_arrosage">${plant.info_arrosage}</td>
      <td contenteditable="true" data-field="info_climat">${plant.info_climat}</td>
      <td>
        <button class="action-btn save-btn" onclick="savePlant('${plant._id}')">Save</button>
        <button class="action-btn delete-btn" onclick="deletePlant('${plant._id}')">Delete</button>
      </td>
    `;
    plantsTable.appendChild(row);
  });
}

// Delete Plant
window.deletePlant = async (plantId) => {
  if (!confirm('Are you sure you want to delete this plant?')) return;

  try {
    const response = await fetch(`${API_BASE_URL}/${plantId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    if (response.status === 401) {
      handleUnauthorized();
      return;
    }

    if (response.ok) {
      loadPlants();
    } else {
      showError('Failed to delete plant');
    }
  } catch (err) {
    console.error('Delete failed:', err);
    showError('Failed to delete plant');
  }
};

// Save Plant
window.savePlant = async (plantId) => {
  const row = document.querySelector(`tr[data-id="${plantId}"]`);
  if (!row) return;

  const updatedPlant = {
    titre: row.querySelector('[data-field="titre"]').textContent,
    info_plantation: row.querySelector('[data-field="info_plantation"]').textContent,
    info_materiaux: row.querySelector('[data-field="info_materiaux"]').textContent,
    info_arrosage: row.querySelector('[data-field="info_arrosage"]').textContent,
    info_climat: row.querySelector('[data-field="info_climat"]').textContent
  };

  // Validate required fields
  if (!updatedPlant.titre || !updatedPlant.info_plantation || 
      !updatedPlant.info_materiaux || !updatedPlant.info_arrosage || 
      !updatedPlant.info_climat) {
    showError('All fields are required');
    loadPlants(); // Reload to discard changes
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${plantId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify(updatedPlant)
    });

    if (response.ok) {
      showSuccess('Plant updated successfully');
      loadPlants(); // Optional
    } else {
      if (response.status === 401) {
        handleUnauthorized();
        return;
      }
      showError('Failed to update plant');
      loadPlants(); // Reload to discard changes
    }
  } catch (err) {
    console.error('Save failed:', err);
    showError('Failed to update plant');
    loadPlants(); // Reload to discard changes
  }
}

// Add New Plant
if (plantForm) {
  plantForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const titre = document.getElementById('plant-titre').value;
    const info_plantation = document.getElementById('plant-plantation').value;
    const info_materiaux = document.getElementById('plant-materiaux').value;
    const info_arrosage = document.getElementById('plant-arrosage').value;
    const info_climat = document.getElementById('plant-climat').value;

    // Validate required fields
    if (!titre || !info_plantation || !info_materiaux || !info_arrosage || !info_climat) {
      showError('All fields are required');
      return;
    }

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ 
          titre, 
          info_plantation, 
          info_materiaux, 
          info_arrosage, 
          info_climat 
        })
      });

      if (response.ok) {
        loadPlants();
        plantForm.reset();
      } else {
        const errorData = await response.json();
        showError(errorData.message || 'Failed to create plant');
      }
    } catch (err) {
      console.error('Create failed:', err);
      showError('Failed to create plant');
    }
  });
}

// Helper Functions
function showError(message) {
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

function showSuccess(message) {
  let successDisplay = document.getElementById('success-display');
  if (!successDisplay) {
    successDisplay = document.createElement('div');
    successDisplay.id = 'success-display';
    successDisplay.className = 'success-message';
    successDisplay.style.position = 'fixed';
    successDisplay.style.top = '20px';
    successDisplay.style.right = '20px';
    successDisplay.style.padding = '10px 20px';
    successDisplay.style.backgroundColor = '#d4edda';
    successDisplay.style.color = '#155724';
    successDisplay.style.borderRadius = '5px';
    successDisplay.style.zIndex = '1000';
    document.body.appendChild(successDisplay);
  }

  successDisplay.textContent = message;
  setTimeout(() => {
    successDisplay.textContent = '';
  }, 3000);
}

function handleUnauthorized() {
  localStorage.removeItem('adminToken');
  window.location.href = '/admin/login';
}