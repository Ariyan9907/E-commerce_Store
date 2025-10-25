// Get product ID from URL
function getProductId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Load product details
async function loadProductDetails() {
    const productId = getProductId();
    
    if (!productId) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/products/${productId}`);
        const product = await response.json();

        if (response.ok) {
            displayProduct(product);
        } else {
            document.getElementById('product-detail').innerHTML = 
                '<p class="error-message">Product not found.</p>';
        }
    } catch (error) {
        console.error('Error loading product:', error);
        document.getElementById('product-detail').innerHTML = 
            '<p class="error-message">Error loading product details.</p>';
    }
}

// Display product
function displayProduct(product) {
    document.getElementById('product-detail').innerHTML = `
        <div class="product-detail-content">
            <div>
                <img src="${product.image_url}" alt="${product.name}" class="product-detail-image">
            </div>
            <div class="product-detail-info">
                <h1>${product.name}</h1>
                <span class="product-detail-category">${product.category}</span>
                <div class="product-price">$${parseFloat(product.price).toFixed(2)}</div>
                <p>${product.description}</p>
                <p class="product-stock">Available: ${product.stock} in stock</p>
                
                <div class="quantity-selector">
                    <label for="quantity">Quantity:</label>
                    <input type="number" id="quantity" min="1" max="${product.stock}" value="1">
                </div>

                <button class="btn btn-primary btn-block" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
                
                <a href="index.html" class="btn" style="margin-top: 1rem;">
                    ← Back to Products
                </a>
            </div>
        </div>
    `;
}

// Add to cart
async function addToCart(productId) {
    if (!checkAuth()) {
        alert('Please login to add items to cart');
        window.location.href = 'login.html';
        return;
    }

    const quantity = parseInt(document.getElementById('quantity').value);

    try {
        const response = await fetch(`${API_URL}/cart`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                product_id: productId,
                quantity: quantity
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Product added to cart!');
            updateCartCount();
        } else {
            alert(data.message || 'Error adding to cart');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Error adding to cart. Please try again.');
    }
}

// Load product on page load
document.addEventListener('DOMContentLoaded', loadProductDetails);
