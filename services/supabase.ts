import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://vpuldnnldfkllazsrpzs.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwdWxkbm5sZGZrbGxhenNycHpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NzQ2NzcsImV4cCI6MjA5NDU1MDY3N30.rKTcyN8xtlY6kPrA6SuaLJWMHA7-4YftLhIf9Gqp09w'
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)