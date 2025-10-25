// Check authentication status
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    const authLink = document.getElementById('auth-link');
    const userInfo = document.getElementById('user-info');
    const usernameDisplay = document.getElementById('username-display');

    if (token && user) {
        if (authLink) authLink.style.display = 'none';
        if (userInfo) userInfo.style.display = 'flex';
        if (usernameDisplay) usernameDisplay.textContent = user.username;

        // Setup logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }
    } else {
        if (authLink) authLink.style.display = 'block';
        if (userInfo) userInfo.style.display = 'none';
    }

    return !!token;
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Get auth headers
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// Require authentication for protected pages
function requireAuth() {
    if (!checkAuth()) {
        window.location.href = 'login.html';
    }
}

// Update cart count
async function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (!cartCount) return;

    const token = localStorage.getItem('token');
    if (!token) {
        cartCount.textContent = '0';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/cart`, {
            headers: getAuthHeaders()
        });

        if (response.ok) {
            const data = await response.json();
            const count = data.items.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = count;
        }
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    updateCartCount();
});
