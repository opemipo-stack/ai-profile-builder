import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import enrichRoutes from './src/routes/enrich.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

// Security middleware
app.use(helmet())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use(limiter)

// ✅ CORS configuration with preflight support
const allowedOrigins = [
  "http://localhost:3000",                 
  "https://ai-profile-builder.vercel.app"
]

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    } else {
      return callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}))

// ✅ Handle preflight (OPTIONS) requests globally
app.options("*", cors())

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
  })
})

// API routes
app.use('/api', enrichRoutes)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err)
  res.status(500).json({ 
    error: 'Internal server error',
  })
})

app.listen(PORT, () => {
  console.log(` Backend server running on port ${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/health`)
  console.log(` API endpoint: http://localhost:${PORT}/api/enrich`)
})
