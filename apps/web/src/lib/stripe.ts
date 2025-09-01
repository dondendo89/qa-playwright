import Stripe from 'stripe'
import { loadStripe } from '@stripe/stripe-js'

// Server-side Stripe instance
export const stripe = process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith('sk_') 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-08-27.basil',
      typescript: true,
    })
  : null

// Client-side Stripe instance
export const getStripe = () => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  if (!publishableKey || !publishableKey.startsWith('pk_')) {
    console.warn('Stripe publishable key not configured properly')
    return null
  }
  return loadStripe(publishableKey)
}

// Pricing plans
export const PRICING_PLANS = {
  starter: {
    name: 'Starter',
    price: 9.99,
    priceId: process.env.STRIPE_BASIC_PRICE_ID || 'price_starter_monthly',
    features: [
      '100 test al mese',
      'Supporto email',
      'Dashboard base',
      'Report PDF'
    ],
    testLimit: 100
  },
  professional: {
    name: 'Professional',
    price: 29.99,
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_professional_monthly',
    features: [
      '500 test al mese',
      'Supporto prioritario',
      'Dashboard avanzata',
      'Report personalizzati',
      'API access',
      'Integrazione CI/CD'
    ],
    testLimit: 500
  },
  enterprise: {
    name: 'Enterprise',
    price: 99.99,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise_monthly',
    features: [
      'Test illimitati',
      'Supporto dedicato',
      'Dashboard enterprise',
      'Report avanzati',
      'API completa',
      'Integrazione personalizzata',
      'SLA garantito'
    ],
    testLimit: -1 // -1 means unlimited
  }
}

export type PricingPlan = keyof typeof PRICING_PLANS