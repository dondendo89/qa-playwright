'use client'

import { useState, useEffect } from 'react'
import { Plus, Settings, Trash2, ExternalLink } from 'lucide-react'

interface Project {
  id: string
  name: string
  description?: string
  userId: string
  createdAt: string
  updatedAt: string
  _count?: {
    targets: number
  }
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newProject, setNewProject] = useState({ name: '', description: '' })

  useEffect(() => {
    // Mock data for now - will be replaced with API calls
    const mockProjects: Project[] = [
      {
        id: '1',
        name: 'E-commerce Website',
        description: 'Test suite per il sito e-commerce principale',
        userId: 'user1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _count: { targets: 5 },
      },
      {
        id: '2',
        name: 'Corporate Website',
        description: 'Test per il sito aziendale e landing pages',
        userId: 'user1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _count: { targets: 3 },
      },
      {
        id: '3',
        name: 'Mobile App API',
        description: 'Test delle API per l\'applicazione mobile',
        userId: 'user1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        _count: { targets: 8 },
      },
    ]
    
    setTimeout(() => {
      setProjects(mockProjects)
      setLoading(false)
    }, 1000)
  }, [])

  const handleCreateProject = () => {
    if (!newProject.name.trim()) return
    
    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      description: newProject.description,
      userId: 'user1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      _count: { targets: 0 },
    }
    
    setProjects([...projects, project])
    setNewProject({ name: '', description: '' })
    setShowCreateForm(false)
  }

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-muted-foreground">Caricamento progetti...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Progetti</h1>
          <p className="text-muted-foreground">
            Gestisci i tuoi progetti di test
          </p>
        </div>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nuovo Progetto
        </button>
      </div>

      {showCreateForm && (
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-4">Crea Nuovo Progetto</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome Progetto</label>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Inserisci il nome del progetto"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Descrizione (opzionale)</label>
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                rows={3}
                placeholder="Descrivi il progetto"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleCreateProject}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Crea Progetto
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div key={project.id} className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{project.name}</h3>
                {project.description && (
                  <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                )}
              </div>
              <div className="flex space-x-1">
                <button className="rounded-md p-2 hover:bg-accent">
                  <Settings className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDeleteProject(project.id)}
                  className="rounded-md p-2 hover:bg-destructive/10 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Target:</span>
                <span className="font-medium">{project._count?.targets || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Creato:</span>
                <span>{new Date(project.createdAt).toLocaleDateString('it-IT')}</span>
              </div>
            </div>
            
            <div className="mt-4 flex space-x-2">
              <button className="flex-1 inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-xs font-medium hover:bg-accent">
                <ExternalLink className="mr-1 h-3 w-3" />
                Visualizza
              </button>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && !showCreateForm && (
        <div className="text-center py-12">
          <div className="mx-auto max-w-md">
            <h3 className="text-lg font-semibold">Nessun progetto</h3>
            <p className="text-muted-foreground mt-2">
              Inizia creando il tuo primo progetto di test
            </p>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Crea Progetto
            </button>
          </div>
        </div>
      )}
    </div>
  )
}