import fetch from 'node-fetch'

const PDL_API_BASE = 'https://api.peopledatalabs.com/v5'

export async function enrichWithPDL(email, name) {
  const apiKey = process.env.PDL_API_KEY
  
  if (!apiKey) {
    console.warn('⚠️ PDL_API_KEY not found, skipping PDL enrichment')
    return {}
  }

  try {
    console.log('👤 Fetching People Data Labs data...')
    
    const response = await fetch(`${PDL_API_BASE}/person/enrich`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey
      },
      body: JSON.stringify({
        email: email,
        name: name
      })
    })

    if (!response.ok) {
      if (response.status === 404) {
        console.log('ℹ️ No PDL data found for this person')
        return {}
      }
      throw new Error(`PDL API returned ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    const person = data.data

    if (!person) {
      console.log('ℹ️ No person data found from PDL')
      return {}
    }

    console.log('✅ Found PDL data')

    // Extract social profiles
    const socials = {
      linkedin: '',
      github: '',
      twitter: '',
      website: ''
    }

    if (person.profiles) {
      person.profiles.forEach(profile => {
        if (profile.network === 'linkedin' && profile.url) {
          socials.linkedin = profile.url
        } else if (profile.network === 'github' && profile.url) {
          socials.github = profile.url
        } else if (profile.network === 'twitter' && profile.url) {
          socials.twitter = profile.url
        }
      })
    }

    // Extract skills
    const skills = person.skills ? person.skills.map(skill => skill.name).slice(0, 10) : []

    // Extract work history
    const workHistory = []
    if (person.experience) {
      person.experience.slice(0, 5).forEach(exp => {
        if (exp.company && exp.title) {
          workHistory.push({
            company: exp.company.name || 'Unknown Company',
            title: exp.title || 'Unknown Title',
            duration: formatDateRange(exp.start_date, exp.end_date)
          })
        }
      })
    }

    // Get most recent job info
    const latestJob = person.experience?.[0]

    return {
      name: person.full_name || name,
      headline: person.job_title || latestJob?.title || '',
      company: person.job_company_name || latestJob?.company?.name || '',
      location: person.location_names?.[0] || '',
      bio: person.summary || '',
      socials,
      skills,
      workHistory
    }

  } catch (error) {
    console.error('PDL enrichment error:', error)
    throw error
  }
}

function formatDateRange(startDate, endDate) {
  if (!startDate) return 'Unknown'
  
  const start = startDate ? new Date(startDate).getFullYear() : 'Unknown'
  const end = endDate ? new Date(endDate).getFullYear() : 'Present'
  
  return `${start} - ${end}`
}