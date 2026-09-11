import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory data store with file persistence
const productsFile = path.join(__dirname, 'data', 'products.json');
const optionsFile = path.join(__dirname, 'data', 'options.json');
const ordersFile = path.join(__dirname, 'data', 'orders.json');
const reviewsFile = path.join(__dirname, 'data', 'reviews.json');

let products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));
let options = JSON.parse(fs.readFileSync(optionsFile, 'utf8'));
let orders = fs.existsSync(ordersFile) ? JSON.parse(fs.readFileSync(ordersFile, 'utf8')) : [
  {
    id: "SMASH-98241",
    customer: {
      name: "Marcus Tan",
      email: "marcus.tan@example.com",
      address: "88 Badminton Court Blvd, Suite 4B, Seattle, WA 98101"
    },
    items: [
      {
        productId: "yonex-astrox-100zz",
        productName: "Yonex Astrox 100ZZ (Kurenai)",
        price: 249.99,
        quantity: 1,
        weightClass: "4U (83g)",
        gripSize: "G5",
        string: {
          name: "Yonex BG80 Power (0.68mm)",
          tension: 28,
          price: 18.00
        },
        grip: {
          name: "Yonex Super Grap (Electric Neon Yellow)",
          price: 3.50
        },
        stencil: {
          name: "Yonex YY Logo (Crimson Red)",
          price: 4.00
        },
        itemTotal: 275.49
      }
    ],
    voucher: "SMASH20",
    discountAmount: 55.10,
    shippingFee: 0.00,
    subtotal: 275.49,
    total: 220.39,
    status: "Stringing & Tension Check",
    statusSteps: [
      { label: "Order Received", done: true, time: "Today 10:15 AM" },
      { label: "Stringing Workshop", done: true, time: "Today 11:30 AM (28 lbs on Yonex ES5 Pro)" },
      { label: "Quality & Tension Calibration", done: true, time: "Today 01:00 PM (Electronic frequency test)" },
      { label: "Dispatched with Courier", done: false, time: "Est. Tomorrow" },
      { label: "Delivered", done: false, time: "Est. 2-3 Days" }
    ],
    paymentMethod: "Credit Card (Visa **** 4242)",
    paymentStatus: "Paid",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString()
  }
];

let reviews = fs.existsSync(reviewsFile) ? JSON.parse(fs.readFileSync(reviewsFile, 'utf8')) : [
  {
    id: "rev-1",
    productId: "yonex-astrox-100zz",
    author: "Darren Chen (Semi-Pro League)",
    rating: 5,
    date: "2 days ago",
    verifiedPurchase: true,
    title: "The smash power is downright terrifying",
    comment: "Strung with BG80 Power at 28 lbs. The hyper slim shaft cuts through air with zero resistance. The head weight kicks in right at contact point to drive shuttles steep and flat into the floor.",
    ratings: { power: 5, speed: 4.5, control: 5 }
  },
  {
    id: "rev-2",
    productId: "yonex-nanoflare-1000z",
    author: "Kevin Sukamuljo Fan",
    rating: 5,
    date: "5 days ago",
    verifiedPurchase: true,
    title: "Fastest racket recovery I have ever swung",
    comment: "For double drives and net kills, nothing comes close. The aerodynamic Sonic Flare frame lets you intercept flat shots effortlessly. Instant reflex upgrade.",
    ratings: { power: 4.5, speed: 5, control: 5 }
  },
  {
    id: "rev-3",
    productId: "victor-thruster-ryuga-ii",
    author: "Aditya Sharma",
    rating: 5,
    date: "1 week ago",
    verifiedPurchase: true,
    title: "Pure aggression with crisp feel",
    comment: "The Free Core handle reduces vibrations dramatically compared to Gen 1 Ryuga. Smash trajectory is noticeably steeper. Definitely recommend getting 4U if playing long matches.",
    ratings: { power: 5, speed: 4, control: 4.5 }
  },
  {
    id: "rev-4",
    productId: "lining-halbertec-9000",
    author: "Hiroshi Sato",
    rating: 5,
    date: "2 weeks ago",
    verifiedPurchase: true,
    title: "Surgical precision for deceptive touch players",
    comment: "The 6.6mm hard flex shaft offers supreme shuttle feedback. Drop shots land millimeters over the tape and cross-court slices have extreme bite.",
    ratings: { power: 4.5, speed: 4.8, control: 5 }
  }
];

function persistData() {
  try {
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
    fs.writeFileSync(reviewsFile, JSON.stringify(reviews, null, 2));
  } catch (err) {
    console.error("Failed to persist data:", err);
  }
}

// Routes
// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'SMASHPRO Badminton HQ API', timestamp: new Date() });
});

// 2. Get Products (Search, Filter, Sort)
app.get('/api/products', (req, res) => {
  const { brand, playstyle, flex, weight, minPrice, maxPrice, q, sort, featured } = req.query;
  
  let result = [...products];

  if (q) {
    const query = q.toLowerCase();
    result = result.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.series.toLowerCase().includes(query) ||
      p.tagline.toLowerCase().includes(query) ||
      (p.playerSignature && p.playerSignature.toLowerCase().includes(query)) ||
      p.specs.playstyle.toLowerCase().includes(query)
    );
  }

  if (brand && brand !== 'all') {
    const brands = brand.split(',').map(b => b.toLowerCase());
    result = result.filter(p => brands.includes(p.brand.toLowerCase()));
  }

  if (playstyle && playstyle !== 'all') {
    const styles = playstyle.split(',').map(s => s.toLowerCase());
    result = result.filter(p => styles.includes(p.specs.playstyleCategory.toLowerCase()) || styles.includes(p.specs.playstyle.toLowerCase()));
  }

  if (flex && flex !== 'all') {
    const flexes = flex.split(',').map(f => f.toLowerCase());
    result = result.filter(p => flexes.some(f => p.specs.flex.toLowerCase().includes(f)));
  }

  if (weight && weight !== 'all') {
    const weights = weight.split(',').map(w => w.toLowerCase());
    result = result.filter(p => p.specs.weightClass.some(wc => weights.some(w => wc.toLowerCase().includes(w))));
  }

  if (minPrice) {
    result = result.filter(p => p.price >= parseFloat(minPrice));
  }

  if (maxPrice) {
    result = result.filter(p => p.price <= parseFloat(maxPrice));
  }

  if (featured === 'true') {
    result = result.filter(p => p.featured);
  }

  // Sorting
  if (sort) {
    if (sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'power') {
      result.sort((a, b) => (b.radar?.power || 0) - (a.radar?.power || 0));
    } else if (sort === 'speed') {
      result.sort((a, b) => (b.radar?.speed || 0) - (a.radar?.speed || 0));
    } else if (sort === 'control') {
      result.sort((a, b) => (b.radar?.control || 0) - (a.radar?.control || 0));
    } else if (sort === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  res.json({
    total: result.length,
    products: result
  });
});

// 3. Featured Products
app.get('/api/featured', (req, res) => {
  const featured = products.filter(p => p.featured);
  res.json(featured);
});

// 4. Brands summary
app.get('/api/brands', (req, res) => {
  const brandMap = {};
  products.forEach(p => {
    brandMap[p.brand] = (brandMap[p.brand] || 0) + 1;
  });
  const brands = Object.keys(brandMap).map(name => ({
    name,
    count: brandMap[name]
  }));
  res.json(brands);
});

// 5. Options (Strings, Grips, Stencils, Vouchers, Quiz)
app.get('/api/options', (req, res) => {
  res.json(options);
});

// 6. Single Product by ID
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const productReviews = reviews.filter(r => r.productId === product.id);
  const related = products
    .filter(p => p.id !== product.id && (p.brand === product.brand || p.specs.playstyleCategory === product.specs.playstyleCategory))
    .slice(0, 4);

  res.json({
    ...product,
    reviews: productReviews,
    related
  });
});

// 7. Product Reviews
app.post('/api/products/:id/reviews', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const { author, rating, title, comment, ratings } = req.body;
  if (!author || !rating || !comment) {
    return res.status(400).json({ error: 'Author, rating, and comment are required' });
  }

  const newReview = {
    id: `rev-${Date.now()}`,
    productId: product.id,
    author,
    rating: parseFloat(rating),
    date: 'Just now',
    verifiedPurchase: true,
    title: title || 'Verified Badminton Player Review',
    comment,
    ratings: ratings || { power: 5, speed: 4.5, control: 5 }
  };

  reviews.unshift(newReview);
  
  // Recompute product rating
  const pReviews = reviews.filter(r => r.productId === product.id);
  const avg = pReviews.reduce((sum, r) => sum + r.rating, 0) / pReviews.length;
  product.rating = Math.round(avg * 100) / 100;
  product.reviewCount = pReviews.length;

  persistData();

  res.status(201).json(newReview);
});

// 8. Racket Matchmaker Quiz Algorithm
app.post('/api/quiz/recommend', (req, res) => {
  const { skill_level, court_preference, playstyle_goal, weight_preference } = req.body;

  let scored = products.map(product => {
    let score = 50; // base score

    // Playstyle alignment
    if (playstyle_goal === 'heavy_smash' && product.specs.playstyleCategory === 'power') score += 25;
    if (playstyle_goal === 'fast_defense' && product.specs.playstyleCategory === 'speed') score += 25;
    if (playstyle_goal === 'pinpoint_control' && product.specs.playstyleCategory === 'control') score += 25;

    // Court preference alignment
    if (court_preference === 'singles' && product.specs.playstyleCategory === 'power') score += 15;
    if (court_preference === 'doubles_back' && product.specs.playstyleCategory === 'power') score += 15;
    if (court_preference === 'doubles_front' && product.specs.playstyleCategory === 'speed') score += 15;
    if (court_preference === 'all_around' && product.specs.playstyleCategory === 'control') score += 15;

    // Skill level & flex match
    if (skill_level === 'beginner' && (product.specs.flex.includes('Flexible') || product.specs.flex.includes('Medium'))) score += 15;
    if (skill_level === 'advanced' && (product.specs.flex.includes('Extra Stiff') || product.specs.flex.includes('Stiff'))) score += 15;
    if (skill_level === 'intermediate') score += 10;

    // Weight class match
    if (weight_preference) {
      const match = product.specs.weightClass.some(wc => wc.toLowerCase().includes(weight_preference.toLowerCase()));
      if (match) score += 10;
    }

    const matchPercent = Math.min(99, Math.max(72, score));

    return {
      product,
      matchScore: matchPercent,
      matchReasons: [
        `Optimal ${product.specs.playstyle} balance tailored for your shot selection`,
        `${product.specs.flex} shaft matches your wrist swing tempo`,
        `Endorsed by ${product.playerSignature || 'world-class competitors'}`
      ]
    };
  });

  scored.sort((a, b) => b.matchScore - a.matchScore);

  res.json({
    recommendations: scored.slice(0, 4)
  });
});

// 9. Vouchers check
app.post('/api/voucher/validate', (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ valid: false, error: 'Code required' });
  const voucher = options.vouchers.find(v => v.code.toUpperCase() === code.toUpperCase().trim());
  if (!voucher) {
    return res.status(404).json({ valid: false, message: 'Invalid or expired promo voucher code' });
  }
  res.json({ valid: true, voucher });
});

// 10. Create Order
app.post('/api/orders', (req, res) => {
  const { customer, items, voucher, subtotal, discountAmount, shippingFee, total, paymentMethod } = req.body;

  if (!customer || !items || !items.length) {
    return res.status(400).json({ error: 'Customer information and order items are required' });
  }

  const orderId = `SMASH-${Math.floor(10000 + Math.random() * 90000)}`;

  const newOrder = {
    id: orderId,
    customer,
    items,
    voucher: voucher || null,
    discountAmount: discountAmount || 0,
    shippingFee: shippingFee || 0,
    subtotal,
    total,
    status: "Stringing & Tension Workshop",
    statusSteps: [
      { label: "Order Received & Verified", done: true, time: "Just now" },
      { label: "Stringing Studio (Electronic Tensioner)", done: true, time: "In Queue" },
      { label: "Custom Grip & Stencil Application", done: false, time: "Pending" },
      { label: "Dispatched with Courier Tracking", done: false, time: "Est. 24-48 Hours" },
      { label: "Delivered to Doorstep", done: false, time: "Est. 2-3 Business Days" }
    ],
    paymentMethod: paymentMethod || "Credit Card (Simulated Secure Gateway)",
    paymentStatus: "Paid - Verified",
    createdAt: new Date().toISOString()
  };

  // Reduce product inventory
  items.forEach(item => {
    const prod = products.find(p => p.id === item.productId);
    if (prod && prod.stock > 0) {
      prod.stock -= item.quantity || 1;
    }
  });

  orders.unshift(newOrder);
  persistData();

  res.status(201).json({
    success: true,
    orderId: newOrder.id,
    order: newOrder
  });
});

// 11. Get Order by ID (Live Tracking)
app.get('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o.id.toUpperCase() === req.params.id.toUpperCase());
  if (!order) {
    return res.status(404).json({ error: 'Order not found. Please check your order ID.' });
  }
  res.json(order);
});

// 12. Admin Metrics & Management
app.get('/api/admin/metrics', (req, res) => {
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock < 12);
  
  res.json({
    revenue: Math.round(totalRevenue * 100) / 100,
    totalOrders: orders.length,
    totalProducts,
    lowStockCount: lowStockProducts.length,
    recentOrders: orders.slice(0, 6),
    lowStockProducts
  });
});

// Admin Add Product
app.post('/api/admin/products', (req, res) => {
  const productData = req.body;
  if (!productData.name || !productData.brand || !productData.price) {
    return res.status(400).json({ error: 'Name, brand and price are required' });
  }

  const id = productData.id || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const newProduct = {
    id,
    rating: 5.0,
    reviewCount: 0,
    stock: parseInt(productData.stock) || 10,
    featured: Boolean(productData.featured),
    image: productData.image || "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80",
    gallery: [
      productData.image || "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80"
    ],
    ...productData
  };

  products.unshift(newProduct);
  persistData();

  res.status(201).json(newProduct);
});

// Admin Update Product
app.put('/api/admin/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products[index] = { ...products[index], ...req.body };
  persistData();

  res.json(products[index]);
});

// Admin Delete Product
app.delete('/api/admin/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const deleted = products.splice(index, 1);
  persistData();

  res.json({ message: 'Product deleted', product: deleted[0] });
});

// Admin Update Order Status
app.patch('/api/admin/orders/:id/status', (req, res) => {
  const order = orders.find(o => o.id.toUpperCase() === req.params.id.toUpperCase());
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const { status, stepIndex } = req.body;
  if (status) order.status = status;
  if (typeof stepIndex === 'number' && order.statusSteps[stepIndex]) {
    order.statusSteps[stepIndex].done = true;
    order.statusSteps[stepIndex].time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  persistData();
  res.json(order);
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🏸 SMASHPRO Badminton Store API running on http://localhost:${PORT}`);
});
