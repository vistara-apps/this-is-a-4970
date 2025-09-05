import { loadStripe } from '@stripe/stripe-js'
import { config } from '../config'

// Initialize Stripe
export const stripePromise = config.stripe.publishableKey 
  ? loadStripe(config.stripe.publishableKey)
  : null

// Stripe service for handling payments
export const stripeService = {
  // Create checkout session for subscription
  async createCheckoutSession(priceId, userId, email) {
    if (!stripePromise) {
      console.warn('Stripe not configured, using mock checkout')
      return mockCheckoutSession()
    }

    try {
      // In a real app, this would call your backend API
      // For now, we'll simulate the checkout process
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId,
          email,
          successUrl: `${config.app.url}/success`,
          cancelUrl: `${config.app.url}/cancel`,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const session = await response.json()
      
      const stripe = await stripePromise
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Stripe checkout error:', error)
      // Fallback to mock checkout for demo purposes
      return mockCheckoutSession()
    }
  },

  // Handle subscription management
  async createCustomerPortalSession(customerId) {
    if (!stripePromise) {
      console.warn('Stripe not configured, using mock portal')
      return mockPortalSession()
    }

    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          returnUrl: config.app.url,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create portal session')
      }

      const session = await response.json()
      window.location.href = session.url
    } catch (error) {
      console.error('Stripe portal error:', error)
      return mockPortalSession()
    }
  },

  // Verify subscription status
  async verifySubscription(userId) {
    try {
      const response = await fetch(`/api/subscription-status/${userId}`)
      
      if (!response.ok) {
        throw new Error('Failed to verify subscription')
      }

      const data = await response.json()
      return data.status // 'active', 'trialing', 'past_due', 'canceled', etc.
    } catch (error) {
      console.error('Subscription verification error:', error)
      return 'free' // Default to free if verification fails
    }
  }
}

// Mock functions for demo purposes
function mockCheckoutSession() {
  // Simulate successful subscription for demo
  setTimeout(() => {
    alert('🎉 Welcome to Premium! (This is a demo - no actual payment was processed)')
    // In a real app, you would update the user's subscription status
    window.location.reload()
  }, 1000)
}

function mockPortalSession() {
  alert('Customer portal would open here (Stripe not configured)')
}

// Subscription plans configuration
export const subscriptionPlans = {
  premium: {
    name: 'Premium',
    price: '$3',
    interval: 'month',
    features: [
      'Personalized "What to Say" Scripts',
      'Audio Recording & Documentation',
      'Multilingual Support (English & Spanish)',
      'Shareable Summary Cards',
      'Real-time Legal Updates',
      'Emergency Contact Integration',
      'Priority Customer Support'
    ],
    stripePriceId: 'price_premium_monthly', // Replace with actual Stripe price ID
  },
  trial: {
    name: '7-Day Free Trial',
    price: 'Free',
    interval: '7 days',
    features: [
      'Full access to all premium features',
      'No commitment required',
      'Cancel anytime during trial',
      'Automatic conversion to premium after trial'
    ],
    stripePriceId: 'price_trial', // Replace with actual Stripe price ID
  }
}

// Helper functions for subscription management
export const subscriptionHelpers = {
  // Check if user has active subscription
  isSubscriptionActive(subscriptionStatus) {
    return ['active', 'trialing'].includes(subscriptionStatus)
  },

  // Get subscription display info
  getSubscriptionInfo(subscriptionStatus) {
    const statusMap = {
      'free': {
        label: 'Free',
        color: 'gray',
        canUpgrade: true
      },
      'trialing': {
        label: 'Free Trial',
        color: 'blue',
        canUpgrade: false
      },
      'active': {
        label: 'Premium',
        color: 'green',
        canUpgrade: false
      },
      'past_due': {
        label: 'Payment Due',
        color: 'yellow',
        canUpgrade: false
      },
      'canceled': {
        label: 'Canceled',
        color: 'red',
        canUpgrade: true
      }
    }

    return statusMap[subscriptionStatus] || statusMap['free']
  },

  // Calculate trial end date
  getTrialEndDate(trialStartDate, trialDays = 7) {
    const startDate = new Date(trialStartDate)
    const endDate = new Date(startDate.getTime() + (trialDays * 24 * 60 * 60 * 1000))
    return endDate
  },

  // Format subscription renewal date
  formatRenewalDate(renewalDate) {
    return new Date(renewalDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}
