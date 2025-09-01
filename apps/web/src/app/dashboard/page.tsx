'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Check, Crown, Zap, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { PRICING_PLANS } from '@/lib/stripe'

interface UserSubscription {
  subscriptionPlan?: string
  subscriptionStatus?: string
}

function SuccessMessage() {
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    setShowSuccess(urlParams.get('success') === 'true')
  }, [])

  if (!showSuccess) return null

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
      <div className="flex items-center">
        <Check className="h-5 w-5 text-green-600 mr-2" />
        <p className="text-green-800">
          Pagamento completato con successo! La tua sottoscrizione è ora attiva.
        </p>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/login')
      return
    }

    // Simulate fetching user subscription data
    // In a real app, you'd fetch this from your API
    setUserSubscription({
      subscriptionPlan: 'starter', // This would come from your database
      subscriptionStatus: 'active'
    })
    setLoading(false)
  }, [session, status, router])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const currentPlan = userSubscription?.subscriptionPlan
  const planDetails = currentPlan ? PRICING_PLANS[currentPlan as keyof typeof PRICING_PLANS] : null
  const isActive = userSubscription?.subscriptionStatus === 'active'

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Benvenuto, {session.user?.name || session.user?.email}
          </h1>
          <p className="text-gray-600">
            Gestisci i tuoi test e la tua sottoscrizione
          </p>
        </div>

        {/* Success Message */}
        <SuccessMessage />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Subscription Status */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Crown className="h-5 w-5 text-yellow-500 mr-2" />
                Stato Sottoscrizione
              </h2>
              
              {currentPlan && isActive ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Piano {planDetails?.name}
                      </h3>
                      <p className="text-gray-600">
                        €{planDetails?.price}/mese
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <Check className="h-4 w-4 mr-1" />
                        Attivo
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Funzionalità incluse:</h4>
                    <ul className="space-y-2">
                      {planDetails?.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nessuna sottoscrizione attiva
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Scegli un piano per iniziare a utilizzare QA Playwright
                  </p>
                  <Link
                    href="/pricing"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                  >
                    Visualizza Piani
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="h-5 w-5 text-blue-500 mr-2" />
                Azioni Rapide
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Link
                  href="/projects"
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <h3 className="font-medium text-gray-900 mb-1">Gestisci Progetti</h3>
                  <p className="text-sm text-gray-600">Crea e gestisci i tuoi progetti di test</p>
                </Link>
                
                <Link
                  href="/targets"
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <h3 className="font-medium text-gray-900 mb-1">Configura Target</h3>
                  <p className="text-sm text-gray-600">Imposta i target per i tuoi test</p>
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Usage Stats */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilizzo Mensile</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Test eseguiti</span>
                    <span className="font-medium">0 / {planDetails?.testLimit === -1 ? '∞' : planDetails?.testLimit || 0}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upgrade CTA */}
            {currentPlan !== 'enterprise' && (
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-2">Potenzia il tuo testing</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Sblocca funzionalità avanzate con un piano superiore
                </p>
                <Link
                  href="/pricing"
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors inline-block"
                >
                  Aggiorna Piano
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}