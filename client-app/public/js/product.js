const API_BASE_URL = "http://localhost:4002/api/products";
  let authToken = localStorage.getItem('adminToken');

// Check if user is logged in
if (!authToken) {
    window.location.href = '/admin/login';
}

// DOM Elements
const logoutBtn = document.getElementById('logout-btn');
const productsTable = document.getElementById('product-table').querySelector('tbody');
const productForm = document.getElementById('product-form');

// Load products on page load
loadProducts();

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

// Load Products
async function loadProducts() {
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

        const products = await response.json();
        renderProducts(products);
    } catch (err) {
        console.error('Failed to load products:', err);
        showError('Failed to load products');
    }
}

// Render Products
function renderProducts(products) {
    productsTable.innerHTML = '';

    products.forEach(product => {
        const row = document.createElement('tr');
        row.dataset.id = product._id;
        row.innerHTML = `
            <td>${product._id}</td>
            <td contenteditable="true" data-field="nom">${product.nom}</td>
            <td contenteditable="true" data-field="prix">${product.prix}</td>
            <td contenteditable="true" data-field="stock">${product.stock}</td>
            <td contenteditable="true" data-field="id_categorie">${product.id_categorie || ''}</td>
            <td contenteditable="true" data-field="description">${product.description || ''}</td>
            <td>
                <button class="action-btn save-btn" onclick="saveProduct('${product._id}')">Save</button>
                <button class="action-btn delete-btn" onclick="deleteProduct('${product._id}')">Delete</button>
            </td>
        `;
        productsTable.appendChild(row);
    });
}

// Delete Product
window.deleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/${productId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (response.status === 401) {
            handleUnauthorized();
            return;
        }

        if (response.ok) {
            loadProducts();
        } else {
            showError('Failed to delete product');
        }
    } catch (err) {
        console.error('Delete failed:', err);
        showError('Failed to delete product');
    }
};

// Save Product
window.saveProduct = async (productId) => {
    const row = document.querySelector(`tr[data-id="${productId}"]`);
    if (!row) return;

    const updatedProduct = {
        nom: row.querySelector('[data-field="nom"]').textContent,
        prix: parseFloat(row.querySelector('[data-field="prix"]').textContent),
        stock: parseInt(row.querySelector('[data-field="stock"]').textContent),
        id_categorie: row.querySelector('[data-field="id_categorie"]').textContent || undefined,
        description: row.querySelector('[data-field="description"]').textContent || undefined
    };

    // Validate required fields
    if (!updatedProduct.nom || isNaN(updatedProduct.prix) || isNaN(updatedProduct.stock)) {
        showError('Name, Price and Stock are required fields');
        loadProducts(); // Reload to discard changes
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(updatedProduct)
        });
    
        if (response.ok) {
            showSuccess('Product updated successfully');
            loadProducts(); // Optional
        } else {
            if (response.status === 401) {
                handleUnauthorized();
                return;
            }
            showError('Failed to update product');
            loadProducts(); // Reload to discard changes
        }
    
    } catch (err) {
        console.error('Save failed:', err);
        showError('Failed to update product');
        loadProducts(); // Reload to discard changes
    }
}

// Add New Product
if (productForm) {
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nom = document.getElementById('product-name').value;
        const prix = parseFloat(document.getElementById('product-price').value);
        const stock = parseInt(document.getElementById('product-stock').value);
        const id_categorie = document.getElementById('product-category').value || undefined;
        const description = document.getElementById('product-description').value || undefined;

        // Validate required fields
        if (!nom || isNaN(prix) || isNaN(stock)) {
            showError('Name, Price and Stock are required fields');
            return;
        }

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ nom, prix, stock, id_categorie, description })
            });

            if (response.ok) {
                loadProducts();
                productForm.reset();
            } else {
                const errorData = await response.json();
                showError(errorData.message || 'Failed to create product');
            }
        } catch (err) {
            console.error('Create failed:', err);
            showError('Failed to create product');
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

function handleUnauthorized() {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
}