import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load .env before anything else
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("SUPABASE_URL:", supabaseUrl);
  console.error("SUPABASE_ANON_KEY:", supabaseKey ? "Present" : "Missing");
  throw new Error('Missing Supabase URL or anonymous key');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
