export function validateEnrichmentRequest(body) {
  const errors = []

  if (!body || typeof body !== 'object') {
    return { isValid: false, errors: ['Request body must be a JSON object'] }
  }

  // Validate name
  if (!body.name || typeof body.name !== 'string') {
    errors.push('Name is required and must be a string')
  } else if (body.name.trim().length === 0) {
    errors.push('Name cannot be empty')
  } else if (body.name.trim().length > 100) {
    errors.push('Name must be less than 100 characters')
  }

  // Validate email
  if (!body.email || typeof body.email !== 'string') {
    errors.push('Email is required and must be a string')
  } else if (body.email.trim().length === 0) {
    errors.push('Email cannot be empty')
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email.trim())) {
      errors.push('Email must be in valid format')
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}