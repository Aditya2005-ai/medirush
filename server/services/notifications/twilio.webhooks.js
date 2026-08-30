// Twilio webhook stubs for voice and DTMF handling
// These endpoints are safe stubs (do not embed credentials here).
// Install "twilio" package if you plan to generate TwiML server-side: npm i twilio

const express = require('express')
const router = express.Router()

// POST /webhooks/twilio/voice
// Twilio will request this to get TwiML instructions for a call.
// For now we return a small XML payload telling caller to press 1 to accept.
router.post('/voice', (req, res) => {
  const emergencyId = req.body.emergency_id || 'unknown'
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n  <Say voice="alice">Emergency request for user near provided location.</Say>\n  <Gather numDigits="1" action="/webhooks/twilio/voice-response" method="POST">\n    <Say>Please press 1 to accept this request, or press 2 to decline.</Say>\n  </Gather>\n  <Say>No input received. Goodbye.</Say>\n</Response>`
  res.type('text/xml').send(twiml)
})

// POST /webhooks/twilio/voice-response
// Twilio posts DTMF digits here. Update internal state or emit via Socket.IO.
router.post('/voice-response', (req, res) => {
  const digits = req.body.Digits
  const from = req.body.From
  const emergencyId = req.body.emergency_id || req.body.CallSid || 'unknown'

  // TODO: verify request came from Twilio using X-Twilio-Signature
  console.log('Twilio DTMF response', { from, digits, emergencyId })

  // Minimal TwiML response
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n  <Say>Thank you. Your response has been recorded. Goodbye.</Say>\n</Response>`
  res.type('text/xml').send(twiml)
})

module.exports = router
