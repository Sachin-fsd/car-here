// Initialize Stripe
let stripe;
try {
  const Stripe = require('stripe');
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  }
} catch (err) {
  console.log('Stripe not configured');
}

// Stripe Checkout session for wallet/ride payments
exports.createCheckoutSession = async (req, res) => {
  const { amount, type = 'wallet', userId, rideId } = req.body;
  
  // If Stripe is not configured, return a mock response
  if (!stripe) {
    return res.json({
      url: `${process.env.PAYMENT_SUCCESS_URL || 'http://localhost:3000/payment-success'}?mock=true&amount=${amount}&type=${type}`,
      message: 'Mock payment - Stripe not configured',
      sessionId: `mock_session_${Date.now()}`
    });
  }
  
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: type === 'wallet' ? 'Wallet Top-up' : 'Ride Payment',
              metadata: { userId, rideId }
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: (process.env.PAYMENT_SUCCESS_URL || 'http://localhost:3000/payment-success') + `?type=${type}&amount=${amount}&userId=${userId}${rideId ? `&rideId=${rideId}` : ''}`,
      cancel_url: type === 'driver-plan' 
        ? (process.env.PAYMENT_CANCEL_URL || 'http://localhost:3000/driver-payment-cancel')
        : (process.env.PAYMENT_CANCEL_URL || 'http://localhost:3000/payment-cancel'),
    });
    res.json({ url: session.url, sessionId: session.id });
  } catch (e) {
    console.error('Stripe error:', e);
    res.status(500).json({ error: e.message });
  }
};

exports.pay = async (req, res) => {
  const { amount, currency = 'inr', payment_method_id, rideId, userId } = req.body;
  
  if (!amount || !rideId || !userId) {
    return res.status(400).json({ error: 'Missing required fields: amount, rideId, userId' });
  }
  
  // If Stripe is not configured, return a mock response
  if (!stripe) {
    return res.status(200).json({ 
      success: true, 
      paymentIntent: {
        id: `mock_payment_${Date.now()}`,
        status: 'succeeded',
        amount: Math.round(amount * 100),
        currency
      },
      message: 'Mock payment - Stripe not configured'
    });
  }
  
  try {
    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects cents
      currency,
      payment_method: payment_method_id,
      confirm: true,
      metadata: { rideId, userId },
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      }
    });
    res.status(200).json({ success: true, paymentIntent });
  } catch (err) {
    console.error('Payment error:', err);
    res.status(500).json({ error: err.message });
  }
};
