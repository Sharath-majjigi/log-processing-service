import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Load credentials from environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

// Create Supabase client
export const supabase = createClient('https://ojtyccabmnvaizukvqbd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qdHljY2FibW52YWl6dWt2cWJkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTExNjU1NSwiZXhwIjoyMDU2NjkyNTU1fQ.9BHw2jUrdtBiIGdlP4Rig3hx6fvpLp-FwVBL7fIR8Ww');