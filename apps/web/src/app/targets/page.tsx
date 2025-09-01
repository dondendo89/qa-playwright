'use client'

import { useState, useEffect } from 'react'
import { Plus, Play, Settings, Trash2, Globe, CheckCircle, XCircle } from 'lucide-react'

interface Target {
  id: string
  name: string
  url: string
  projectId: string
  projectName?: string
  status?: 'active' | 'inactive' | 'error'
  lastRun?: string
  createdAt: string
  updatedAt: string
}

export default function TargetsPage() {
  const [targets, setTargets] = useState<Target[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTarget, setNewTarget] = useState({ name: '', url: '', projectId: '' })

  useEffect(() => {
    // Mock data for now - will be replaced with API calls
    const mockTargets: Target[] = [
      {
        id: '1',
        name: 'Homepage',
        url: 'https://example-shop.com',
        projectId: '1',
        projectName: 'E-commerce Website',
        status: 'active',
        lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Login Page',
        url: 'https://example-shop.com/login',
        projectId: '1',
        projectName: 'E-commerce Website',
        status: 'active',
        lastRun: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'About Page',
        url: 'https://corporate-site.com/about',
        projectId: '2',
        projectName: 'Corporate Website',
        status: 'error',
        lastRun: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        name: 'Contact Form',
        url: 'https://corporate-site.com/contact',
        projectId: '2',
        projectName: 'Corporate Website',
        status: 'inactive',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
    
    setTimeout(() => {
      setTargets(mockTargets)
      setLoading(false)
    }, 1000)
  }, [])

  const handleCreateTarget = () => {
    if (!newTarget.name.trim() || !newTarget.url.trim()) return
    
    const target: Target = {
      id: Date.now().toString(),
      name: newTarget.name,
      url: newTarget.url,
      projectId: newTarget.projectId || '1',
      projectName: 'E-commerce Website', // Mock project name
      status: 'inactive',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    setTargets([...targets, target])
    setNewTarget({ name: '', url: '', projectId: '' })
    setShowCreateForm(false)
  }

  const handleDeleteTarget = (id: string) => {
    setTargets(targets.filter(t => t.id !== id))
  }

  const handleRunTest = (id: string) => {
    setTargets(targets.map(t => 
      t.id === id 
        ? { ...t, status: 'active' as const, lastRun: new Date().toISOString() }
        : t
    ))
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-300" />
    }
  }

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'active':
        return 'Attivo'
      case 'error':
        return 'Errore'
      default:
        return 'Inattivo'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-muted-foreground">Caricamento target...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Target</h1>
          <p className="text-muted-foreground">
            Gestisci i target di test per i tuoi progetti
          </p>
        </div>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuovo Target
        </button>
      </div>

      {showCreateForm && (
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Crea Nuovo Target</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome Target</label>
              <input
                type="text"
                value={newTarget.name}
                onChange={(e) => setNewTarget({ ...newTarget, name: e.target.value })}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Es. Homepage, Login Page"
              />
            </div>
            <div>
              <label className="text-sm font-medium">URL</label>
              <input
                type="url"
                value={newTarget.url}
                onChange={(e) => setNewTarget({ ...newTarget, url: e.target.value })}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="https://example.com"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleCreateTarget}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Crea Target
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {targets.map((target) => (
          <div key={target.id} className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(target.status)}
                  <div>
                    <h3 className="text-lg font-semibold">{target.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Globe className="h-3 w-3" />
                      <span className="truncate">{target.url}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Progetto:</span>
                    <div className="font-medium">{target.projectName}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <div className="font-medium">{getStatusText(target.status)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Ultimo test:</span>
                    <div className="font-medium">
                      {target.lastRun 
                        ? new Date(target.lastRun).toLocaleString('it-IT')
                        : 'Mai eseguito'
                      }
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Creato:</span>
                    <div className="font-medium">
                      {new Date(target.createdAt).toLocaleDateString('it-IT')}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleRunTest(target.id)}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <Play className="mr-1 h-3 w-3" />
                  Esegui
                </button>
                <button className="rounded-md p-2 hover:bg-accent">
                  <Settings className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDeleteTarget(target.id)}
                  className="rounded-md p-2 hover:bg-destructive/10 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {targets.length === 0 && !showCreateForm && (
        <div className="text-center py-12">
          <div className="mx-auto max-w-md">
            <h3 className="text-lg font-semibold">Nessun target</h3>
            <p className="text-muted-foreground mt-2">
              Inizia creando il tuo primo target di test
            </p>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Crea Target
            </button>
          </div>
        </div>
      )}
    </div>
  )
}