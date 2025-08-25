export function generateFallbackProfile(name, email) {
  const username = extractUsernameFromEmail(email)
  const domain = email.split('@')[1]
  const companyName = domain.split('.')[0]
  
  return {
    name,
    email,
    headline: 'Professional',
    company: companyName.charAt(0).toUpperCase() + companyName.slice(1),
    location: 'Remote',
    bio: `${name} is a professional with experience in technology and innovation.`,
    profileImage: generateFallbackImage(name),
    socials: {
      linkedin: `https://linkedin.com/in/${username}`,
      github: `https://github.com/${username}`,
      twitter: `https://twitter.com/${username}`,
      website: ''
    },
    skills: ['Communication', 'Problem Solving', 'Leadership'],
    workHistory: [
      {
        company: companyName.charAt(0).toUpperCase() + companyName.slice(1),
        title: 'Professional',
        duration: '2020 - Present'
      }
    ],
    githubStats: {
      repos: 0,
      stars: 0,
      followers: 0
    },
    summary: `${name} is a dedicated professional with a passion for innovation and continuous learning.`
  }
}

export function mergeProfileData(name, email, ...dataSources) {
  const fallback = generateFallbackProfile(name, email)
  
  // Start with fallback data
  let merged = { ...fallback }
  
  // Merge each data source
  dataSources.forEach(data => {
    if (data && typeof data === 'object') {
      // Merge basic fields
      Object.keys(data).forEach(key => {
        if (data[key] && key !== 'socials' && key !== 'githubStats' && key !== 'workHistory') {
          merged[key] = data[key]
        }
      })
      
      // Merge socials
      if (data.socials) {
        merged.socials = { ...merged.socials, ...data.socials }
      }
      
      // Merge GitHub stats
      if (data.githubStats) {
        merged.githubStats = { ...merged.githubStats, ...data.githubStats }
      }
      
      // Merge work history
      if (data.workHistory && Array.isArray(data.workHistory) && data.workHistory.length > 0) {
        merged.workHistory = data.workHistory
      }
    }
  })
  
  return merged
}

export function generateFallbackImage(name) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=3b82f6&color=fff&bold=true`
}

function extractUsernameFromEmail(email) {
  return email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
}