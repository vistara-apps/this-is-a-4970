# KnowYourRights.ai - Deployment Guide

This guide covers the complete deployment process for the KnowYourRights.ai application, from development to production.

## 🚀 Production Deployment Checklist

### 1. Backend Services Setup

#### Supabase Configuration
- [ ] Create Supabase project
- [ ] Set up authentication (email/password)
- [ ] Run database schema (from `src/lib/supabase.js`)
- [ ] Configure Row Level Security policies
- [ ] Set up storage bucket (for audio files)
- [ ] Add legal guides data
- [ ] Configure custom domain (optional)

#### OpenAI Setup
- [ ] Create OpenAI account
- [ ] Generate API key
- [ ] Set usage limits and billing alerts
- [ ] Test API integration

#### Stripe Setup
- [ ] Create Stripe account
- [ ] Set up products and pricing
- [ ] Configure webhooks endpoint
- [ ] Test payment flows
- [ ] Set up customer portal

### 2. Environment Configuration

Create production environment variables:

```env
# Production Environment Variables
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_OPENAI_API_KEY=your_openai_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
VITE_APP_ENV=production
VITE_APP_URL=https://your-domain.com
```

### 3. Security Hardening

#### Supabase Security
```sql
-- Ensure RLS is enabled on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE interaction_records ENABLE ROW LEVEL SECURITY;

-- Verify policies are in place
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
```

#### API Security
- [ ] Rotate API keys regularly
- [ ] Set up API rate limiting
- [ ] Monitor API usage and costs
- [ ] Implement request logging

### 4. Performance Optimization

#### Build Optimization
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist/assets/*.js

# Optimize images and assets
# Consider implementing lazy loading for components
```

#### Caching Strategy
- [ ] Set up CDN (Cloudflare, AWS CloudFront)
- [ ] Configure browser caching headers
- [ ] Implement service worker for offline functionality
- [ ] Cache legal guides data

## 🌐 Deployment Platforms

### Vercel Deployment (Recommended)

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Deploy
```bash
# Build and deploy
npm run build
vercel --prod

# Or connect GitHub repository for automatic deployments
```

#### 3. Configure Environment Variables
In Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add all production environment variables
3. Set environment to "Production"

#### 4. Custom Domain
1. Add custom domain in Vercel dashboard
2. Configure DNS records
3. SSL certificate is automatically provisioned

### Netlify Deployment

#### 1. Build Configuration
Create `netlify.toml`:
```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 2. Deploy
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### AWS S3 + CloudFront

#### 1. Build and Upload
```bash
# Build the application
npm run build

# Upload to S3 bucket
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

#### 2. S3 Bucket Configuration
- Enable static website hosting
- Set index document to `index.html`
- Set error document to `index.html` (for SPA routing)

## 🔧 Backend API Setup (Optional)

For production, consider moving sensitive API calls to a backend:

### Express.js Backend Example
```javascript
// server.js
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Generate script endpoint
app.post('/api/generate-script', async (req, res) => {
  try {
    const { scenario, state, language, customContext } = req.body;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a legal rights advisor..."
        },
        {
          role: "user",
          content: `Generate script for ${scenario} in ${state}...`
        }
      ],
      max_tokens: 300,
      temperature: 0.3,
    });

    res.json({ script: completion.choices[0]?.message?.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stripe webhook endpoint
app.post('/api/stripe-webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    
    // Handle subscription events
    switch (event.type) {
      case 'customer.subscription.created':
        // Update user subscription status
        break;
      case 'customer.subscription.deleted':
        // Handle subscription cancellation
        break;
    }
    
    res.json({received: true});
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

app.listen(3000);
```

## 📊 Monitoring and Analytics

### Error Tracking
```bash
# Install Sentry for error tracking
npm install @sentry/react @sentry/tracing
```

```javascript
// src/main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.VITE_APP_ENV,
});
```

### Analytics
```javascript
// Google Analytics 4
// Add to index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Performance Monitoring
- [ ] Set up Lighthouse CI
- [ ] Monitor Core Web Vitals
- [ ] Track API response times
- [ ] Monitor error rates

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
      env:
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        VITE_OPENAI_API_KEY: ${{ secrets.VITE_OPENAI_API_KEY }}
        VITE_STRIPE_PUBLISHABLE_KEY: ${{ secrets.VITE_STRIPE_PUBLISHABLE_KEY }}
        VITE_APP_ENV: production
        VITE_APP_URL: https://knowyourrights.ai
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## 🧪 Testing in Production

### Smoke Tests
```bash
# Test critical user flows
curl -f https://your-domain.com/
curl -f https://your-domain.com/api/health

# Test authentication flow
# Test subscription flow
# Test script generation
# Test recording functionality
```

### Load Testing
```bash
# Install artillery for load testing
npm install -g artillery

# Create load test configuration
# artillery.yml
config:
  target: 'https://your-domain.com'
  phases:
    - duration: 60
      arrivalRate: 10

scenarios:
  - name: "Homepage load test"
    requests:
      - get:
          url: "/"
```

## 🚨 Incident Response

### Monitoring Alerts
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure error rate alerts
- [ ] Monitor API quota usage
- [ ] Set up payment failure alerts

### Rollback Strategy
```bash
# Vercel rollback
vercel rollback [deployment-url]

# Netlify rollback
netlify sites:list
netlify api listSiteDeploys --site-id=SITE_ID
netlify api restoreSiteDeploy --site-id=SITE_ID --deploy-id=DEPLOY_ID
```

## 📋 Post-Deployment Checklist

### Functionality Testing
- [ ] User registration and login
- [ ] State selection and guide loading
- [ ] Script generation (with real API)
- [ ] Recording functionality
- [ ] Payment processing
- [ ] Email notifications
- [ ] Mobile responsiveness

### Performance Testing
- [ ] Page load times < 3 seconds
- [ ] API response times < 1 second
- [ ] Mobile performance score > 90
- [ ] Accessibility score > 95

### Security Testing
- [ ] SSL certificate valid
- [ ] Security headers configured
- [ ] API endpoints secured
- [ ] User data properly isolated
- [ ] No sensitive data in client-side code

### SEO and Marketing
- [ ] Meta tags configured
- [ ] Open Graph tags set
- [ ] Sitemap generated
- [ ] Google Search Console configured
- [ ] Analytics tracking working

## 🔧 Maintenance

### Regular Tasks
- [ ] Update dependencies monthly
- [ ] Review API usage and costs
- [ ] Monitor error rates and performance
- [ ] Update legal information quarterly
- [ ] Review and rotate API keys
- [ ] Backup database regularly

### Scaling Considerations
- [ ] Database connection pooling
- [ ] API rate limiting
- [ ] CDN configuration
- [ ] Horizontal scaling for backend
- [ ] Database read replicas

---

## 🆘 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run type-check
```

#### API Integration Issues
```bash
# Test API connections
curl -H "Authorization: Bearer $OPENAI_API_KEY" https://api.openai.com/v1/models
curl -H "apikey: $SUPABASE_ANON_KEY" "$SUPABASE_URL/rest/v1/"
```

#### Database Connection Issues
- Check Supabase project status
- Verify connection string and API keys
- Check Row Level Security policies
- Review database logs

### Support Contacts
- **Supabase Support**: support@supabase.io
- **OpenAI Support**: help@openai.com
- **Stripe Support**: support@stripe.com
- **Vercel Support**: support@vercel.com

---

**🎉 Congratulations!** Your KnowYourRights.ai application is now deployed and ready to help users understand their legal rights during police interactions.
