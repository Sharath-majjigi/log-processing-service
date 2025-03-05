import { verifyJWT, extractToken } from '../services/auth.js';

/**
 * Middleware to check JWT authentication
 * Verifies the token and attaches user info to request if valid.
 */
export const authenticate = async (req, res, next) => {
  const token = extractToken(req); 

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  try {
    const user = await verifyJWT(token); 
    req.user = user; 
    next(); 
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};
