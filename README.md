# KnowYourRights.ai

Your pocket guide to legal rights during police interactions. A mobile-first web application that provides instant, location-specific "Know Your Rights" information and documentation tools.

## 🚀 Features

### Core Features
- **📍 Location-Specific Legal Guides** - State-specific rights information
- **💬 AI-Powered Script Generation** - Personalized "what to say" scripts
- **🎙️ Interaction Recording Tools** - Audio recording and documentation
- **🌐 Multilingual Support** - English and Spanish
- **📄 Summary Card Generation** - Shareable interaction summaries
- **💳 Subscription Management** - Premium features with Stripe integration

### Technical Features
- **⚡ Modern React Stack** - React 18, Vite, Tailwind CSS
- **🗄️ Supabase Backend** - Authentication, database, and real-time features
- **🤖 OpenAI Integration** - AI-powered content generation
- **💰 Stripe Payments** - Subscription and payment processing
- **📱 Mobile-First Design** - Responsive and accessible
- **🔐 Secure Authentication** - Row-level security and JWT tokens

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Zustand
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI**: OpenAI GPT-3.5/4
- **Payments**: Stripe
- **Deployment**: Vercel/Netlify ready

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- OpenAI API key
- Stripe account (for payments)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd knowyourrights-ai
npm install
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Fill in your environment variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# App Configuration
VITE_APP_ENV=development
VITE_APP_URL=http://localhost:5173
```

### 3. Database Setup

#### Option A: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the SQL from `src/lib/supabase.js` (the `createTablesSQL` constant)
4. Run the SQL to create tables and policies

#### Option B: Using Supabase CLI
```bash
# Install Supabase CLI
npm install -g supabase

# Initialize and link to your project
supabase init
supabase link --project-ref your-project-ref

# Apply migrations (if you create migration files)
supabase db push
```

### 4. Seed Legal Guides Data

Add some initial legal guides to your database:

```sql
-- Insert sample legal guides
INSERT INTO legal_guides (state, title, content, language) VALUES
('CA', 'California - Know Your Rights', '{
  "overview": "In California, you have specific rights during police interactions.",
  "whatToDo": [
    "Remain calm and polite",
    "Keep your hands visible", 
    "Ask \"Am I free to leave?\"",
    "Request a lawyer if arrested",
    "Do not consent to searches"
  ],
  "whatNotToSay": [
    "Do not admit guilt",
    "Do not lie to officers",
    "Do not argue or resist",
    "Do not provide information beyond required ID"
  ],
  "specificRights": [
    "Right to remain silent (Miranda Rights)",
    "Right to refuse consent to search vehicle/person",
    "Right to ask if you are being detained",
    "Right to record police interactions in public"
  ]
}', 'en'),
('NY', 'New York - Know Your Rights', '{
  "overview": "In New York, you have constitutional rights during police encounters.",
  "whatToDo": [
    "Stay calm and respectful",
    "Keep hands where officers can see them",
    "Ask if you are free to leave",
    "Invoke your right to remain silent",
    "Request an attorney"
  ],
  "whatNotToSay": [
    "Never admit to any wrongdoing",
    "Do not lie or provide false information", 
    "Avoid arguing with officers",
    "Do not volunteer information"
  ],
  "specificRights": [
    "Right to remain silent under 5th Amendment",
    "Right to refuse searches without warrant",
    "Right to know reason for detention",
    "Right to legal representation"
  ]
}', 'en');
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 🔧 Configuration

### Supabase Setup

1. **Create a new Supabase project**
2. **Enable Authentication** - Configure email/password auth
3. **Set up Row Level Security** - The SQL schema includes RLS policies
4. **Configure Storage** (optional) - For audio file uploads

### OpenAI Setup

1. **Get API Key** from OpenAI dashboard
2. **Set usage limits** to control costs
3. **Monitor usage** in OpenAI dashboard

### Stripe Setup

1. **Create Stripe account**
2. **Set up products and prices** for subscription plans
3. **Configure webhooks** for subscription events (for production)
4. **Test with Stripe test keys** during development

## 📱 Usage

### For Users

1. **Select Your State** - Choose your location for state-specific information
2. **Browse Legal Guides** - Learn your rights during police interactions
3. **Generate Scripts** - Get AI-powered "what to say" scripts (Premium)
4. **Record Interactions** - Document encounters with audio and notes (Premium)
5. **Create Summaries** - Generate shareable summary cards (Premium)

### Demo Mode

The app works in demo mode without API keys:
- Mock authentication (any email/password works)
- Pre-written scripts instead of AI generation
- Simulated recording functionality
- Mock payment processing

## 🏗️ Architecture

### Frontend Architecture
```
src/
├── components/          # React components
├── lib/                # Service integrations
│   ├── supabase.js     # Database client & helpers
│   ├── openai.js       # AI service integration
│   └── stripe.js       # Payment processing
├── store/              # Zustand state management
├── config/             # Environment configuration
└── App.jsx             # Main application component
```

### Database Schema
- **users** - User profiles and subscription status
- **legal_guides** - State-specific legal information
- **interaction_records** - User's recorded interactions

### State Management
- **useAppStore** - Main application state (auth, subscription, UI)
- **useRecordingStore** - Recording functionality state

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Deploy to Netlify

```bash
# Build the project
npm run build

# Deploy dist/ folder to Netlify
```

### Environment Variables for Production

Make sure to set all environment variables in your deployment platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_OPENAI_API_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `VITE_APP_ENV=production`
- `VITE_APP_URL=your-production-url`

## 🔒 Security Considerations

- **Row Level Security** - Enabled on all user data tables
- **API Key Security** - OpenAI API calls should go through backend in production
- **Input Validation** - All user inputs are validated
- **HTTPS Only** - Ensure production deployment uses HTTPS
- **Environment Variables** - Never commit API keys to version control

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Build test
npm run build

# Preview production build
npm run preview
```

## 📚 API Documentation

### Supabase Tables

#### users
- `id` (uuid, primary key)
- `email` (text, unique)
- `subscription_status` (text: 'free', 'premium', 'trial')
- `preferred_language` (text: 'en', 'es')
- `location_info` (jsonb)

#### legal_guides
- `id` (uuid, primary key)
- `state` (text)
- `title` (text)
- `content` (jsonb)
- `language` (text)

#### interaction_records
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key)
- `timestamp` (timestamp)
- `location` (text)
- `notes` (text)
- `audio_url` (text)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check this README and code comments
- **Issues**: Create GitHub issues for bugs or feature requests
- **Demo**: The app works in demo mode without API configuration

## 🔮 Roadmap

- [ ] **Real Audio Recording** - Implement actual audio recording functionality
- [ ] **More States** - Add legal guides for all 50 states
- [ ] **Emergency Contacts** - Quick access to legal aid contacts
- [ ] **Offline Mode** - Cache critical information for offline access
- [ ] **Mobile App** - React Native version
- [ ] **Legal Updates** - Automated legal information updates
- [ ] **Community Features** - User-generated content and reviews

---

**⚠️ Legal Disclaimer**: This application provides general legal information and should not be considered legal advice. Always consult with a qualified attorney for specific legal situations.
