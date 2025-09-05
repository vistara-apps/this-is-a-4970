// Application configuration
export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  },
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  },
  app: {
    env: import.meta.env.VITE_APP_ENV || 'development',
    url: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
  },
}

// Validate required environment variables
export const validateConfig = () => {
  const required = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_OPENAI_API_KEY',
    'VITE_STRIPE_PUBLISHABLE_KEY',
  ]

  const missing = required.filter(key => !import.meta.env[key])
  
  if (missing.length > 0 && config.app.env === 'production') {
    console.error('Missing required environment variables:', missing)
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }

  if (missing.length > 0) {
    console.warn('Missing environment variables (using mock data):', missing)
  }
}
