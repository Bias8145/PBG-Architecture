import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  image_url: string; // Kept as the "Main Thumbnail"
  gallery: string[]; // New: Array of all images/videos
  category: string;
  created_at: string;
};
