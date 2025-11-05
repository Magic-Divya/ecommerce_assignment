const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');


const router = express.Router();


// Get all products (public)
router.get('/', async (req, res) => {
const products = await Product.find();
res.json(products);
});


// Create product (admin)
router.post('/', auth, async (req, res) => {
if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
const { name, description, price, stock } = req.body;
const p = new Product({ name, description, price, stock });
await p.save();
res.json(p);
});


// Edit
router.put('/:id', auth, async (req, res) => {
if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
res.json(p);
});


// Delete
router.delete('/:id', auth, async (req, res) => {
if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
await Product.findByIdAndDelete(req.params.id);
res.json({ message: 'Deleted' });
});


module.exports = router;