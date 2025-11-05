const express = require('express');
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');


const router = express.Router();


// Checkout -> create order
router.post('/checkout', auth, async (req, res) => {
await req.user.populate('cart.product');
if (!req.user.cart.length) return res.status(400).json({ message: 'Cart empty' });


const items = req.user.cart.map(i => ({
product: i.product._id,
quantity: i.quantity,
price: i.product.price
}));


const total = items.reduce((s, it) => s + it.price * it.quantity, 0);


const order = new Order({ user: req.user._id, items, total });
await order.save();


// Optionally reduce stock
for (const it of items) {
await Product.findByIdAndUpdate(it.product, { $inc: { stock: -it.quantity } });
}


// Clear cart
req.user.cart = [];
await req.user.save();


res.json(order);
});


// Get my orders
router.get('/my', auth, async (req, res) => {
const orders = await Order.find({ user: req.user._id }).populate('items.product');
res.json(orders);
});


module.exports = router;