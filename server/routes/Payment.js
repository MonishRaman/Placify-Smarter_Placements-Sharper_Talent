import express from "express";


const router = express.Router();

// Validate coupon
router.post('/coupons/validate', async (req, res) => {
  try {
    const { couponCode, amount, role } = req.body;
    
    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
      isActive: true,
      applicableRoles: { $in: [role] }
    });

    if (!coupon) {
      return res.json({ success: false, message: 'Invalid coupon' });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.floor(amount * coupon.discountValue / 100);
    } else {
      discount = coupon.discountValue;
    }

    res.json({
      success: true,
      coupon: { code: coupon.code, discount, percentage: coupon.discountValue }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create payment
router.post('/payments/create', async (req, res) => {
  try {
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const payment = new Payment({
      ...req.body,
      transactionId,
      userId: req.user?.id || 'anonymous' // Add user auth
    });

    await payment.save();
    res.json({ success: true, paymentId: payment._id, transactionId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Process payment
router.post('/payments/process', async (req, res) => {
  try {
    const { paymentId } = req.body;
    
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.json({ success: false, message: 'Payment not found' });
    }

    // Mock payment processing (integrate with actual payment gateway)
    const isSuccess = Math.random() > 0.15; // 85% success rate
    
    payment.status = isSuccess ? 'success' : 'failed';
    await payment.save();

    res.json({
      success: isSuccess,
      transactionId: payment.transactionId,
      amount: payment.amount,
      message: isSuccess ? 'Payment successful' : 'Payment failed'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
