'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { ArrowLeft, Globe, Smartphone, Database, Code } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type ProjectType = 'web' | 'mobile' | 'api' | 'desktop'

interface ProjectTemplate {
  id: ProjectType
  name: string
  description: string
  icon: React.ReactNode
  features: string[]
}

const projectTemplates: ProjectTemplate[] = [
  {
    id: 'web',
    name: 'Sito Web',
    description: 'Test automatici per siti web e applicazioni web',
    icon: <Globe className="h-8 w-8" />,
    features: [
      'Test di navigazione',
      'Verifica form e input',
      'Test responsive',
      'Performance monitoring'
    ]
  },
  {
    id: 'mobile',
    name: 'App Mobile',
    description: 'Test per applicazioni mobile iOS e Android',
    icon: <Smartphone className="h-8 w-8" />,
    features: [
      'Test UI/UX',
      'Gesture testing',
      'Device compatibility',
      'Performance testing'
    ]
  },
  {
    id: 'api',
    name: 'API/Backend',
    description: 'Test per API REST, GraphQL e servizi backend',
    icon: <Database className="h-8 w-8" />,
    features: [
      'Endpoint testing',
      'Data validation',
      'Load testing',
      'Security testing'
    ]
  },
  {
    id: 'desktop',
    name: 'App Desktop',
    description: 'Test per applicazioni desktop multipiattaforma',
    icon: <Code className="h-8 w-8" />,
    features: [
      'UI automation',
      'Cross-platform testing',
      'Integration testing',
      'Regression testing'
    ]
  }
]

export default function NewProjectPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<ProjectType>('web')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accesso richiesto</h1>
          <p className="text-gray-600 mb-8">Devi effettuare l'accesso per creare un nuovo progetto.</p>
          <Link
            href="/api/auth/signin"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Accedi
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          type: selectedType,
          url: formData.url
        })
      })

      if (response.ok) {
        // Redirect to projects page
        router.push('/projects')
      } else {
        const error = await response.json()
        console.error('Error creating project:', error)
        alert(error.error || 'Errore durante la creazione del progetto')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Errore durante la creazione del progetto')
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedTemplate = projectTemplates.find(t => t.id === selectedType)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Torna ai progetti
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Crea Nuovo Progetto</h1>
          <p className="text-gray-600 mt-2">
            Configura un nuovo progetto di test automatici per la tua applicazione
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Project Type Selection */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tipo di Progetto</h2>
            <div className="space-y-3">
              {projectTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedType(template.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                    selectedType === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${
                      selectedType === template.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {template.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{template.name}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Project Configuration */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Configurazione Progetto</h2>
              
              {/* Selected Template Info */}
              {selectedTemplate && (
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      {selectedTemplate.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{selectedTemplate.name}</h3>
                      <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Funzionalità incluse:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {selectedTemplate.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Progetto *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Es. Il mio sito e-commerce"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Descrizione
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Descrivi brevemente il tuo progetto..."
                  />
                </div>

                {selectedType === 'web' && (
                  <div>
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                      URL del sito *
                    </label>
                    <input
                      type="url"
                      id="url"
                      required
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com"
                    />
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Link
                    href="/projects"
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
                  >
                    Annulla
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.name}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? 'Creazione...' : 'Crea Progetto'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}