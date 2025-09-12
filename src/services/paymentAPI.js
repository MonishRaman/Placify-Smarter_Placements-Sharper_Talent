const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const paymentAPI = {
  validateCoupon: async (couponCode, amount, role) => {
    const response = await fetch(`${API_BASE}/api/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ couponCode, amount, role })
    });
    return await response.json();
  },

  createPayment: async (paymentData) => {
    const response = await fetch(`${API_BASE}/api/payments/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    return await response.json();
  },

  processPayment: async (paymentId, paymentMethod, details) => {
    const response = await fetch(`${API_BASE}/api/payments/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId, paymentMethod, details })
    });
    return await response.json();
  }
};
