document.addEventListener('DOMContentLoaded', () => {
  const API_BASE_URL = "http://localhost:4002/api/products";
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
  });

  // Fetch products
  fetch(`${API_BASE_URL}/client`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  })
  .then(response => response.json())
  .then(products => {
    const container = document.getElementById('products-container');
    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p>Price: $${product.price}</p>
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
