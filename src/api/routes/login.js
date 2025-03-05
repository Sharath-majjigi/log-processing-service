import { supabase } from '../../services/supabaseClient.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      // Sign in user with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      // Return the session (JWT token) for the user
      return res.status(200).json({ user: data.user, session: data.session });
    } catch (err) {
      return res.status(500).json({ error: 'An error occurred while logging in' });
    }
  } else {
    // Method Not Allowed
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
