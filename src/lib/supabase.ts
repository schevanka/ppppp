import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if configuration is valid
export const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') && 
  supabaseAnonKey !== 'your-anon-key';

// Use placeholders to prevent "supabaseUrl is required" crash during initialization
// The app will still need valid credentials to function, but this prevents the white screen of death.
const finalUrl = isSupabaseConfigured ? supabaseUrl : 'https://placeholder-project.supabase.co';
const finalKey = isSupabaseConfigured ? supabaseAnonKey : 'placeholder-key';

export const supabase = createClient(finalUrl, finalKey);

if (!isSupabaseConfigured) {
  console.error(
    'Supabase configuration is missing or invalid! \n' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the Settings > Secrets menu. \n' +
    'You can find these in your Supabase project under Settings > API.'
  );
}
