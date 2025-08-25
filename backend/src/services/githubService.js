import fetch from 'node-fetch'

const GITHUB_API_BASE = 'https://api.github.com'

export async function enrichWithGitHub(email, name) {
  const apiKey = process.env.GITHUB_API_KEY
  
  if (!apiKey) {
    console.warn('⚠️ GITHUB_API_KEY not found, skipping GitHub enrichment')
    return {}
  }

  try {
    console.log('🐙 Fetching GitHub data...')
    
    // Try to find GitHub user by different strategies
    const searchStrategies = [
      extractUsernameFromEmail(email),
      name.toLowerCase().replace(/\s+/g, ''),
      name.toLowerCase().replace(/\s+/g, '-'),
      name.toLowerCase().replace(/\s+/g, '_')
    ]

    let githubUser = null
    let username = null

    for (const searchTerm of searchStrategies) {
      try {
        const response = await fetch(`${GITHUB_API_BASE}/users/${searchTerm}`, {
          headers: {
            'Authorization': `token ${apiKey}`,
            'User-Agent': 'Profile-Enrichment-Platform'
          }
        })

        if (response.ok) {
          githubUser = await response.json()
          username = searchTerm
          console.log(`✅ Found GitHub user: ${username}`)
          break
        }
      } catch (error) {
        continue
      }
    }

    if (!githubUser) {
      console.log('ℹ️ No GitHub user found')
      return {}
    }

    // Get repository stats
    let totalStars = 0
    let publicRepos = githubUser.public_repos || 0

    try {
      const reposResponse = await fetch(`${GITHUB_API_BASE}/users/${username}/repos?per_page=100&sort=updated`, {
        headers: {
          'Authorization': `token ${apiKey}`,
          'User-Agent': 'Profile-Enrichment-Platform'
        }
      })

      if (reposResponse.ok) {
        const repos = await reposResponse.json()
        totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0)
      }
    } catch (error) {
      console.warn('Failed to fetch repository stats:', error.message)
    }

    return {
      name: githubUser.name || name,
      bio: githubUser.bio || '',
      profileImage: githubUser.avatar_url || '',
      location: githubUser.location || '',
      company: githubUser.company || '',
      socials: {
        github: githubUser.html_url || '',
        twitter: githubUser.twitter_username ? `https://twitter.com/${githubUser.twitter_username}` : '',
        website: githubUser.blog || ''
      },
      githubStats: {
        repos: publicRepos,
        stars: totalStars,
        followers: githubUser.followers || 0
      }
    }

  } catch (error) {
    console.error('GitHub enrichment error:', error)
    throw error
  }
}

function extractUsernameFromEmail(email) {
  return email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
}