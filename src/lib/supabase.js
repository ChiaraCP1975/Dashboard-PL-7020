import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://kdmfghrfdolzpfyotlpw.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkbWZnaHJmZG9senBmeW90bHB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNTMwNTgsImV4cCI6MjA2NzkyOTA1OH0.gYWlc4xolJOtBjV1dHQFmwgQoYJmu7hXZHBIJKUFZNU'

if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

export default supabase