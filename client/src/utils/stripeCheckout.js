
export function startStripeCheckout({ amount, type = "wallet", userId, rideId }) {
  // Call backend to create Stripe Checkout session
    fetch(`${process.env.REACT_APP_API_URL}/api/payments/create-checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, type, userId, rideId })
  })
    .then(res => res.json())
    .then(data => {
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to create Stripe checkout session");
      }
    });
}

// Usage example:
// startStripeCheckout({ amount: 100, type: "wallet", userId: "user@email.com" });
