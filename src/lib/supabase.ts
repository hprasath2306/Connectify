import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wtcfuykcneuwfapnqtmo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0Y2Z1eWtjbmV1d2ZhcG5xdG1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQxNDAyNjYsImV4cCI6MjAzOTcxNjI2Nn0.FqIMikY8rlwrjpXWNDTOHYdl7ZYo0hhfMFPH3fJgUOk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})