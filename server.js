const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app    = express();
const router = express.Router();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ── Products ──────────────────────────────────────────────
const products = [
  { id: 1,  name: 'Butter Croissant',   category: 'pastries', price: 3.50,  description: 'Flaky, golden layers with rich European-style butter.',              inStock: true  },
  { id: 2,  name: 'Sourdough Loaf',     category: 'breads',   price: 9.00,  description: 'Long-fermented, crispy crust, chewy interior.',                      inStock: true  },
  { id: 3,  name: 'Strawberry Cake',    category: 'cakes',    price: 32.00, description: 'Light vanilla sponge layered with fresh strawberry cream.',          inStock: true  },
  { id: 4,  name: 'Matcha Cupcake',     category: 'cakes',    price: 4.25,  description: 'Earthy matcha cake topped with white chocolate frosting.',           inStock: true  },
  { id: 5,  name: 'Baguette',           category: 'breads',   price: 4.50,  description: 'Classic French style, golden crust, soft inside.',                  inStock: true  },
  { id: 6,  name: 'Pain au Chocolat',   category: 'pastries', price: 4.00,  description: 'Two dark chocolate batons wrapped in buttery dough.',               inStock: true  },
  { id: 7,  name: 'Almond Danish',      category: 'pastries', price: 4.75,  description: 'Laminated pastry filled with frangipane and sliced almonds.',       inStock: true  },
  { id: 8,  name: 'Cinnamon Twist',     category: 'pastries', price: 3.75,  description: 'Buttery pastry with cinnamon sugar swirled through every layer.',   inStock: true  },
  { id: 9,  name: 'Dark Chocolate Cake',category: 'cakes',    price: 36.00, description: 'Triple-layer chocolate sponge with ganache frosting.',              inStock: true  },
  { id: 10, name: 'Lemon Cupcake',      category: 'cakes',    price: 4.00,  description: 'Bright lemon zest cake with lemon curd buttercream.',               inStock: true  },
  { id: 11, name: 'Focaccia',           category: 'breads',   price: 7.00,  description: 'Olive oil, rosemary, and flaky sea salt.',                          inStock: true  },
  { id: 12, name: 'Rye Loaf',           category: 'breads',   price: 8.50,  description: 'Dense, earthy rye with caraway seeds.',                             inStock: false },
  { id: 13, name: 'Choc Chip Cookie',   category: 'cookies',  price: 2.75,  description: 'Brown butter, sea salt, loaded with chocolate chips.',              inStock: true  },
  { id: 14, name: 'Snickerdoodle',      category: 'cookies',  price: 2.50,  description: 'Soft and chewy with a cinnamon sugar crust.',                       inStock: true  },
  { id: 15, name: 'Pistachio Bar',      category: 'cookies',  price: 3.50,  description: 'Shortbread base, pistachio cream, crushed pistachios on top.',      inStock: true  },
  { id: 16, name: 'Brownie',            category: 'cookies',  price: 3.25,  description: 'Fudgy dark chocolate brownie with a crackly top.',                  inStock: true  },
];

// In-memory orders store
const orders = [];

// GET /api/products — list all products, optional ?category= filter
router.get('/products', (req, res) => {
  const { category } = req.query;
  const result = category
    ? products.filter(p => p.category === category)
    : products;
  res.json(result);
});

// GET /api/products/:id — get a single product by id
router.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// GET /api/menu — full menu grouped by category
router.get('/menu', (req, res) => {
  const menu = {};
  for (const p of products) {
    if (!menu[p.category]) menu[p.category] = [];
    menu[p.category].push(p);
  }
  res.json(menu);
});

// GET /api/specials — today's featured items (first 4 in-stock)
router.get('/specials', (req, res) => {
  const specials = products.filter(p => p.inStock).slice(0, 4);
  res.json(specials);
});

// GET /api/hours — bakery hours and location
router.get('/hours', (req, res) => {
  res.json({
    address: '42 Flour Street, Doughville',
    phone:   '(555) 012-3456',
    email:   'hello@goldencrumbbakery.com',
    hours: {
      monday:    '6:00 AM – 4:00 PM',
      tuesday:   '6:00 AM – 4:00 PM',
      wednesday: '6:00 AM – 4:00 PM',
      thursday:  '6:00 AM – 4:00 PM',
      friday:    '6:00 AM – 5:00 PM',
      saturday:  '7:00 AM – 5:00 PM',
      sunday:    'Closed',
    },
  });
});

// POST /api/orders — place a new order
router.post('/orders', (req, res) => {
  const { customerName, email, phone, items, fulfillment, pickupDate, notes } = req.body;
  if (!customerName || !email || !items || !items.length) {
    return res.status(400).json({ error: 'customerName, email, and items are required' });
  }
  const subtotal    = items.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee = fulfillment === 'delivery' ? 5 : 0;
  const tax         = (subtotal + deliveryFee) * 0.08;
  const order = {
    id:          orders.length + 1,
    orderNumber: 'GCB-' + String(Date.now()).slice(-6),
    customerName,
    email,
    phone:       phone || '',
    items,
    fulfillment: fulfillment || 'pickup',
    pickupDate:  pickupDate  || '',
    notes:       notes       || '',
    subtotal:    +subtotal.toFixed(2),
    deliveryFee: +deliveryFee.toFixed(2),
    tax:         +tax.toFixed(2),
    total:       +(subtotal + deliveryFee + tax).toFixed(2),
    status:      'confirmed',
    createdAt:   new Date().toISOString(),
  };
  orders.push(order);
  res.status(201).json(order);
});

// GET /api/orders — list all orders
router.get('/orders', (req, res) => {
  res.json(orders);
});

// GET /api/orders/:id — get a single order by id
router.get('/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// PATCH /api/orders/:id/status — update order status
router.patch('/orders/:id/status', (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (!order) return res.status(404).json({ error: 'Order not found' });
  const { status } = req.body;
  const valid = ['confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
  if (!valid.includes(status)) return res.status(400).json({ error: `status must be one of: ${valid.join(', ')}` });
  order.status = status;
  res.json(order);
});

// DELETE /api/orders/:id — cancel an order
router.delete('/orders/:id', (req, res) => {
  const idx = orders.findIndex(o => o.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Order not found' });
  orders[idx].status = 'cancelled';
  res.json({ message: 'Order cancelled', order: orders[idx] });
});

app.use('/api', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Golden Crumb API running at http://localhost:${PORT}`);
});
