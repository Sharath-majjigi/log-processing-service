import { supabase } from '../../services/supabaseClient.js';

export default async function handler(req, res) {
  const { jobId } = req.query; // Retrieve jobId from query parameters

  try {

    if (jobId) {
      const { data, error } = await supabase
        .from('log_stats')
        .select('*')
        .eq('job_id', jobId) // Filter by jobId
        .single(); 

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (!data) {
        return res.status(404).json({ error: 'Job not found' });
      }
      
      return res.status(200).json(data);

    } else {
      // If no jobId is provided, fetch stats for all jobs
      const { data, error } = await supabase.from('log_stats').select('*');

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json(data);
    }
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
