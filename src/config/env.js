   import dotenv from 'dotenv';

   dotenv.config();

   // Export the environment variables
   export const PORT = process.env.PORT || 3000;
   export const REDIS_URL = process.env.REDIS_URL;
   export const SUPABASE_URL = process.env.SUPABASE_URL;
   export const SUPABASE_KEY = process.env.SUPABASE_KEY;
   export const NO_OF_WORKERS = process.env.NO_OF_WORKERS;
   export const QUEUE_NAME = process.env.QUEUE_NAME;
   export const REDIS_EVENT = process.env.REDIS_EVENT;
   export const JOB_NAME = process.env.JOB_NAME;
   export const SUPABASE_STORAGE_NAME = process.env.SUPABASE_STORAGE_NAME;