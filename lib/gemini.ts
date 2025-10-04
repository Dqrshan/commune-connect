import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || ''
})

export interface AIAnalysis {
  tags: string[]
  summary: string
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
  category: 'GENERAL' | 'QUESTION' | 'ALERT' | 'ROADBLOCK' | 'PROTEST' | 'EMERGENCY'
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'
  actionRequired: boolean
  emergencyType?: 'MEDICAL' | 'FIRE' | 'CRIME' | 'ACCIDENT' | 'NATURAL_DISASTER' | 'OTHER'
}

export interface AIResponse {
  shouldRespond: boolean
  response: string
  confidence: number
  isEmergency: boolean
  emergencyInstructions?: string[]
}

export async function analyzeMessage(
  content: string,
  communityName: string,
  communityDescription?: string,
  location?: { latitude: number; longitude: number },
  recentMessages?: Array<{ content: string; user: { name: string }; createdAt: Date }>
): Promise<AIAnalysis> {
  try {
    // Build context from recent messages
    const contextMessages = recentMessages?.slice(-10).map(m =>
      `${m.user.name}: ${m.content}`
    ).join('\n') || 'No recent context available'

    const locationInfo = location ?
      `Location: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` :
      'Location not specified'

    const prompt = `
Analyze this community message for emergency detection and categorization:

Community: "${communityName}"
Description: "${communityDescription || 'Local community'}"
${locationInfo}

Recent conversation context:
${contextMessages}

Current message: "${content}"

Analyze for:
1. Emergency keywords (help, emergency, fire, accident, crime, medical, urgent, danger, etc.)
2. Urgency indicators (NOW, ASAP, immediate, critical, etc.)
3. Safety concerns and threats
4. Medical emergencies
5. Crime or security issues
6. Natural disasters or hazards

Provide JSON response:
{
  "tags": ["tag1", "tag2", "tag3"],
  "summary": "Brief 1-sentence summary",
  "priority": "LOW|NORMAL|HIGH|URGENT",
  "category": "GENERAL|QUESTION|ALERT|ROADBLOCK|PROTEST|EMERGENCY",
  "sentiment": "POSITIVE|NEUTRAL|NEGATIVE",
  "actionRequired": true/false,
  "emergencyType": "MEDICAL|FIRE|CRIME|ACCIDENT|NATURAL_DISASTER|OTHER"
}

Priority Guidelines:
- URGENT: Medical emergencies, fires, crimes in progress, accidents with injuries
- HIGH: Safety concerns, suspicious activity, road hazards, severe weather
- NORMAL: General questions, community updates
- LOW: Social chat, announcements

Emergency Categories:
- MEDICAL: Heart attack, injury, unconscious person, medical emergency
- FIRE: House fire, building fire, smoke, gas leak
- CRIME: Robbery, assault, break-in, suspicious person
- ACCIDENT: Car crash, injury accident, dangerous situation
- NATURAL_DISASTER: Flood, earthquake, severe storm, tornado
- OTHER: Any other urgent safety concern

Respond only with valid JSON.
`

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
    })

    // Parse JSON response
    const analysis = JSON.parse(response.text.trim())

    // Validate and set defaults
    return {
      tags: Array.isArray(analysis.tags) ? analysis.tags.slice(0, 5) : ['general'],
      summary: analysis.summary || 'Community message',
      priority: ['LOW', 'NORMAL', 'HIGH', 'URGENT'].includes(analysis.priority) ? analysis.priority : 'NORMAL',
      category: ['GENERAL', 'QUESTION', 'ALERT', 'ROADBLOCK', 'PROTEST', 'EMERGENCY'].includes(analysis.category) ? analysis.category : 'GENERAL',
      sentiment: ['POSITIVE', 'NEUTRAL', 'NEGATIVE'].includes(analysis.sentiment) ? analysis.sentiment : 'NEUTRAL',
      actionRequired: Boolean(analysis.actionRequired),
      emergencyType: ['MEDICAL', 'FIRE', 'CRIME', 'ACCIDENT', 'NATURAL_DISASTER', 'OTHER'].includes(analysis.emergencyType) ? analysis.emergencyType : undefined
    }
  } catch (error) {
    console.error('Error analyzing message with Gemini:', error)

    // Emergency keyword detection fallback
    const emergencyKeywords = [
      'help', 'emergency', 'urgent', 'fire', 'accident', 'crime', 'medical', 'danger',
      'injured', 'hurt', 'bleeding', 'unconscious', 'robbery', 'break-in', 'assault',
      'heart attack', 'stroke', 'overdose', 'suicide', 'threat', 'weapon', 'gun',
      'flood', 'earthquake', 'tornado', 'gas leak', 'explosion', 'crash', 'collision'
    ]

    const contentLower = content.toLowerCase()
    const hasEmergencyKeyword = emergencyKeywords.some(keyword => contentLower.includes(keyword))

    return {
      tags: hasEmergencyKeyword ? ['emergency', 'urgent'] : ['general'],
      summary: hasEmergencyKeyword ? 'Potential emergency situation detected' : 'Community message',
      priority: hasEmergencyKeyword ? 'URGENT' : 'NORMAL',
      category: hasEmergencyKeyword ? 'EMERGENCY' : 'GENERAL',
      sentiment: 'NEUTRAL',
      actionRequired: hasEmergencyKeyword
    }
  }
}

export async function generateEmergencyResponse(
  messageContent: string,
  analysis: AIAnalysis,
  communityName: string,
  location?: { latitude: number; longitude: number }
): Promise<AIResponse> {
  try {
    // Always respond to emergencies
    if (analysis.category === 'EMERGENCY' || analysis.priority === 'URGENT' || analysis.actionRequired) {

      const locationInfo = location ?
        `Location: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` :
        'Location not specified'

      const prompt = `
EMERGENCY RESPONSE SYSTEM

Message: "${messageContent}"
Community: "${communityName}"
${locationInfo}
Emergency Type: ${analysis.emergencyType || 'UNKNOWN'}
Priority: ${analysis.priority}

Generate immediate emergency response with:
1. Immediate safety instructions
2. Emergency contact information
3. What to do while waiting for help
4. Community alert message

Provide JSON response:
{
  "shouldRespond": true,
  "response": "Immediate response message",
  "confidence": 0.9,
  "isEmergency": true,
  "emergencyInstructions": [
    "Step 1: Immediate action",
    "Step 2: Contact emergency services",
    "Step 3: Safety measures",
    "Step 4: What to do next"
  ]
}

Emergency Response Guidelines:
- MEDICAL: Call 911, check breathing/pulse, don't move injured person
- FIRE: Call 911, evacuate immediately, stay low if smoke
- CRIME: Call 911, get to safety, don't confront
- ACCIDENT: Call 911, secure area, provide first aid if trained
- NATURAL_DISASTER: Follow local emergency protocols, seek shelter

Always include:
- Call 911 (or local emergency number)
- Specific safety instructions
- What NOT to do
- Community support message

Respond only with valid JSON.
`

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: prompt,
      })

      const aiResponse = JSON.parse(response.text.trim())

      return {
        shouldRespond: true,
        response: aiResponse.response || "🚨 EMERGENCY DETECTED: Please call 911 immediately if this is a life-threatening situation. Community members have been alerted.",
        confidence: Math.max(0.8, Number(aiResponse.confidence) || 0.9),
        isEmergency: true,
        emergencyInstructions: aiResponse.emergencyInstructions || [
          "Call 911 immediately if this is life-threatening",
          "Stay calm and follow emergency operator instructions",
          "Provide your exact location to responders",
          "Stay safe and wait for professional help"
        ]
      }
    }

    // For urgent but non-emergency situations
    if (analysis.priority === 'HIGH' || analysis.category === 'QUESTION') {
      return {
        shouldRespond: true,
        response: "I see this needs attention. Community members have been notified. If this is an emergency, please call 911 immediately.",
        confidence: 0.7,
        isEmergency: false
      }
    }

    return {
      shouldRespond: false,
      response: '',
      confidence: 0,
      isEmergency: false
    }

  } catch (error) {
    console.error('Error generating emergency response:', error)

    // Emergency fallback response
    if (analysis.category === 'EMERGENCY' || analysis.priority === 'URGENT' || analysis.actionRequired) {
      return {
        shouldRespond: true,
        response: "🚨 EMERGENCY DETECTED: If this is a life-threatening situation, call 911 immediately. Community members have been alerted to your message.",
        confidence: 0.8,
        isEmergency: true,
        emergencyInstructions: [
          "Call 911 immediately for life-threatening emergencies",
          "Provide your exact location to emergency services",
          "Stay calm and follow operator instructions",
          "Community support is on the way"
        ]
      }
    }

    return {
      shouldRespond: false,
      response: '',
      confidence: 0,
      isEmergency: false
    }
  }
}

export async function generateCommunitySummary(messages: Array<{ content: string; createdAt: Date; user: { name: string } }>): Promise<string> {
  try {
    const messageText = messages
      .slice(-20) // Last 20 messages
      .map(m => `${m.user.name}: ${m.content}`)
      .join('\n')

    const prompt = `
Summarize recent community activity:

${messageText}

Provide a 2-3 sentence summary highlighting:
- Key topics discussed
- Any safety concerns or alerts
- Overall community sentiment
- Emergency situations if any

Keep it informative and brief.
`

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
    })

    return response.text.trim()
  } catch (error) {
    console.error('Error generating community summary:', error)
    const messageCount = messages.length
    const uniqueUsers = new Set(messages.map(m => m.user.name)).size
    return `Recent activity: ${messageCount} messages from ${uniqueUsers} community members discussing various topics and updates.`
  }
}

export async function suggestResponse(messageContent: string, context: string): Promise<string> {
  try {
    const prompt = `
A user posted: "${messageContent}"
Context: ${context}

Suggest a helpful, supportive community response that:
- Addresses their concern appropriately
- Provides practical local advice if possible
- Maintains a caring, neighborly tone
- Is concise (1-2 sentences)

For emergencies, always direct to call 911.
For questions, provide helpful guidance.
For alerts, acknowledge and suggest community action.
`

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
    })

    return response.text.trim()
  } catch (error) {
    console.error('Error generating response suggestion:', error)

    // Basic pattern matching fallback
    const contentLower = messageContent.toLowerCase()

    if (contentLower.includes('emergency') || contentLower.includes('help') || contentLower.includes('urgent')) {
      return 'If this is an emergency, please call 911 immediately. The community is here to support you.'
    }

    if (contentLower.includes('?') || contentLower.includes('question')) {
      return 'Thanks for reaching out! Community members should be able to help with local information.'
    }

    return 'Thanks for sharing this with the community!'
  }
}