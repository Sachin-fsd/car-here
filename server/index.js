// ...existing code...
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const http = require('http');
const { Server } = require('socket.io');

// Initialize Stripe only if the key is available
let stripe;
try {
  const Stripe = require('stripe');
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  }
} catch (err) {
  console.log('Stripe not configured or not installed');
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.SOCKET_IO_ORIGIN || '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors({
  origin: [
    'https://car-here.vercel.app/',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://placeholder.supabase.co', 
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
);


// API routes
try {
  app.use('/api/auth', require('./routes/auth'));
} catch (err) {
  console.log('Auth routes not found, creating basic auth endpoint');
  app.get('/api/auth', (req, res) => res.json({ message: 'Auth endpoint - configure routes/auth.js' }));
}

try {
  app.use('/api/rides', require('./routes/rides'));
} catch (err) {
  console.log('Rides routes not found, creating basic rides endpoint');
  app.get('/api/rides', (req, res) => res.json({ message: 'Rides endpoint - configure routes/rides.js' }));
}

try {
  app.use('/api/payments', require('./routes/payments'));
} catch (err) {
  console.log('Payments routes not found, creating basic payments endpoint');
  app.get('/api/payments', (req, res) => res.json({ message: 'Payments endpoint - configure routes/payments.js' }));
}

try {
  app.use('/api/reviews', require('./routes/reviews'));
} catch (err) {
  console.log('Reviews routes not found, creating basic reviews endpoint');
  app.get('/api/reviews', (req, res) => res.json({ message: 'Reviews endpoint - configure routes/reviews.js' }));
}

try {
  app.use('/api/stripe', require('./routes/stripe'));
} catch (err) {
  console.log('Stripe routes not found, creating basic stripe endpoint');
  app.post('/api/stripe/create-checkout-session', (req, res) => {
    res.json({ message: 'Stripe endpoint - configure routes/stripe.js', error: 'Route not implemented' });
  });
}

// Example route
app.get('/', (req, res) => {
  res.send('Vr00m backend running!');
});


// WebSocket events
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Rider requests a ride (for live updates)
  socket.on('joinRideRoom', (rideId) => {
    socket.join(`ride_${rideId}`);
  });

  // Driver accepts a ride
  socket.on('acceptRide', ({ rideId, driverId }) => {
    // Notify all in the ride room
    io.to(`ride_${rideId}`).emit('rideAccepted', { rideId, driverId });
  });

  // Ride status update (e.g., picked up, completed)
  socket.on('rideStatus', ({ rideId, status }) => {
    io.to(`ride_${rideId}`).emit('rideStatusUpdate', { rideId, status });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
