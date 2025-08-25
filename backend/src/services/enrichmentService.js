import { enrichWithGitHub } from './githubService.js'
import { enrichWithPDL } from './pdlService.js'
import { enrichWithAI } from './aiService.js'
import { generateFallbackProfile, mergeProfileData } from '../utils/profileUtils.js'

export async function enrichProfile(name, email) {
  console.log(`🚀 Starting enrichment for ${name} (${email})`)
  
  // Run all enrichment services in parallel
  const enrichmentPromises = [
    enrichWithGitHub(email, name).catch(error => {
      console.warn('GitHub enrichment failed:', error.message)
      return {}
    }),
    enrichWithPDL(email, name).catch(error => {
      console.warn('PDL enrichment failed:', error.message)
      return {}
    })
  ]

  const [githubData, pdlData] = await Promise.all(enrichmentPromises)

  // Merge initial data
  const combinedData = mergeProfileData(name, email, githubData, pdlData)

  // Enhance with AI if available
  let aiData = {}
  try {
    aiData = await enrichWithAI(name, email, combinedData)
  } catch (error) {
    console.warn('AI enrichment failed:', error.message)
  }

  // Final merge with AI enhancements
  const finalProfile = mergeProfileData(name, email, combinedData, aiData)

  console.log(`✨ Enrichment complete for ${name}`)
  return finalProfile
}