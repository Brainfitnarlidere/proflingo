'use strict';

const SUPABASE_URL = 'https://lavrodcnjqxkejzgtnoo.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhdnJvZGNuanF4a2Vqemd0bm9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxNzA5MzMsImV4cCI6MjA4OTc0NjkzM30.v32n33u9VHU4H1SCLAq0W1DS3I2aFvORtW6Q9eUyUYE';

// Initialize Supabase client
window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('Supabase initialized 🚀');
