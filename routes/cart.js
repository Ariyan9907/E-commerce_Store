const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Get user's cart
router.get('/', authMiddleware, async (req, res) => {
    try {
        const [cartItems] = await db.query(
            `SELECT c.id, c.quantity, p.id as product_id, p.name, p.price, p.image_url, 
             (p.price * c.quantity) as subtotal
             FROM cart c
             JOIN products p ON c.product_id = p.id
             WHERE c.user_id = ?`,
            [req.user.id]
        );

        const total = cartItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);

        res.json({ items: cartItems, total });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error: error.message });
    }
});

// Add item to cart
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { product_id, quantity } = req.body;

        // Check if product exists and has stock
        const [products] = await db.query('SELECT * FROM products WHERE id = ?', [product_id]);

        if (products.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (products[0].stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        // Check if item already in cart
        const [existingItems] = await db.query(
            'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
            [req.user.id, product_id]
        );

        if (existingItems.length > 0) {
            // Update quantity
            await db.query(
                'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
                [quantity, req.user.id, product_id]
            );
        } else {
            // Add new item
            await db.query(
                'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
                [req.user.id, product_id, quantity]
            );
        }

        res.status(201).json({ message: 'Item added to cart' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding to cart', error: error.message });
    }
});

// Update cart item quantity
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { quantity } = req.body;

        await db.query(
            'UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?',
            [quantity, req.params.id, req.user.id]
        );

        res.json({ message: 'Cart updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart', error: error.message });
    }
});

// Remove item from cart
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await db.query(
            'DELETE FROM cart WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );

        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing from cart', error: error.message });
    }
});

// Clear cart
router.delete('/', authMiddleware, async (req, res) => {
    try {
        await db.query('DELETE FROM cart WHERE user_id = ?', [req.user.id]);
        res.json({ message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing cart', error: error.message });
    }
});

module.exports = router;
