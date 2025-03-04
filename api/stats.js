import { supabase } from '../supabaseClient';

export default async function handler(req, res) {
  const { data, error } = await supabase.from('log_stats').select('*');

  if (error) return res.status(500).json({ error: error.message });
  
  return res.status(200).json(data);
}
