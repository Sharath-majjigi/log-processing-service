import { supabase } from '../../services/supabaseClient.js';

export default async function handler(req, res) {
  if (req.method != 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
    const { email, password } = req.body;

    // Check if the email and password are provided
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      // Create user with email and password
      const { user, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(200).json({ user });
    } catch (err) {
      return res.status(500).json({ error: 'An error occurred while signing up' });
    }
}
