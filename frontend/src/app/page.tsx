'use client'

import { useState } from 'react'
import { Search, User, Mail, Loader2 } from 'lucide-react'
import ProfileCard from '@/components/ProfileCard'
import { EnrichedProfile } from '@/types/profile'

export default function Home() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [profile, setProfile] = useState<EnrichedProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      setError('Please fill in both name and email fields')
      return
    }

    setLoading(true)
    setError('')
    setProfile(null)

    try {
      const response = await fetch('https://ai-profile-builder.onrender.com/api/enrich', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to enrich profile')
      }

      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setName('')
    setEmail('')
    setProfile(null)
    setError('')
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gradient mb-4">
          Profile Enrichment Platform
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover comprehensive profiles by combining data from GitHub, People Data Labs, and AI-powered insights
        </p>
      </div>

      {/* Search Form */}
      <div className="card mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-1" />
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline w-4 h-4 mr-1" />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="john.doe@example.com"
                required
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enriching Profile...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Enrich Profile
                </>
              )}
            </button>
            {(profile || error) && (
              <button
                type="button"
                onClick={handleReset}
                className="btn-secondary"
              >
                Reset
              </button>
            )}
          </div>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="card text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Enriching Profile
          </h3>
          <p className="text-gray-600">
            Gathering data from GitHub, People Data Labs, and AI sources...
          </p>
        </div>
      )}

      {/* Profile Results */}
      {profile && !loading && (
        <ProfileCard profile={profile} onUpdate={setProfile} />
      )}

      {/* Demo Instructions */}
      {!profile && !loading && (
        <div className="card bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            🚀 How it works
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary-600 font-bold text-xs">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">GitHub API</p>
                <p className="text-gray-600">Fetches repositories, bio, and developer stats</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary-600 font-bold text-xs">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">People Data Labs</p>
                <p className="text-gray-600">Provides professional history and social profiles</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary-600 font-bold text-xs">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">AI Enhancement</p>
                <p className="text-gray-600">Generates summaries and enriches profile data</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}