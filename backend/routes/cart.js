const express = require('express');
const auth = require('../middleware/auth');
const Product = require('../models/Product');


const router = express.Router();


// Add to cart
router.post('/add', auth, async (req, res) => {
const { productId, quantity = 1 } = req.body;
const product = await Product.findById(productId);
if (!product) return res.status(404).json({ message: 'Product not found' });


const existing = req.user.cart.find(i => i.product.toString() === productId);
if (existing) existing.quantity += quantity;
else req.user.cart.push({ product: productId, quantity });


await req.user.save();
res.json(req.user.cart);
});


// Remove from cart
router.post('/remove', auth, async (req, res) => {
const { productId } = req.body;
req.user.cart = req.user.cart.filter(i => i.product.toString() !== productId);
await req.user.save();
res.json(req.user.cart);
});


// Get cart
router.get('/', auth, async (req, res) => {
await req.user.populate('cart.product');
res.json(req.user.cart);
});


module.exports = router;