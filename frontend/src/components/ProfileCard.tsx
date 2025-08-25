'use client'

import { useState } from 'react'
import Image from 'next/image'
import { 
  MapPin, 
  Building2, 
  Github, 
  Linkedin, 
  Twitter, 
  Globe, 
  Star, 
  GitFork, 
  Users,
  Edit3,
  Save,
  X
} from 'lucide-react'
import { EnrichedProfile } from '@/types/profile'

interface ProfileCardProps {
  profile: EnrichedProfile
  onUpdate: (profile: EnrichedProfile) => void
}

export default function ProfileCard({ profile, onUpdate }: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<EnrichedProfile>(profile)

  const handleSave = () => {
    onUpdate(editedProfile)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

  const updateField = (field: keyof EnrichedProfile, value: any) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }))
  }

  const updateNestedField = (parent: keyof EnrichedProfile, field: string, value: any) => {
    setEditedProfile(prev => ({
      ...prev,
      [parent]: { ...prev[parent] as any, [field]: value }
    }))
  }

  const currentProfile = isEditing ? editedProfile : profile

  return (
    <div className="card">
      {/* Header with Edit Button */}
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Profile Results</h2>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="btn-primary flex items-center gap-1 text-sm"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="btn-secondary flex items-center gap-1 text-sm"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-secondary flex items-center gap-1 text-sm"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Basic Info */}
        <div className="lg:col-span-1">
          <div className="text-center mb-6">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <Image
                src={currentProfile.profileImage}
                alt={currentProfile.name}
                fill
                className="rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>
            
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="input-field text-center text-xl font-bold mb-2"
              />
            ) : (
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {currentProfile.name}
              </h3>
            )}

            {isEditing ? (
              <input
                type="text"
                value={editedProfile.headline}
                onChange={(e) => updateField('headline', e.target.value)}
                className="input-field text-center text-gray-600 mb-4"
                placeholder="Professional headline"
              />
            ) : (
              <p className="text-gray-600 mb-4">{currentProfile.headline}</p>
            )}

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Building2 className="w-4 h-4" />
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.company}
                    onChange={(e) => updateField('company', e.target.value)}
                    className="input-field text-sm"
                    placeholder="Company"
                  />
                ) : (
                  <span>{currentProfile.company}</span>
                )}
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    className="input-field text-sm"
                    placeholder="Location"
                  />
                ) : (
                  <span>{currentProfile.location}</span>
                )}
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Social Profiles</h4>
            <div className="space-y-2">
              {Object.entries(currentProfile.socials).map(([platform, url]) => {
                const icons = {
                  github: Github,
                  linkedin: Linkedin,
                  twitter: Twitter,
                  website: Globe,
                }
                const Icon = icons[platform as keyof typeof icons] || Globe

                return (
                  <div key={platform} className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-gray-500" />
                    {isEditing ? (
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => updateNestedField('socials', platform, e.target.value)}
                        className="input-field text-sm flex-1"
                        placeholder={`${platform} URL`}
                      />
                    ) : url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline text-sm capitalize"
                      >
                        {platform}
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm capitalize">No {platform}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Detailed Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Biography</h4>
            {isEditing ? (
              <textarea
                value={editedProfile.bio}
                onChange={(e) => updateField('bio', e.target.value)}
                className="input-field min-h-[100px]"
                placeholder="Professional biography"
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">{currentProfile.bio}</p>
            )}
          </div>

          {/* Skills */}
          {currentProfile.skills && currentProfile.skills.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {currentProfile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* GitHub Stats */}
          {currentProfile.githubStats && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">GitHub Statistics</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <GitFork className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                  <div className="text-xl font-bold text-gray-900">
                    {currentProfile.githubStats.repos}
                  </div>
                  <div className="text-sm text-gray-600">Repositories</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Star className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                  <div className="text-xl font-bold text-gray-900">
                    {currentProfile.githubStats.stars}
                  </div>
                  <div className="text-sm text-gray-600">Stars</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Users className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                  <div className="text-xl font-bold text-gray-900">
                    {currentProfile.githubStats.followers}
                  </div>
                  <div className="text-sm text-gray-600">Followers</div>
                </div>
              </div>
            </div>
          )}

          {/* Work History */}
          {currentProfile.workHistory && currentProfile.workHistory.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Work History</h4>
              <div className="space-y-3">
                {currentProfile.workHistory.map((job, index) => (
                  <div key={index} className="border-l-2 border-primary-200 pl-4">
                    <h5 className="font-medium text-gray-900">{job.title}</h5>
                    <p className="text-primary-600">{job.company}</p>
                    <p className="text-sm text-gray-500">{job.duration}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Summary */}
          {currentProfile.summary && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">AI-Generated Summary</h4>
              {isEditing ? (
                <textarea
                  value={editedProfile.summary}
                  onChange={(e) => updateField('summary', e.target.value)}
                  className="input-field min-h-[100px]"
                  placeholder="AI-generated professional summary"
                />
              ) : (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <p className="text-gray-700 leading-relaxed">{currentProfile.summary}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}