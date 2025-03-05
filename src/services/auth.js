import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/**
 * Verifies the JWT token and returns the decoded user data.
 * @param {string} token - The JWT token to verify.
 * @returns {Object} - Decoded user data.
 */
export const verifyJWT = async (token) => {
  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error) {
      throw new Error(error.message);
    }
    return data; 
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Extracts the JWT token from the request's Authorization header.
 * @param {Object} req - The request object.
 * @returns {string|null} - The JWT token, or null if not found.
 */
export const extractToken = (req) => {
  const token = req.headers.authorization?.split('Bearer ')[1]; 
  return token || null;
};
