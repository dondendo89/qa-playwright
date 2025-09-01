'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { ArrowLeft, Play, Pause, Square, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface TestResult {
  id: string
  name: string
  status: 'running' | 'passed' | 'failed' | 'pending'
  duration?: number
  error?: string
  screenshot?: string
}

interface TestSuite {
  id: string
  name: string
  description: string
  tests: TestResult[]
  status: 'idle' | 'running' | 'completed'
  startTime?: Date
  endTime?: Date
}

const mockTestSuite: TestSuite = {
  id: '1',
  name: 'E-commerce Website Test Suite',
  description: 'Test completi per il sito e-commerce',
  status: 'idle',
  tests: [
    {
      id: '1',
      name: 'Homepage Loading',
      status: 'pending'
    },
    {
      id: '2',
      name: 'User Registration',
      status: 'pending'
    },
    {
      id: '3',
      name: 'Product Search',
      status: 'pending'
    },
    {
      id: '4',
      name: 'Add to Cart',
      status: 'pending'
    },
    {
      id: '5',
      name: 'Checkout Process',
      status: 'pending'
    },
    {
      id: '6',
      name: 'Payment Form',
      status: 'pending'
    }
  ]
}

export default function TestPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const [testSuite, setTestSuite] = useState<TestSuite>(mockTestSuite)
  const [isRunning, setIsRunning] = useState(false)

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
          <p className="text-gray-600 mb-8">Devi effettuare l'accesso per eseguire i test.</p>
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

  const runTests = async () => {
    setIsRunning(true)
    setTestSuite(prev => ({ ...prev, status: 'running', startTime: new Date() }))

    // Simulate running tests
    for (let i = 0; i < testSuite.tests.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setTestSuite(prev => ({
        ...prev,
        tests: prev.tests.map((test, index) => {
          if (index === i) {
            const success = Math.random() > 0.2 // 80% success rate
            return {
              ...test,
              status: success ? 'passed' : 'failed',
              duration: Math.floor(Math.random() * 3000) + 500,
              error: success ? undefined : 'Test failed: Element not found'
            }
          }
          if (index === i + 1) {
            return { ...test, status: 'running' }
          }
          return test
        })
      }))
    }

    setTestSuite(prev => ({ ...prev, status: 'completed', endTime: new Date() }))
    setIsRunning(false)
  }

  const stopTests = () => {
    setIsRunning(false)
    setTestSuite(prev => ({ ...prev, status: 'idle', endTime: new Date() }))
  }

  const resetTests = () => {
    setTestSuite({
      ...mockTestSuite,
      tests: mockTestSuite.tests.map(test => ({ ...test, status: 'pending' }))
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-blue-50 border-blue-200'
      case 'passed':
        return 'bg-green-50 border-green-200'
      case 'failed':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const passedTests = testSuite.tests.filter(t => t.status === 'passed').length
  const failedTests = testSuite.tests.filter(t => t.status === 'failed').length
  const totalTests = testSuite.tests.length

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
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{testSuite.name}</h1>
              <p className="text-gray-600 mt-2">{testSuite.description}</p>
            </div>
            <div className="flex gap-3">
              {!isRunning ? (
                <button
                  onClick={runTests}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Play className="h-5 w-5" />
                  Esegui Test
                </button>
              ) : (
                <button
                  onClick={stopTests}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Square className="h-5 w-5" />
                  Ferma Test
                </button>
              )}
              <button
                onClick={resetTests}
                disabled={isRunning}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <RefreshCw className="h-5 w-5" />
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Test Results */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Risultati Test</h2>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progresso</span>
                    <span>{passedTests + failedTests} / {totalTests}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((passedTests + failedTests) / totalTests) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Test List */}
              <div className="p-6">
                <div className="space-y-3">
                  {testSuite.tests.map((test, index) => (
                    <div
                      key={test.id}
                      className={`p-4 rounded-lg border-2 transition-colors ${getStatusColor(test.status)}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(test.status)}
                          <div>
                            <h3 className="font-medium text-gray-900">{test.name}</h3>
                            {test.duration && (
                              <p className="text-sm text-gray-600">
                                Durata: {test.duration}ms
                              </p>
                            )}
                            {test.error && (
                              <p className="text-sm text-red-600 mt-1">{test.error}</p>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">#{index + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiche</h3>
              
              <div className="space-y-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{passedTests}</div>
                  <div className="text-sm text-green-700">Test Superati</div>
                </div>
                
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{failedTests}</div>
                  <div className="text-sm text-red-700">Test Falliti</div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{totalTests}</div>
                  <div className="text-sm text-blue-700">Test Totali</div>
                </div>

                {testSuite.startTime && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Iniziato alle</div>
                    <div className="font-medium text-gray-900">
                      {testSuite.startTime.toLocaleTimeString('it-IT')}
                    </div>
                  </div>
                )}

                {testSuite.endTime && testSuite.status === 'completed' && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Completato alle</div>
                    <div className="font-medium text-gray-900">
                      {testSuite.endTime.toLocaleTimeString('it-IT')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}