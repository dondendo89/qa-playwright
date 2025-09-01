'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Play, Settings, BarChart3, CheckCircle, Clock, Zap, Shield, ArrowRight } from 'lucide-react'

interface Project {
  id: string
  name: string
  userId: string
  createdAt: string
  updatedAt: string
  targets: Target[]
}

interface Target {
  id: string
  name: string
  url: string
  projectId: string
  createdAt: string
  updatedAt: string
}

function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for now - will be replaced with API calls
    const mockProjects: Project[] = [
      {
        id: '1',
        name: 'E-commerce Website',
        userId: 'user1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        targets: [
          {
            id: '1',
            name: 'Homepage',
            url: 'https://example-shop.com',
            projectId: '1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '2',
            name: 'Login Page',
            url: 'https://example-shop.com/login',
            projectId: '1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      },
      {
        id: '2',
        name: 'Corporate Website',
        userId: 'user1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        targets: [
          {
            id: '3',
            name: 'About Page',
            url: 'https://corporate-site.com/about',
            projectId: '2',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      },
    ]
    
    setTimeout(() => {
      setProjects(mockProjects)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-muted-foreground">Caricamento...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Gestisci i tuoi progetti e target di test
          </p>
        </div>
        <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Nuovo Progetto
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.id} className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="text-lg font-semibold">{project.name}</h3>
              <button className="rounded-md p-2 hover:bg-accent">
                <Settings className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                {project.targets.length} target{project.targets.length !== 1 ? 's' : ''}
              </div>
              
              <div className="space-y-2">
                {project.targets.slice(0, 3).map((target) => (
                  <div key={target.id} className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{target.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{target.url}</p>
                    </div>
                    <button className="ml-2 rounded-md p-1 hover:bg-accent">
                      <Play className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                
                {project.targets.length > 3 && (
                  <div className="text-xs text-muted-foreground text-center py-2">
                    +{project.targets.length - 3} altri target
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button className="flex-1 inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                  <Play className="mr-1 h-3 w-3" />
                  Esegui Test
                </button>
                <button className="flex-1 inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-xs font-medium hover:bg-accent hover:text-accent-foreground">
                  <BarChart3 className="mr-1 h-3 w-3" />
                  Risultati
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto max-w-md">
            <h3 className="text-lg font-semibold">Nessun progetto</h3>
            <p className="text-muted-foreground mt-2">
              Inizia creando il tuo primo progetto di test
            </p>
            <button className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Crea Progetto
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Test Automatizzati con <span className="text-blue-600">Playwright</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Automatizza i test del tuo sito web con la potenza di Playwright. 
            Rileva bug, monitora le performance e assicura la qualità del tuo prodotto.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <button className="inline-flex items-center justify-center rounded-md bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium">
                Inizia Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </Link>
            <Link href="/demo">
              <button className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-8 py-3 text-lg font-medium">
                Vedi Demo
              </button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            ✨ <strong>1 test gratuito</strong> incluso alla registrazione
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Perché scegliere QA Playwright?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              La soluzione completa per automatizzare i test del tuo sito web
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Veloce e Affidabile</h3>
              <p className="text-gray-600">
                Test rapidi e precisi con Playwright, il framework più avanzato per l'automazione web
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Facile da Usare</h3>
              <p className="text-gray-600">
                Interfaccia intuitiva che non richiede conoscenze tecniche avanzate
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Monitoraggio 24/7</h3>
              <p className="text-gray-600">
                Controlli automatici continui per garantire che il tuo sito funzioni sempre
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sicuro e Privato</h3>
              <p className="text-gray-600">
                I tuoi dati sono protetti e i test vengono eseguiti in ambienti isolati
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pronto a migliorare la qualità del tuo sito?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Registrati ora e ricevi il tuo primo test gratuito
          </p>
          <Link href="/auth/register">
            <button className="inline-flex items-center justify-center rounded-md bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium">
              Registrati Gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default function Home() {
  // TODO: Check if user is authenticated
  // For now, we'll show the landing page for non-authenticated users
  const isAuthenticated = false
  
  return isAuthenticated ? <Dashboard /> : <LandingPage />
}