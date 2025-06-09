// app/config/supabase.js
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Validate environment variables
if (!process.env.SUPABASE_URL) {
  throw new Error('SUPABASE_URL environment variable is required. Please check your .env file.');
}

if (!process.env.SUPABASE_KEY) {
  throw new Error('SUPABASE_KEY environment variable is required. Please check your .env file.');
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  process.env.SUPABASE_SERVICE_ROLE_KEY, 
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false // Set to true if you want session persistence
    }
  }
);

module.exports = supabase;