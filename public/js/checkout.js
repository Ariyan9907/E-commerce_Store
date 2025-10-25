let cartData = null;

// Load cart for checkout
async function loadCheckoutCart() {
    requireAuth();

    try {
        const response = await fetch(`${API_URL}/cart`, {
            headers: getAuthHeaders()
        });

        const data = await response.json();

        if (response.ok) {
            if (data.items.length === 0) {
                alert('Your cart is empty!');
                window.location.href = 'index.html';
            } else {
                cartData = data;
                displayOrderSummary(data);
            }
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error loading cart:', error);
        alert('Error loading cart. Please try again.');
        window.location.href = 'cart.html';
    }
}

// Display order summary
function displayOrderSummary(data) {
    const orderItems = document.getElementById('order-items');
    
    orderItems.innerHTML = data.items.map(item => `
        <div class="order-item">
            <div>
                <strong>${item.name}</strong><br>
                <small>Qty: ${item.quantity}</small>
            </div>
            <div>$${parseFloat(item.subtotal).toFixed(2)}</div>
        </div>
    `).join('');

    document.getElementById('order-subtotal').textContent = `$${parseFloat(data.total).toFixed(2)}`;
    document.getElementById('order-total').textContent = `$${parseFloat(data.total).toFixed(2)}`;
}

// Handle checkout form submission
document.addEventListener('DOMContentLoaded', () => {
    loadCheckoutCart();

    const form = document.getElementById('checkout-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const shippingAddress = {
            full_name: document.getElementById('full-name').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            postal_code: document.getElementById('postal-code').value,
            country: document.getElementById('country').value,
            phone: document.getElementById('phone').value
        };

        try {
            const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    shipping_address: JSON.stringify(shippingAddress)
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Order placed successfully! Order ID: ${data.order_id}`);
                updateCartCount();
                window.location.href = 'orders.html';
            } else {
                alert(data.message || 'Error placing order');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Error placing order. Please try again.');
        }
    });
});
