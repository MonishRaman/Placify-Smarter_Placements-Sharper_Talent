import jwt from "jsonwebtoken";

const verifyToken = (roles = [], optional = false) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    // If authentication is optional and no token provided, continue without user
    if (optional && !authHeader?.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Role-based access check
      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    } catch (err) {
      console.error("JWT verification error:", err.message);
      if (optional) {
        req.user = null;
        return next();
      }
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};

export default verifyToken;
