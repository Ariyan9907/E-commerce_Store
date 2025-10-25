// Load user's orders
async function loadOrders() {
    requireAuth();

    try {
        const response = await fetch(`${API_URL}/orders`, {
            headers: getAuthHeaders()
        });

        const orders = await response.json();

        if (response.ok) {
            if (orders.length === 0) {
                showEmptyOrders();
            } else {
                displayOrders(orders);
            }
        } else {
            throw new Error(orders.message);
        }
    } catch (error) {
        console.error('Error loading orders:', error);
        document.getElementById('orders-content').innerHTML = 
            '<p class="error-message">Error loading orders. Please try again.</p>';
    }
}

// Show empty orders state
function showEmptyOrders() {
    document.getElementById('orders-content').style.display = 'none';
    document.getElementById('orders-empty').style.display = 'block';
}

// Display orders
function displayOrders(orders) {
    document.getElementById('orders-content').style.display = 'none';
    document.getElementById('orders-empty').style.display = 'none';

    const ordersList = document.getElementById('orders-list');
    
    ordersList.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <h3>Order #${order.id}</h3>
                    <p>Date: ${new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                    <span class="order-status ${order.status}">${order.status.toUpperCase()}</span>
                </div>
            </div>
            <div class="order-details">
                <p><strong>Total:</strong> $${parseFloat(order.total_amount).toFixed(2)}</p>
                <p><strong>Items:</strong> ${order.item_count}</p>
                ${order.shipping_address ? `
                    <p><strong>Shipping Address:</strong></p>
                    <pre style="background: #f4f4f4; padding: 10px; border-radius: 5px; font-size: 0.9rem;">
${JSON.parse(order.shipping_address).full_name}
${JSON.parse(order.shipping_address).address}
${JSON.parse(order.shipping_address).city}, ${JSON.parse(order.shipping_address).postal_code}
${JSON.parse(order.shipping_address).country}
Phone: ${JSON.parse(order.shipping_address).phone}
                    </pre>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Load orders on page load
document.addEventListener('DOMContentLoaded', loadOrders);
