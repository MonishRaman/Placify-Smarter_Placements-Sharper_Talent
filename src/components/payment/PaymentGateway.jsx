import React, { useState } from 'react';
import { CheckCircle, AlertCircle, CreditCard, User, QrCode, ArrowLeft, Loader2, Smartphone, Building2, GraduationCap, UserCheck, Wallet, Star, Gift, Zap, Crown, Badge } from 'lucide-react';

const PaymentGateway = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState({ type: 'premium', duration: 3 });
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [showAvailableCoupons, setShowAvailableCoupons] = useState(false);

  const roles = {
    student: { 
      name: 'Student', 
      icon: <GraduationCap className="w-8 h-8" />, 
      color: 'blue',
      gradient: 'from-blue-400 to-blue-600',
      bgGradient: 'from-blue-50 via-indigo-50 to-purple-50',
      plans: { 
        premium: { 
          name: 'Premium Learning Package', 
          features: ['AI Interview Practice', 'Resume Builder', 'Skill Assessment', '24/7 Support'],
          pricing: { 3: 999, 6: 1799, 12: 2999 } 
        } 
      },
      coupons: [
        { code: 'STUDENT50', discount: 500, type: 'fixed', desc: '₹500 off any plan' },
        { code: 'FIRSTYEAR', discount: 15, type: 'percentage', desc: '15% off first year' },
        { code: 'SCHOLARSHIP', discount: 25, type: 'percentage', desc: '25% student discount' }
      ]
    },
    college: { 
      name: 'College/Institution', 
      icon: <Building2 className="w-8 h-8" />, 
      color: 'green',
      gradient: 'from-green-400 to-emerald-600',
      bgGradient: 'from-green-50 via-emerald-50 to-teal-50',
      plans: { 
        premium: { 
          name: 'Institutional Premium', 
          features: ['Bulk Student Management', 'Analytics Dashboard', 'Custom Assessments', 'Placement Reports'],
          pricing: { 3: 49999, 6: 89999, 12: 149999 } 
        } 
      },
      coupons: [
        { code: 'INSTITUTIONAL20', discount: 20, type: 'percentage', desc: '20% institutional discount' },
        { code: 'BULK50', discount: 30, type: 'percentage', desc: '30% bulk enrollment discount' },
        { code: 'PARTNERSHIP', discount: 15000, type: 'fixed', desc: '₹15,000 partnership bonus' }
      ]
    },
    employee: { 
      name: 'Employee', 
      icon: <UserCheck className="w-8 h-8" />, 
      color: 'purple',
      gradient: 'from-purple-400 to-purple-600',
      bgGradient: 'from-purple-50 via-pink-50 to-rose-50',
      plans: { 
        premium: { 
          name: 'Professional Development', 
          features: ['Career Guidance', 'Skill Enhancement', 'Interview Preparation', 'Industry Insights'],
          pricing: { 3: 1999, 6: 3499, 12: 5999 } 
        } 
      },
      coupons: [
        { code: 'CAREER15', discount: 15, type: 'percentage', desc: '15% career boost discount' },
        { code: 'UPSKILL', discount: 300, type: 'fixed', desc: '₹300 upskilling bonus' },
        { code: 'PROFESSIONAL', discount: 12, type: 'percentage', desc: '12% professional discount' }
      ]
    },
    company: { 
      name: 'Company/HR', 
      icon: <Building2 className="w-8 h-8" />, 
      color: 'orange',
      gradient: 'from-orange-400 to-red-500',
      bgGradient: 'from-orange-50 via-amber-50 to-yellow-50',
      plans: { 
        premium: { 
          name: 'Corporate Recruitment Suite', 
          features: ['AI Screening', 'Candidate Assessment', 'Interview Automation', 'Analytics Dashboard'],
          pricing: { 3: 24999, 6: 44999, 12: 79999 } 
        } 
      },
      coupons: [
        { code: 'CORPORATE25', discount: 25, type: 'percentage', desc: '25% corporate discount' },
        { code: 'ENTERPRISE', discount: 20000, type: 'fixed', desc: '₹20,000 enterprise bonus' },
        { code: 'ANNUAL30', discount: 30, type: 'percentage', desc: '30% off (12-month min)', minDuration: 12 }
      ]
    }
  };

  const paymentMethods = [
    { 
      id: 'card', 
      name: 'Credit/Debit Card', 
      type: 'card', 
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Visa, MasterCard, RuPay',
      popular: true
    },
    { 
      id: 'upi', 
      name: 'UPI Payment', 
      type: 'upi', 
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Enter your UPI ID',
      popular: true
    },
    { 
      id: 'gpay', 
      name: 'Google Pay', 
      type: 'wallet', 
      icon: <Wallet className="w-6 h-6" />,
      description: 'Scan QR or use UPI ID',
      popular: true
    },
    { 
      id: 'paytm', 
      name: 'Paytm', 
      type: 'wallet', 
      icon: <Wallet className="w-6 h-6" />,
      description: 'Paytm Wallet/UPI'
    },
    { 
      id: 'phonepe', 
      name: 'PhonePe', 
      type: 'wallet', 
      icon: <Smartphone className="w-6 h-6" />,
      description: 'PhonePe UPI'
    },
    { 
      id: 'amazonpay', 
      name: 'Amazon Pay', 
      type: 'wallet', 
      icon: <Wallet className="w-6 h-6" />,
      description: 'Amazon Pay Balance/UPI'
    }
  ];

  const currentPrice = selectedRole ? roles[selectedRole].plans[selectedPlan.type].pricing[selectedPlan.duration] : 0;
  
  const calculateDiscount = (coupon, price, duration) => {
    if (coupon.minDuration && duration < coupon.minDuration) return 0;
    
    if (coupon.type === 'percentage') {
      return Math.floor(price * (coupon.discount / 100));
    } else {
      return Math.min(coupon.discount, price);
    }
  };

  const finalPrice = appliedCoupon ? 
    currentPrice - calculateDiscount(appliedCoupon, currentPrice, selectedPlan.duration) : 
    currentPrice;

  const validateCoupon = async (code = couponCode) => {
    if (!selectedRole) return;
    
    const roleData = roles[selectedRole];
    const coupon = roleData.coupons.find(c => c.code === code.toUpperCase());
    
    if (coupon) {
      if (coupon.minDuration && selectedPlan.duration < coupon.minDuration) {
        alert(`This coupon requires a minimum ${coupon.minDuration}-month plan`);
        return;
      }
      
      const discountAmount = calculateDiscount(coupon, currentPrice, selectedPlan.duration);
      setAppliedCoupon({ ...coupon, actualDiscount: discountAmount });
      setCouponCode(code.toUpperCase());
    } else {
      alert('Invalid coupon code or not applicable for your role');
    }
  };

  const processPayment = async () => {
    setProcessing(true);
    
    setTimeout(() => {
      const success = Math.random() > 0.1;
      setPaymentResult({
        success,
        message: success ? 'Payment processed successfully!' : 'Payment failed. Please try again.',
        transactionId: success ? 'TXN' + Date.now() : null,
        amount: finalPrice
      });
      setCurrentStep(4);
      setProcessing(false);
    }, 3000);
  };

  const getColorClasses = (role) => {
    const colors = {
      blue: 'border-blue-500 bg-blue-50 text-blue-700',
      green: 'border-green-500 bg-green-50 text-green-700',
      purple: 'border-purple-500 bg-purple-50 text-purple-700',
      orange: 'border-orange-500 bg-orange-50 text-orange-700'
    };
    return colors[role] || colors.blue;
  };

  // Step 0: Role Selection
  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Choose Your Role
            </h1>
            <p className="text-xl text-gray-600">Select the option that best describes you</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(roles).map(([key, role]) => (
              <div
                key={key}
                className={`relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 cursor-pointer group ${
                  selectedRole === key ? 'ring-4 ring-blue-500 ring-opacity-50' : ''
                }`}
                onClick={() => setSelectedRole(key)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                <div className="relative bg-white bg-opacity-90 backdrop-blur-sm p-8 border-2 border-gray-200 group-hover:border-gray-300">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`p-4 rounded-full bg-gradient-to-r ${role.gradient} text-white transform group-hover:scale-110 transition-transform`}>
                      {role.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl mb-2">{role.name}</h3>
                      <p className="text-gray-600 mb-3">
                        {key === 'student' && 'Individual learning plans & career guidance'}
                        {key === 'college' && 'Institutional solutions & bulk management'}
                        {key === 'employee' && 'Professional development & skill enhancement'}
                        {key === 'company' && 'HR tools & recruitment automation'}
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {role.coupons.slice(0, 2).map((coupon, idx) => (
                          <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            {coupon.code}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  {selectedRole === key && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle className="w-8 h-8 text-blue-500" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button
              className={`px-12 py-4 rounded-2xl font-bold text-xl transition-all duration-300 transform ${
                selectedRole 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105 shadow-2xl hover:shadow-blue-500/25' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={() => selectedRole && setCurrentStep(1)}
              disabled={!selectedRole}
            >
              Continue to Plans →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Plan Selection
  if (currentStep === 1) {
    const currentRoleData = roles[selectedRole];
    const plan = currentRoleData.plans[selectedPlan.type];
    
    return (
      <div className={`min-h-screen bg-gradient-to-br ${currentRoleData.bgGradient} p-4`}>
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center p-6 bg-gradient-to-r from-gray-50 to-gray-100">
              <button 
                onClick={() => setCurrentStep(0)}
                className="p-3 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold ml-3">Choose Your Plan</h2>
            </div>
            
            <div className={`m-6 rounded-2xl bg-gradient-to-r ${currentRoleData.gradient} text-white p-8 transform hover:scale-105 transition-transform`}>
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Crown className="w-8 h-8 mr-2" />
                  <h3 className="font-bold text-2xl">{plan.name}</h3>
                </div>
                <div className="text-4xl font-bold mb-2">₹{currentPrice.toLocaleString()}</div>
                <p className="text-lg opacity-90">for {selectedPlan.duration} months</p>
                <div className="mt-4 bg-white bg-opacity-20 rounded-lg p-2">
                  <span className="text-sm">₹{Math.round(currentPrice/selectedPlan.duration).toLocaleString()}/month</span>
                </div>
              </div>
            </div>

            <div className="px-6 mb-6">
              <h4 className="font-bold text-lg mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                What's Included:
              </h4>
              <div className="grid gap-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 mb-8">
              <label className="block text-lg font-bold mb-4">Plan Duration:</label>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(plan.pricing).map(([months, price]) => {
                  const savings = months === '12' ? Math.round(((plan.pricing[3] * 4) - price) / (plan.pricing[3] * 4) * 100) : 
                                 months === '6' ? Math.round(((plan.pricing[3] * 2) - price) / (plan.pricing[3] * 2) * 100) : 0;
                  
                  return (
                    <button
                      key={months}
                      className={`relative p-4 text-center rounded-xl border-2 transition-all transform hover:scale-105 ${
                        selectedPlan.duration === parseInt(months)
                          ? `border-${currentRoleData.color}-500 bg-${currentRoleData.color}-50 text-${currentRoleData.color}-700`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedPlan({...selectedPlan, duration: parseInt(months)})}
                    >
                      {savings > 0 && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {savings}% OFF
                        </div>
                      )}
                      <div className="font-bold text-lg">{months}M</div>
                      <div className="text-sm font-medium">₹{price.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">₹{Math.round(price/parseInt(months)).toLocaleString()}/mo</div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="p-6">
              <button
                className={`w-full bg-gradient-to-r ${currentRoleData.gradient} text-white py-4 rounded-2xl font-bold text-xl hover:scale-105 transform transition-all shadow-lg`}
                onClick={() => setCurrentStep(2)}
              >
                Continue - ₹{currentPrice.toLocaleString()}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Coupon Code
  if (currentStep === 2) {
    const currentRoleData = roles[selectedRole];
    
    return (
      <div className={`min-h-screen bg-gradient-to-br ${currentRoleData.bgGradient} p-4`}>
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center p-6 bg-gradient-to-r from-gray-50 to-gray-100">
              <button 
                onClick={() => setCurrentStep(1)}
                className="p-3 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold ml-3 flex items-center">
                <Gift className="w-6 h-6 mr-2" />
                Apply Coupon Code
              </h2>
            </div>
            
            <div className="p-6">
              <div className="flex space-x-3 mb-6">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
                <button
                  onClick={() => validateCoupon()}
                  disabled={!couponCode.trim()}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:scale-105 transform transition-all font-bold disabled:bg-gray-300 disabled:transform-none"
                >
                  Apply
                </button>
              </div>

              <button
                onClick={() => setShowAvailableCoupons(!showAvailableCoupons)}
                className="w-full mb-6 p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 transition-colors flex items-center justify-center space-x-2"
              >
                <Zap className="w-5 h-5" />
                <span>View Available Coupons</span>
              </button>

              {showAvailableCoupons && (
                <div className="mb-6 space-y-3">
                  <h4 className="font-bold text-lg">Available for {currentRoleData.name}s:</h4>
                  {currentRoleData.coupons.map((coupon, index) => (
                    <div 
                      key={index}
                      onClick={() => validateCoupon(coupon.code)}
                      className="p-4 border-2 border-green-200 rounded-xl bg-green-50 hover:bg-green-100 cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-bold text-green-800 text-lg">{coupon.code}</span>
                          <p className="text-green-600 text-sm">{coupon.desc}</p>
                          {coupon.minDuration && (
                            <p className="text-xs text-green-500">Minimum {coupon.minDuration} months required</p>
                          )}
                        </div>
                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          {coupon.type === 'percentage' ? `${coupon.discount}% OFF` : `₹${coupon.discount} OFF`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {appliedCoupon && (
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl p-6 mb-6 transform hover:scale-105 transition-transform">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-8 h-8" />
                    <div>
                      <div className="font-bold text-xl">Coupon Applied!</div>
                      <p className="text-lg">You saved ₹{appliedCoupon.actualDiscount.toLocaleString()}</p>
                      <p className="text-sm opacity-90">Code: {appliedCoupon.code}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-lg">
                    <span>Original Price:</span>
                    <span className={appliedCoupon ? 'line-through text-gray-500' : 'font-bold text-2xl'}>
                      ₹{currentPrice.toLocaleString()}
                    </span>
                  </div>
                  {appliedCoupon && (
                    <>
                      <div className="flex justify-between items-center text-green-600 text-lg">
                        <span>Discount ({appliedCoupon.code}):</span>
                        <span className="font-bold">-₹{appliedCoupon.actualDiscount.toLocaleString()}</span>
                      </div>
                      <div className="border-t-2 border-gray-200 pt-3">
                        <div className="flex justify-between items-center font-bold text-2xl">
                          <span>Final Price:</span>
                          <span className="text-green-600">₹{finalPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <button
                  className="w-full bg-gray-200 text-gray-700 py-4 rounded-2xl hover:bg-gray-300 transition-colors font-medium text-lg"
                  onClick={() => setCurrentStep(3)}
                >
                  Skip Coupon
                </button>
                <button
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-2xl font-bold text-xl hover:scale-105 transform transition-all shadow-lg"
                  onClick={() => setCurrentStep(3)}
                >
                  Proceed to Payment →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Payment Method
  if (currentStep === 3) {
    const currentRoleData = roles[selectedRole];
    
    return (
      <div className={`min-h-screen bg-gradient-to-br ${currentRoleData.bgGradient} p-4`}>
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center p-6 bg-gradient-to-r from-gray-50 to-gray-100">
              <button 
                onClick={() => setCurrentStep(2)}
                className="p-3 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold ml-3">Payment Details</h2>
            </div>

            <div className="p-6">
              <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-6 mb-8 text-white text-center">
                <div className="text-3xl font-bold mb-2">₹{finalPrice.toLocaleString()}</div>
                {appliedCoupon && (
                  <div className="text-lg">
                    <span className="line-through opacity-75">₹{currentPrice.toLocaleString()}</span>
                    <span className="ml-3 bg-white bg-opacity-20 px-3 py-1 rounded-full">
                      Saved ₹{appliedCoupon.actualDiscount.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="mb-8">
                <h3 className="font-bold text-xl mb-6">Choose Payment Method</h3>
                <div className="space-y-4">
                  {paymentMethods.map(method => (
                    <button
                      key={method.id}
                      className={`relative w-full p-5 border-2 rounded-2xl flex items-center space-x-4 transition-all transform hover:scale-105 ${
                        selectedMethod?.id === method.id ? 'border-blue-500 bg-blue-50 scale-105' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedMethod(method)}
                    >
                      {method.popular && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          <Star className="w-3 h-3 inline mr-1" />
                          POPULAR
                        </div>
                      )}
                      <div className={`p-3 rounded-xl ${selectedMethod?.id === method.id ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
                        {method.icon}
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-bold text-lg">{method.name}</div>
                        <div className="text-sm text-gray-500">{method.description}</div>
                      </div>
                      {selectedMethod?.id === method.id && (
                        <CheckCircle className="w-6 h-6 text-blue-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {selectedMethod?.type === 'card' && (
                <div className="space-y-4 mb-8 p-6 bg-gray-50 rounded-2xl">
                  <h4 className="font-bold text-lg mb-4">Card Details</h4>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="MM/YY" 
                      className="px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg" 
                    />
                    <input 
                      type="text" 
                      placeholder="CVV" 
                      className="px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg" 
                    />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Cardholder Name" 
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg" 
                  />
                </div>
              )}

              {(selectedMethod?.type === 'upi' || selectedMethod?.type === 'wallet') && (
                <div className="mb-8 p-6 bg-gray-50 rounded-2xl">
                  {selectedMethod?.id === 'gpay' ? (
                    <div className="space-y-6">
                      <h4 className="font-bold text-lg">Google Pay Payment</h4>
                      <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-2xl bg-white">
                        <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center">
                          <QrCode className="w-16 h-16 text-white" />
                        </div>
                        <p className="font-medium text-lg mb-2">Scan QR with Google Pay</p>
                        <p className="text-sm text-gray-500">₹{finalPrice.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <div className="inline-flex items-center space-x-4">
                          <div className="h-px bg-gray-300 flex-1"></div>
                          <span className="text-gray-500 font-medium">OR</span>
                          <div className="h-px bg-gray-300 flex-1"></div>
                        </div>
                      </div>
                      <input
                        type="text"
                        placeholder="Enter UPI ID (e.g., user@gpay)"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                      />
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-bold text-lg mb-4">{selectedMethod?.name} Payment</h4>
                      <input
                        type="text"
                        placeholder={`Enter UPI ID (e.g., user@${selectedMethod?.id === 'phonepe' ? 'ybl' : selectedMethod?.id})`}
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                      />
                    </div>
                  )}
                </div>
              )}

              <button
                className={`w-full py-5 rounded-2xl font-bold text-xl transition-all transform ${
                  selectedMethod && !processing
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:scale-105 shadow-2xl hover:shadow-green-500/25'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={processPayment}
                disabled={!selectedMethod || processing}
              >
                {processing ? (
                  <div className="flex items-center justify-center space-x-3">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Processing Payment...</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Pay ₹{finalPrice.toLocaleString()}</span>
                    <Badge className="w-5 h-5" />
                  </div>
                )}
              </button>

              <div className="mt-6 text-center">
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>SSL Encrypted</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>PCI Compliant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 4: Result
  if (currentStep === 4) {
    const currentRoleData = roles[selectedRole];
    
    return (
      <div className={`min-h-screen bg-gradient-to-br ${currentRoleData.bgGradient} p-4 flex items-center justify-center`}>
        <div className="max-w-lg mx-auto w-full">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className={`text-center p-12 ${
              paymentResult?.success 
                ? 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600' 
                : 'bg-gradient-to-br from-red-400 via-pink-500 to-rose-600'
            } text-white relative overflow-hidden`}>
              
              {/* Animated background elements */}
              <div className="absolute inset-0 opacity-10">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-4 h-4 bg-white rounded-full animate-bounce"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${2 + Math.random() * 2}s`
                    }}
                  ></div>
                ))}
              </div>

              <div className="relative z-10">
                <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-full flex items-center justify-center transform hover:scale-110 transition-transform">
                  {paymentResult?.success ? 
                    <CheckCircle className="w-12 h-12 text-green-500 animate-pulse" /> : 
                    <AlertCircle className="w-12 h-12 text-red-500 animate-pulse" />
                  }
                </div>
                <h2 className="text-3xl font-bold mb-4">
                  {paymentResult?.success ? 'Payment Successful!' : 'Payment Failed!'}
                </h2>
                <p className="text-xl opacity-90">
                  {paymentResult?.success 
                    ? 'Your subscription is now active and ready to use' 
                    : 'Please try again with a different payment method'}
                </p>
              </div>
            </div>

            <div className="p-8">
              {paymentResult?.success ? (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
                    <h3 className="font-bold text-xl mb-4 flex items-center">
                      <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
                      Transaction Details
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-white rounded-xl">
                        <span className="text-gray-600 font-medium">Transaction ID:</span>
                        <span className="font-mono text-sm font-bold bg-gray-100 px-3 py-1 rounded-lg">
                          {paymentResult.transactionId}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-xl">
                        <span className="text-gray-600 font-medium">Amount Paid:</span>
                        <span className="font-bold text-xl text-green-600">₹{paymentResult.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-xl">
                        <span className="text-gray-600 font-medium">Plan:</span>
                        <span className="font-bold">{roles[selectedRole].plans[selectedPlan.type].name}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-xl">
                        <span className="text-gray-600 font-medium">Duration:</span>
                        <span className="font-bold">{selectedPlan.duration} months</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-xl">
                        <span className="text-gray-600 font-medium">Valid Until:</span>
                        <span className="font-bold text-blue-600">
                          {new Date(Date.now() + selectedPlan.duration * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      {appliedCoupon && (
                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl border-2 border-green-200">
                          <span className="text-green-700 font-medium flex items-center">
                            <Gift className="w-4 h-4 mr-2" />
                            Coupon Applied:
                          </span>
                          <span className="font-bold text-green-800">{appliedCoupon.code}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <button
                      className={`w-full bg-gradient-to-r ${currentRoleData.gradient} text-white py-5 rounded-2xl font-bold text-xl hover:scale-105 transform transition-all shadow-lg`}
                      onClick={() => {
                        // Navigate to dashboard based on role
                        alert(`Redirecting to ${currentRoleData.name} Dashboard...`);
                      }}
                    >
                      Go to Dashboard →
                    </button>
                    
                    <button
                      className="w-full bg-blue-100 text-blue-700 py-4 rounded-2xl font-bold hover:bg-blue-200 transition-colors"
                      onClick={() => {
                        // Download receipt functionality
                        alert('Receipt download started...');
                      }}
                    >
                      📧 Email Receipt
                    </button>
                  </div>

                  <div className="text-center p-6 bg-blue-50 rounded-2xl">
                    <h4 className="font-bold text-lg mb-2">What's Next?</h4>
                    <p className="text-gray-600 mb-4">
                      You'll receive a confirmation email with your login credentials and access instructions within 5 minutes.
                    </p>
                    <div className="flex justify-center space-x-6 text-sm">
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>Instant Access</span>
                      </div>
                      <div className="flex items-center space-x-2 text-blue-600">
                        <User className="w-4 h-4" />
                        <span>24/7 Support</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center p-6 bg-red-50 rounded-2xl border-2 border-red-200">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                    <h3 className="font-bold text-xl text-red-800 mb-2">Payment Failed</h3>
                    <p className="text-red-600">{paymentResult.message}</p>
                    <p className="text-sm text-red-500 mt-2">
                      Don't worry, no amount has been deducted from your account.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <button
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 rounded-2xl font-bold text-xl hover:scale-105 transform transition-all shadow-lg"
                      onClick={() => setCurrentStep(3)}
                    >
                      Try Different Payment Method
                    </button>
                    <button
                      className="w-full bg-gray-200 text-gray-700 py-4 rounded-2xl hover:bg-gray-300 transition-colors font-medium"
                      onClick={() => {
                        setCurrentStep(0);
                        setSelectedRole(null);
                        setAppliedCoupon(null);
                        setCouponCode('');
                        setSelectedMethod(null);
                        setPaymentResult(null);
                      }}
                    >
                      Start Over
                    </button>
                  </div>

                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600">
                      Need help? Contact our support team at 
                      <span className="font-bold text-blue-600"> support@company.com</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentGateway;