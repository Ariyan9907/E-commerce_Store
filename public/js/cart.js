// Load cart
async function loadCart() {
    requireAuth();

    try {
        const response = await fetch(`${API_URL}/cart`, {
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (response.ok) {
            if (data.items.length === 0) {
                showEmptyCart();
            } else {
                displayCart(data);
            }
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error loading cart:', error);
        document.getElementById('cart-content').innerHTML = 
            '<p class="error-message">Error loading cart. Please try again.</p>';
    }
}

// Show empty cart
function showEmptyCart() {
    document.getElementById('cart-content').style.display = 'none';
    document.getElementById('cart-empty').style.display = 'block';
    document.getElementById('cart-items-container').style.display = 'none';
}

// Display cart
function displayCart(data) {
    document.getElementById('cart-content').style.display = 'none';
    document.getElementById('cart-empty').style.display = 'none';
    document.getElementById('cart-items-container').style.display = 'block';

    const cartItems = document.getElementById('cart-items');
    
    cartItems.innerHTML = data.items.map(item => `
        <div class="cart-item">
            <img src="${item.image_url}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <div class="cart-item-price">$${parseFloat(item.price).toFixed(2)}</div>
                <div>Subtotal: $${parseFloat(item.subtotal).toFixed(2)}</div>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-controls">
                    <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <input type="number" value="${item.quantity}" min="1" 
                           onchange="updateQuantity(${item.id}, this.value)">
                    <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <button class="btn btn-danger btn-small" onclick="removeFromCart(${item.id})">
                    Remove
                </button>
            </div>
        </div>
    `).join('');

    document.getElementById('cart-subtotal').textContent = `$${parseFloat(data.total).toFixed(2)}`;
    document.getElementById('cart-total').textContent = `$${parseFloat(data.total).toFixed(2)}`;
}

// Update quantity
async function updateQuantity(itemId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(itemId);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/cart/${itemId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ quantity: parseInt(newQuantity) })
        });

        if (response.ok) {
            loadCart();
            updateCartCount();
        } else {
            const data = await response.json();
            alert(data.message || 'Error updating cart');
        }
    } catch (error) {
        console.error('Error updating cart:', error);
        alert('Error updating cart. Please try again.');
    }
}

// Remove from cart
async function removeFromCart(itemId) {
    if (!confirm('Remove this item from cart?')) return;

    try {
        const response = await fetch(`${API_URL}/cart/${itemId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (response.ok) {
            loadCart();
            updateCartCount();
        } else {
            const data = await response.json();
            alert(data.message || 'Error removing item');
        }
    } catch (error) {
        console.error('Error removing item:', error);
        alert('Error removing item. Please try again.');
    }
}

// Load cart on page load
document.addEventListener('DOMContentLoaded', loadCart);
