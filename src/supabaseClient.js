import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mesryauoszblbhednjt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lc3J5YXVvc3pibGJoaGVkbmp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1ODg4MDUsImV4cCI6MjA5NjE2NDgwNX0.3SF9DEm42ik3QYgtkDD3HqY-p2L9mKx3Khe5DT-FZi8'

export const supabase = createClient(supabaseUrl, supabaseKey)
