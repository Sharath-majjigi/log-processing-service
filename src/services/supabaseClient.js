import { createClient } from '@supabase/supabase-js';
import { SUPABASE_KEY, SUPABASE_URL } from '../config/env.js';

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);