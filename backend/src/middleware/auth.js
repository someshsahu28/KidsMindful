const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Authentication token required',
      code: 'TOKEN_REQUIRED'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Check if token is about to expire (less than 1 hour remaining)
    const tokenExp = decoded.exp * 1000; // Convert to milliseconds
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    
    if (tokenExp - now < oneHour) {
      // Generate a new token
      const newToken = jwt.sign(
        { id: decoded.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
      
      // Send the new token in the response header
      res.setHeader('X-New-Token', newToken);
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token has expired. Please log in again.',
        code: 'TOKEN_EXPIRED'
      });
    }
    return res.status(403).json({ 
      success: false,
      message: 'Invalid token',
      code: 'TOKEN_INVALID'
    });
  }
};

module.exports = { authenticateToken }; 