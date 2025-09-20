# CarHere - Ride Hailing Application

A full-stack ride-hailing application built with React (frontend) and Node.js/Express (backend).

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation & Setup

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Configure Environment Variables:**

   **Backend (.env in `/server`):**
   - Copy the existing `.env` file in the server directory
   - Update the following variables:
     ```bash
     SUPABASE_URL=your_actual_supabase_url
     SUPABASE_ANON_KEY=your_actual_supabase_anon_key  
     SUPABASE_SERVICE_ROLE_KEY=your_actual_supabase_service_key
     STRIPE_SECRET_KEY=your_actual_stripe_secret_key
     GOOGLE_MAPS_API_KEY=your_actual_google_maps_key
     ```

   **Frontend (.env in `/client`):**
   - Copy the existing `.env` file in the client directory
   - Update the following variables:
     ```bash
     REACT_APP_SUPABASE_URL=your_actual_supabase_url
     REACT_APP_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
     REACT_APP_STRIPE_PUBLISHABLE_KEY=your_actual_stripe_publishable_key
     REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_google_maps_key
     ```

### Running the Application

**Option 1: Run both frontend and backend together (Recommended)**
```bash
npm run dev
```

**Option 2: Run separately**

Backend only:
```bash
npm run start:server
# Server will run on http://localhost:5000
```

Frontend only:
```bash
npm run start:client  
# Client will run on http://localhost:3000
```

## 🏗️ Project Structure

```
car-here/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   └── ...
│   ├── public/
│   └── package.json
├── server/                 # Node.js backend
│   ├── routes/            # API routes
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   └── package.json
├── .env files             # Environment configurations
└── README.md
```

## 🔧 Configuration

### Required API Keys & Services:

1. **Supabase** (Database & Authentication)
   - Create a project at [supabase.com](https://supabase.com)
   - Get your project URL and API keys

2. **Stripe** (Payments)
   - Create account at [stripe.com](https://stripe.com)
   - Get your publishable and secret keys

3. **Google Maps API** (Maps & Location)
   - Enable Maps JavaScript API at [Google Cloud Console](https://console.cloud.google.com)
   - Create an API key

### Temporary Development Mode:

The application will work in development mode even without all API keys configured:
- Mock payments will be used instead of real Stripe transactions
- Sample location data is provided
- Authentication works with placeholder Supabase config

## 📊 Features

- **User Authentication** (Supabase)
- **Driver & Rider Dashboards**
- **Real-time Ride Tracking**
- **Payment Processing** (Stripe)
- **Interactive Maps** (Google Maps/Leaflet)
- **Responsive Design** (Tailwind CSS)
- **WebSocket Support** (Socket.io)

## 🛠️ Development Scripts

```bash
# Install dependencies for both client and server
npm run install:all

# Run both frontend and backend in development mode
npm run dev

# Run only backend server
npm run start:server

# Run only frontend client  
npm run start:client

# Build frontend for production
npm run build:client
```

## 🚦 API Endpoints

**Base URL:** `http://localhost:5000`

- `GET /` - Server status
- `POST /api/payments/create-checkout-session` - Create Stripe checkout
- `GET /api/auth` - Authentication endpoints
- `GET /api/rides` - Ride management endpoints
- `GET /api/reviews` - Review endpoints

## 🔐 Environment Variables Reference

### Backend (.env)
```bash
# Server
PORT=5000
NODE_ENV=development

# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Payments
STRIPE_SECRET_KEY=sk_test_your-secret-key

# Maps
GOOGLE_MAPS_API_KEY=your-api-key

# URLs
PAYMENT_SUCCESS_URL=http://localhost:3000/payment-success
PAYMENT_CANCEL_URL=http://localhost:3000/payment-cancel
```

### Frontend (.env)
```bash
# API
REACT_APP_API_URL=http://localhost:5000

# Database  
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key

# Payments
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your-publishable-key

# Maps
REACT_APP_GOOGLE_MAPS_API_KEY=your-api-key
```

## 🐛 Troubleshooting

**Backend won't start:**
- Check if all dependencies are installed: `cd server && npm install`
- Verify .env file exists and has correct format
- Check if port 5000 is available

**Frontend won't start:**
- Check if all dependencies are installed: `cd client && npm install`  
- Verify .env file exists with REACT_APP_ prefix
- Check if port 3000 is available

**API calls failing:**
- Ensure backend is running on correct port
- Check REACT_APP_API_URL in frontend .env
- Verify CORS configuration in backend

## 📝 Next Steps

1. Configure real API keys in .env files
2. Set up Supabase database tables
3. Configure Stripe webhooks for production
4. Deploy to your preferred hosting platform
5. Set up CI/CD pipeline

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes  
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.