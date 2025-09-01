'use client'

import { useState } from 'react'
import { Play, CheckCircle, ArrowRight, Star, Users, Shield } from 'lucide-react'
import Link from 'next/link'

export default function DemoPage() {
  const [isPlaying, setIsPlaying] = useState(false)

  const features = [
    {
      icon: CheckCircle,
      title: 'Test Automatizzati',
      description: 'Esegui test end-to-end automatici su qualsiasi sito web'
    },
    {
      icon: Shield,
      title: 'Affidabile',
      description: 'Powered by Playwright per test stabili e veloci'
    },
    {
      icon: Users,
      title: 'Facile da Usare',
      description: 'Interfaccia intuitiva, nessuna configurazione complessa'
    }
  ]

  const testimonials = [
    {
      name: 'Marco Rossi',
      role: 'Frontend Developer',
      content: 'QA Playwright mi ha fatto risparmiare ore di testing manuale!',
      rating: 5
    },
    {
      name: 'Laura Bianchi',
      role: 'QA Engineer',
      content: 'Perfetto per automatizzare i test di regressione.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            QA Testing Automatizzato
            <span className="text-blue-600"> Semplificato</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Testa il tuo sito web automaticamente con Playwright. 
            Ogni utente registrato riceve <strong>1 test gratuito</strong> per provare il servizio.
          </p>
          
          {/* Demo Video/Preview */}
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8 max-w-4xl mx-auto">
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              {!isPlaying ? (
                <button
                  onClick={() => setIsPlaying(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Play className="h-5 w-5" />
                  <span>Guarda la Demo</span>
                </button>
              ) : (
                <div className="text-center">
                  <div className="animate-pulse text-gray-500 mb-4">
                    🎬 Demo in riproduzione...
                  </div>
                  <p className="text-sm text-gray-600">
                    Qui verrà mostrato un video demo del testing automatico
                  </p>
                </div>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Vedi QA Playwright in Azione
            </h3>
            <p className="text-gray-600">
              Scopri come i nostri test automatizzati possono identificare problemi 
              nel tuo sito web in pochi minuti.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              Inizia Test Gratuito
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Vedi Prezzi
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-lg">
              <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* How it Works */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Come Funziona
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">1</span>
              </div>
              <h3 className="font-semibold mb-2">Registrati</h3>
              <p className="text-sm text-gray-600">Crea il tuo account gratuito</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">2</span>
              </div>
              <h3 className="font-semibold mb-2">Configura</h3>
              <p className="text-sm text-gray-600">Inserisci l'URL del tuo sito</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">3</span>
              </div>
              <h3 className="font-semibold mb-2">Test Gratuito</h3>
              <p className="text-sm text-gray-600">Esegui il tuo primo test gratis</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">4</span>
              </div>
              <h3 className="font-semibold mb-2">Risultati</h3>
              <p className="text-sm text-gray-600">Ricevi report dettagliati</p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Cosa Dicono i Nostri Utenti
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-blue-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Pronto a Testare il Tuo Sito?
          </h2>
          <p className="text-xl mb-6">
            Registrati ora e ricevi il tuo primo test completamente gratuito!
          </p>
          <Link
            href="/auth/register"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            Inizia Subito
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}