'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Check, Star, Zap, Shield, Users, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { PRICING_PLANS } from '@/lib/stripe'

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)

  const { data: session } = useSession()
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (planKey: string) => {
    if (!session) {
      window.location.href = '/auth/login'
      return
    }

    setLoading(planKey)
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: planKey }),
      })

      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (error) {
      console.error('Subscription error:', error)
      alert('Errore durante la creazione della sessione di pagamento')
    } finally {
      setLoading(null)
    }
  }

  const plans = [
    {
      key: 'starter',
      name: PRICING_PLANS.starter.name,
      description: 'Perfetto per piccoli progetti',
      price: PRICING_PLANS.starter.price,
      features: PRICING_PLANS.starter.features,
      popular: false,
      buttonText: 'Inizia Starter',
      buttonClass: 'border border-blue-600 text-blue-600 hover:bg-blue-50'
    },
    {
      key: 'professional',
      name: PRICING_PLANS.professional.name,
      description: 'Per team e progetti più grandi',
      price: PRICING_PLANS.professional.price,
      features: PRICING_PLANS.professional.features,
      popular: true,
      buttonText: 'Inizia Professional',
      buttonClass: 'bg-blue-600 text-white hover:bg-blue-700'
    },
    {
      key: 'enterprise',
      name: PRICING_PLANS.enterprise.name,
      description: 'Per grandi organizzazioni',
      price: PRICING_PLANS.enterprise.price,
      features: PRICING_PLANS.enterprise.features,
      popular: false,
      buttonText: 'Inizia Enterprise',
      buttonClass: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
    }
  ]

  const freeFeatures = [
    '1 test gratuito per ogni nuovo utente',
    'Report base del test',
    'Accesso alla dashboard',
    'Support via email'
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Paywall Alert */}
        {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('paywall') && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <p className="text-yellow-800 font-medium">
                  Sottoscrizione richiesta
                </p>
                <p className="text-yellow-700 text-sm">
                  Per accedere a questa funzionalità è necessario un piano attivo. Scegli il piano più adatto alle tue esigenze.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Prezzi Semplici e Trasparenti
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Inizia con un test gratuito, poi scegli il piano perfetto per le tue esigenze
          </p>
          
          {/* Annual/Monthly Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${!isAnnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Mensile
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Annuale
              <span className="ml-1 text-green-600 font-medium">(-25%)</span>
            </span>
          </div>
        </div>

        {/* Free Tier */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8 mb-12 border border-green-200">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <Star className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Gratuito</h2>
            <p className="text-gray-600 mb-6">
              Ogni nuovo utente registrato riceve 1 test completamente gratuito
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cosa Include:</h3>
                <ul className="space-y-2 text-left">
                  {freeFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">€0</div>
                <p className="text-gray-600 mb-4">Per il primo test</p>
                <Link
                  href="/auth/register"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-block"
                >
                  Registrati Gratis
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-lg p-8 relative ${
                plan.popular ? 'ring-2 ring-blue-600 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Più Popolare
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">€{plan.price}</span>
                  <span className="text-gray-600 block text-sm">/mese</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={() => handleSubscribe(plan.key)}
                disabled={loading === plan.key}
                className={`w-full py-3 px-4 rounded-lg transition-colors ${plan.buttonClass} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === plan.key ? 'Caricamento...' : plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Confronto Funzionalità
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4">Funzionalità</th>
                  <th className="text-center py-4 px-4">Gratuito</th>
                  <th className="text-center py-4 px-4">Starter</th>
                  <th className="text-center py-4 px-4">Professional</th>
                  <th className="text-center py-4 px-4">Enterprise</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b">
                  <td className="py-3 px-4">Test mensili</td>
                  <td className="text-center py-3 px-4">1 (una tantum)</td>
                  <td className="text-center py-3 px-4">10</td>
                  <td className="text-center py-3 px-4">100</td>
                  <td className="text-center py-3 px-4">Illimitati</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Progetti</td>
                  <td className="text-center py-3 px-4">1</td>
                  <td className="text-center py-3 px-4">1</td>
                  <td className="text-center py-3 px-4">5</td>
                  <td className="text-center py-3 px-4">Illimitati</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Support</td>
                  <td className="text-center py-3 px-4">Email</td>
                  <td className="text-center py-3 px-4">Email</td>
                  <td className="text-center py-3 px-4">Priority</td>
                  <td className="text-center py-3 px-4">Dedicato</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">API Access</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">❌</td>
                  <td className="text-center py-3 px-4">✅</td>
                  <td className="text-center py-3 px-4">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Domande Frequenti
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Come funziona il test gratuito?
              </h3>
              <p className="text-gray-600 mb-4">
                Ogni nuovo utente registrato riceve automaticamente 1 test gratuito. 
                Non è richiesta carta di credito per la registrazione.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Posso cambiare piano in qualsiasi momento?
              </h3>
              <p className="text-gray-600 mb-4">
                Sì, puoi fare upgrade o downgrade del tuo piano in qualsiasi momento. 
                Le modifiche saranno applicate dal prossimo ciclo di fatturazione.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Cosa succede se supero il limite di test?
              </h3>
              <p className="text-gray-600 mb-4">
                I test aggiuntivi saranno bloccati fino al rinnovo del piano o 
                all'upgrade a un piano superiore.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Offrite sconti per studenti o no-profit?
              </h3>
              <p className="text-gray-600 mb-4">
                Sì, offriamo sconti speciali per studenti e organizzazioni no-profit. 
                Contattaci per maggiori informazioni.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}