import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './src/server/db.js';
import { generateToken, authMiddleware, AuthenticatedRequest } from './src/server/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(cors());
app.use(express.json());

// Real-time SSE notification subscribers
const sseClients: Response[] = [];

function broadcastNotification(notification: any) {
  sseClients.forEach(client => {
    try {
      client.write(`data: ${JSON.stringify(notification)}\n\n`);
    } catch {
      // client disconnected
    }
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'The Digital Estate API',
    version: '1.0.0',
    metrics: {
      propertiesCount: db.getAllProperties().length,
      activeChats: db.getChats().length,
      realtimeSubscribers: sseClients.length,
    }
  });
});

// Authentication Endpoints
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, password, role, phone } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Name, email, password, and role are required' });
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email address already exists' });
    }

    const user = db.createUser({
      name,
      email,
      password,
      role,
      phone: phone || '',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnC_CYf59wj1KWpQbKwTevMc93XUx8tDhFlMINQju0ESrB9wiHgs_Je71Nz198cKnEqi1SHyjucLymsHQleyHUKKjOaVMLWca93yqjqCO_vZwxG0bD4WCj7JtuktMjlttoB0Ub8Yaes96YQ3cjOww2JVjJk-4WXNVNT2QkV4Rw-mKfM2n3_kjJEoM1k9nrSkRnLvUtphuS-60KAtnmdbRetDo_rOh1IHTUZ8YPr85_2vJP71dxPx9kXxHfKdKnwXzIcajJxkoon9RB',
    });

    const token = generateToken(user);
    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
      },
      token,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal registration error' });
  }
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.findUserByEmail(email);
    if (!user || user.passwordHash !== password) {
      return res.status(401).json({ error: 'Invalid email address or password' });
    }

    const token = generateToken(user);
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
      },
      token,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal login error' });
  }
});

app.get('/api/auth/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const user = db.findUserById(req.user.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
    }
  });
});

// Properties Endpoints
app.get('/api/properties', (req: Request, res: Response) => {
  const { type, district, maxPrice, search } = req.query;
  let properties = db.getAllProperties();

  if (type && typeof type === 'string' && type !== 'All') {
    properties = properties.filter(p => p.propertyType.toLowerCase() === type.toLowerCase());
  }

  if (district && typeof district === 'string' && district !== 'All') {
    properties = properties.filter(p => p.district.toLowerCase().includes(district.toLowerCase()));
  }

  if (maxPrice && !isNaN(Number(maxPrice))) {
    properties = properties.filter(p => p.price <= Number(maxPrice));
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    properties = properties.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.district.toLowerCase().includes(q)
    );
  }

  res.json(properties);
});

app.get('/api/properties/:id', (req: Request, res: Response) => {
  const property = db.getPropertyById(req.params.id);
  if (!property) {
    return res.status(404).json({ error: 'Property not found' });
  }
  res.json({ property });
});

app.post('/api/properties', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, price, location, district, propertyType, beds, baths, areaSqMeters, description, imageUrl } = req.body;
    if (!title || !price || !location || !propertyType) {
      return res.status(400).json({ error: 'Title, price, location, and property type are required' });
    }

    const newProperty = db.addProperty({
      title,
      price: Number(price),
      formattedPrice: `$${Number(price).toLocaleString()}`,
      location,
      district: district || 'Kigali',
      propertyType,
      beds: beds ? Number(beds) : undefined,
      baths: baths ? Number(baths) : undefined,
      areaSqMeters: areaSqMeters ? Number(areaSqMeters) : undefined,
      status: 'Pending Approval',
      imageUrl: imageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqWz3SlViR7Ll3TPo1pk7UyIlc5ixxcyhdje3zzQGZvLkgSW8TcZR7Z1EeMY2YGkDiXu0i1J5YoOMvebjNpKrM4_Gk3S1LuK2z6eT9OFcLVAUm3HfWPoDZfyKPkOrGcZkyYgREduu7sVbGHVOVGhc-fb63-H921dxhyhp6PrR8vrBJ0FDC1Aw6RBpu96Ld-C5zeAELKSDMep_c1jDsuEVtdZ4CoUD43GN5MKAfC-WjxV7VxC1CUgjhUmn7PAyPDFNeQY-TwtydZawP',
      description: description || 'New luxury listing submission awaiting appraisal.',
      aiScore: Math.floor(Math.random() * 8) + 90,
      growthPotential: '+11.5% /yr',
      riskLevel: 'Very Low',
    });

    const notif = db.addNotification({
      title: 'New Listing Submitted',
      message: `${title} was submitted and is pending administrator valuation review.`,
      type: 'valuation',
    });
    broadcastNotification(notif);

    res.status(201).json({ property: newProperty });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error creating property' });
  }
});

// Chats & Concierge Endpoints
app.get('/api/chats', (req: Request, res: Response) => {
  res.json({ chats: db.getChats() });
});

app.get('/api/chats/:id/messages', (req: Request, res: Response) => {
  const messages = db.getMessages(req.params.id);
  res.json({ messages });
});

app.post('/api/chats/:id/messages', (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Message text is required' });
  }

  const userMsg = db.addMessage(req.params.id, text, 'user');

  // Automated Concierge smart response after 600ms
  setTimeout(() => {
    let reply = `Thank you for reaching out! Regarding ${text.toLowerCase().includes('view') ? 'viewing schedules' : 'this architectural portfolio'}, our Kigali team can organize private access tomorrow or facilitate digital closing documentation.`;
    if (text.toLowerCase().includes('price') || text.toLowerCase().includes('offer')) {
      reply = 'Under Emma & Dany representation, all offers are supported by independent RICS-standard valuations and clear title deeds with the Rwanda Land Management Authority.';
    } else if (text.toLowerCase().includes('site') || text.toLowerCase().includes('visit')) {
      reply = 'We have private executive chauffeur transport available for Rebero, Nyarutarama, and Bugesera visits. Would 10:00 AM or 2:30 PM suit you better?';
    }

    const agentMsg = db.addMessage(req.params.id, reply, 'agent');
    broadcastNotification({
      id: `notif-${Date.now()}`,
      title: 'New Concierge Message',
      message: `Agent Dany replied: "${reply.slice(0, 60)}..."`,
      time: 'Just now',
      read: false,
      type: 'message',
    });
  }, 600);

  res.status(201).json({ message: userMsg });
});

// Real-Time Notifications & SSE Stream
app.get('/api/notifications', (req: Request, res: Response) => {
  res.json({ notifications: db.getNotifications() });
});

app.post('/api/notifications/test', (req: Request, res: Response) => {
  const notif = db.addNotification({
    title: 'Instant Concierge Lead',
    message: 'A prospective diaspora buyer from Brussels requested a private viewing in Rebero.',
    type: 'lead',
  });
  broadcastNotification(notif);
  res.status(201).json(notif);
});

app.patch('/api/notifications/:id/read', (req: Request, res: Response) => {
  const success = db.markNotificationAsRead(req.params.id);
  res.json({ success });
});

app.get('/api/notifications/stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  sseClients.push(res);

  // Send initial ping
  res.write(`data: ${JSON.stringify({ type: 'connected', time: new Date().toISOString() })}\n\n`);

  req.on('close', () => {
    const idx = sseClients.indexOf(res);
    if (idx !== -1) sseClients.splice(idx, 1);
  });
});

// Valuation Request Endpoint
app.post('/api/valuations', (req: Request, res: Response) => {
  const { propertyName, district, sizeSqM, propertyType, contactEmail } = req.body;
  if (!propertyName || !district) {
    return res.status(400).json({ error: 'Property name and district are required' });
  }

  // Algorithmic valuation estimate based on district baseline
  const baselinePerSqM: Record<string, number> = {
    rebero: 1100,
    nyarutarama: 1550,
    kacyiru: 1300,
    gacuriro: 1250,
    kibagabaga: 950,
    bugesera: 350,
  };

  const key = district.toLowerCase();
  const rate = baselinePerSqM[key] || 1000;
  const area = Number(sizeSqM) || 350;
  const estimatedValuation = Math.round(area * rate * 1.15);

  const notif = db.addNotification({
    title: 'Instant Valuation Generated',
    message: `Estimated market value for "${propertyName}" in ${district}: $${estimatedValuation.toLocaleString()}.`,
    type: 'valuation',
  });
  broadcastNotification(notif);

  res.json({
    propertyName,
    district,
    estimatedValuation,
    formattedEstimate: `$${estimatedValuation.toLocaleString()}`,
    pricePerSqM: rate,
    confidenceScore: '94%',
    turnaround: 'Official signed RICS certification available within 24 hours.',
  });
});

// Portfolio Report Export Endpoint
app.get('/api/reports/portfolio', (req: Request, res: Response) => {
  const format = req.query.format === 'csv' ? 'csv' : 'json';
  const properties = db.getAllProperties();
  const totalValue = properties.reduce((acc, p) => acc + p.price, 0);

  if (format === 'csv') {
    const headers = 'ID,Title,District,Type,Price,Status,Views,Leads,AIScore\n';
    const rows = properties
      .map(p => `"${p.id}","${p.title}","${p.district}","${p.propertyType}",${p.price},"${p.status}",${p.views},${p.leads},${p.aiScore || ''}`)
      .join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="estate_portfolio_report.csv"');
    return res.send(headers + rows);
  }

  res.json({
    generatedAt: new Date().toISOString(),
    totalAssets: properties.length,
    totalPortfolioValue: totalValue,
    formattedTotalValue: `$${(totalValue / 1000000).toFixed(2)}M`,
    averageYield: '+12.4%',
    occupancyRate: '94%',
    quarterlyRevenue: '$124,500',
    properties,
  });
});

// Mount Vite or Static Files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`The Digital Estate server running on http://localhost:${PORT}`);
  });
}

startServer();
