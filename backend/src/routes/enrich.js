import express from 'express'
import { enrichProfile } from '../services/enrichmentService.js'
import { validateEnrichmentRequest } from '../utils/validation.js'

const router = express.Router()

// POST /api/enrich - Enrich user profile
router.post('/enrich', async (req, res) => {
  try {
    // Validate request body
    const validation = validateEnrichmentRequest(req.body)
    if (!validation.isValid) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validation.errors 
      })
    }

    const { name, email } = req.body
    console.log(`🔍 Enriching profile for: ${name} (${email})`)

    // Enrich the profile
    const enrichedProfile = await enrichProfile(name.trim(), email.trim().toLowerCase())

    console.log(`✅ Successfully enriched profile for: ${name}`)
    res.json(enrichedProfile)

  } catch (error) {
    console.error('❌ Profile enrichment error:', error)
    res.status(500).json({ 
      error: 'Profile enrichment failed',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    })
  }
})

export default router