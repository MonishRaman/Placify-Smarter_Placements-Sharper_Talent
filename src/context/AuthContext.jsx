import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);
    
    if (token) {
      // Verify token has correct format (header.payload.signature)
      if (!token.includes('.') || token.split('.').length !== 3) {
        console.error("Invalid token format");
        localStorage.removeItem("token"); // Remove invalid token
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded user:", decoded);
        
        // Check if token is expired
        if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
          console.error("Token expired");
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        } else {
          setUser(decoded);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  }, []);

  // Method to update user subscription after successful payment
  const updateUserSubscription = async (subscriptionData) => {
    try {
      // Update the user object with subscription information
      const updatedUser = {
        ...user,
        subscription: {
          planType: subscriptionData.planType,
          duration: subscriptionData.duration,
          expiryDate: subscriptionData.expiryDate,
          transactionId: subscriptionData.transactionId,
          isActive: true,
          purchaseDate: new Date().toISOString()
        }
      };

      // Update local state
      setUser(updatedUser);

      // Optionally, you can also update the backend
      const token = localStorage.getItem("token");
      if (token) {
        await fetch('/api/users/update-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: user.id,
            subscription: subscriptionData
          })
        });
      }

      return Promise.resolve(updatedUser);
    } catch (error) {
      console.error('Failed to update subscription:', error);
      return Promise.reject(error);
    }
  };

  // Method to check if user has active subscription
  const hasActiveSubscription = () => {
    if (!user?.subscription) return false;
    
    const expiryDate = new Date(user.subscription.expiryDate);
    const now = new Date();
    
    return user.subscription.isActive && expiryDate > now;
  };

  // Method to get subscription status
  const getSubscriptionStatus = () => {
    if (!user?.subscription) {
      return { status: 'none', message: 'No subscription found' };
    }

    const expiryDate = new Date(user.subscription.expiryDate);
    const now = new Date();
    const daysLeft = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

    if (!user.subscription.isActive) {
      return { status: 'inactive', message: 'Subscription is inactive' };
    }

    if (expiryDate <= now) {
      return { status: 'expired', message: 'Subscription has expired' };
    }

    if (daysLeft <= 7) {
      return { status: 'expiring', message: `Subscription expires in ${daysLeft} days` };
    }

    return { status: 'active', message: `Subscription active for ${daysLeft} days` };
  };

  // Method to logout user
  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  // Method to login user (update token and user data)
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      setIsAuthenticated, 
      user, 
      setUser, 
      loading,
      updateUserSubscription,
      hasActiveSubscription,
      getSubscriptionStatus,
      logout,
      login
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);