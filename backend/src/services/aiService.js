import fetch from 'node-fetch'

const OPENAI_API_BASE = 'https://api.openai.com/v1'

export async function enrichWithAI(name, email, existingData) {
  const apiKey = process.env.OPENAI_API_KEY
  
  if (!apiKey) {
    console.warn('⚠️ OPENAI_API_KEY not found, skipping AI enrichment')
    return {}
  }

  try {
    console.log('🤖 Generating AI enhancements...')
    
    const prompt = createEnrichmentPrompt(name, email, existingData)
    
    const response = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional profile analyst. Generate realistic, professional content based on the provided information. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API returned ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (content) {
      try {
        const parsed = JSON.parse(content)
        console.log('✅ AI enrichment completed')
        return {
          headline: parsed.headline || existingData.headline || '',
          bio: parsed.bio || existingData.bio || '',
          summary: parsed.summary || '',
          skills: parsed.skills || existingData.skills || []
        }
      } catch (parseError) {
        console.warn('Failed to parse AI response:', parseError.message)
        return {}
      }
    }

    return {}

  } catch (error) {
    console.error('AI enrichment error:', error)
    throw error
  }
}

function createEnrichmentPrompt(name, email, existingData) {
  return `Based on the following information about ${name}, generate professional profile enhancements:

Name: ${name}
Email: ${email}
Current Company: ${existingData.company || 'Unknown'}
Current Role: ${existingData.headline || 'Unknown'}
Location: ${existingData.location || 'Unknown'}
Bio: ${existingData.bio || 'None provided'}
Skills: ${existingData.skills?.join(', ') || 'Unknown'}
GitHub Stats: ${existingData.githubStats ? `${existingData.githubStats.repos} repos, ${existingData.githubStats.stars} stars` : 'None'}

Please provide:
1. A professional headline (if current one is weak or missing)
2. An enhanced professional bio (2-3 sentences, professional tone)
3. A comprehensive professional summary (3-4 sentences highlighting key strengths)
4. Relevant skills array (if current skills are limited)

Respond with valid JSON in this format:
{
  "headline": "Professional headline here",
  "bio": "Enhanced professional bio here",
  "summary": "Comprehensive professional summary here",
  "skills": ["skill1", "skill2", "skill3"]
}`
}