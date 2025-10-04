import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export interface AIAnalysis {
  tags: string[]
  summary: string
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
  category: 'GENERAL' | 'QUESTION' | 'ALERT' | 'ROADBLOCK' | 'PROTEST'
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'
  actionRequired: boolean
}

export interface AIResponse {
  shouldRespond: boolean
  response: string
  confidence: number
}

export async function analyzeMessage(
  content: string,
  communityName: string,
  communityDescription?: string,
  location?: { latitude: number; longitude: number },
  recentMessages?: Array<{ content: string; user: { name: string }; createdAt: Date }>
): Promise<AIAnalysis> {
  try {
    // Try different model names in order of preference
    const modelNames = ['gemini-1.5-flash', 'gemini-pro', 'models/gemini-pro']
    let model

    for (const modelName of modelNames) {
      try {
        model = genAI.getGenerativeModel({ model: modelName })
        break
      } catch (e) {
        console.log(`Failed to load model ${modelName}, trying next...`)
        continue
      }
    }

    if (!model) {
      throw new Error('No available Gemini model found')
    }

    // Build context from recent messages
    const contextMessages = recentMessages?.slice(-10).map(m =>
      `${m.user.name}: ${m.content}`
    ).join('\n') || 'No recent context available'

    const locationInfo = location ?
      `Location: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` :
      'Location not specified'

    const prompt = `
Analyze this community message for a local community platform:

Community: "${communityName}"
Description: "${communityDescription || 'Local community'}"
${locationInfo}

Recent conversation context:
${contextMessages}

Current message: "${content}"

Based on the community context, location, and recent discussion, provide a JSON response:
{
  "tags": ["tag1", "tag2", "tag3"],
  "summary": "Brief 1-sentence summary",
  "priority": "LOW|NORMAL|HIGH|URGENT",
  "category": "GENERAL|QUESTION|ALERT|ROADBLOCK|PROTEST",
  "sentiment": "POSITIVE|NEUTRAL|NEGATIVE",
  "actionRequired": true/false
}

Consider the community's location and recent discussion when categorizing:
- Traffic/transport issues (ROADBLOCK, HIGH priority)
- Safety concerns (ALERT, HIGH/URGENT priority)
- Questions needing help (QUESTION, NORMAL priority)
- Community events (GENERAL, NORMAL priority)
- Protests/demonstrations (PROTEST, HIGH priority)
- Emergency situations (URGENT priority, actionRequired: true)

Respond only with valid JSON.
`

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    // Parse JSON response
    const analysis = JSON.parse(text.trim())

    // Validate and set defaults
    return {
      tags: Array.isArray(analysis.tags) ? analysis.tags.slice(0, 5) : ['general'],
      summary: analysis.summary || 'Community message',
      priority: ['LOW', 'NORMAL', 'HIGH', 'URGENT'].includes(analysis.priority) ? analysis.priority : 'NORMAL',
      category: ['GENERAL', 'QUESTION', 'ALERT', 'ROADBLOCK', 'PROTEST'].includes(analysis.category) ? analysis.category : 'GENERAL',
      sentiment: ['POSITIVE', 'NEUTRAL', 'NEGATIVE'].includes(analysis.sentiment) ? analysis.sentiment : 'NEUTRAL',
      actionRequired: Boolean(analysis.actionRequired)
    }
  } catch (error) {
    console.error('Error analyzing message with Gemini:', error)

    // Return default analysis on error
    return {
      tags: ['general'],
      summary: 'Community message',
      priority: 'NORMAL',
      category: 'GENERAL',
      sentiment: 'NEUTRAL',
      actionRequired: false
    }
  }
}

export async function generateAutoResponse(
  messageContent: string,
  analysis: AIAnalysis,
  communityName: string,
  communityDescription?: string,
  location?: { latitude: number; longitude: number },
  recentMessages?: Array<{ content: string; user: { name: string }; createdAt: Date }>
): Promise<AIResponse> {
  try {
    // Only auto-respond to urgent help requests or questions
    if (analysis.priority !== 'URGENT' && analysis.category !== 'QUESTION' && !analysis.actionRequired) {
      return {
        shouldRespond: false,
        response: '',
        confidence: 0
      }
    }

    // For urgent messages, always try to provide a basic response even if AI fails
    if (analysis.priority === 'URGENT' || analysis.actionRequired) {
      return {
        shouldRespond: true,
        response: "I see this is urgent. Please contact local emergency services if this is a safety issue. The community has been notified of your message.",
        confidence: 0.8
      }
    }

    // For questions, provide a basic helpful response
    if (analysis.category === 'QUESTION') {
      return {
        shouldRespond: true,
        response: "Thanks for your question! Other community members should be able to help you with local information. You can also check local community resources.",
        confidence: 0.6
      }
    }

    return {
      shouldRespond: false,
      response: '',
      confidence: 0
    }
  } catch (error) {
    console.error('Error generating auto response:', error)

    // For urgent messages, always try to provide a basic response
    if (analysis.priority === 'URGENT' || analysis.actionRequired) {
      return {
        shouldRespond: true,
        response: "I see this is urgent. Please contact local emergency services if this is a safety issue. The community will be notified of your message.",
        confidence: 0.7
      }
    }

    return {
      shouldRespond: false,
      response: '',
      confidence: 0
    }
  }
}

export async function generateCommunitySummary(messages: Array<{ content: string; createdAt: Date; user: { name: string } }>): Promise<string> {
  try {
    // Return a simple summary without AI for now
    const messageCount = messages.length
    const uniqueUsers = new Set(messages.map(m => m.user.name)).size
    const recentMessages = messages.slice(-5)

    return `Recent activity: ${messageCount} messages from ${uniqueUsers} community members. Latest discussions include various community topics and updates.`
  } catch (error) {
    console.error('Error generating community summary:', error)
    return 'Recent community activity includes various discussions and updates.'
  }
}

export async function suggestResponse(messageContent: string, context: string): Promise<string> {
  try {
    // Provide basic response suggestions without AI for now
    if (messageContent.toLowerCase().includes('help') || messageContent.includes('?')) {
      return 'Thanks for reaching out! Other community members should be able to help you with this.'
    }

    if (messageContent.toLowerCase().includes('emergency') || messageContent.toLowerCase().includes('urgent')) {
      return 'If this is an emergency, please contact local emergency services immediately. Stay safe!'
    }

    return 'Thanks for sharing this with the community!'
  } catch (error) {
    console.error('Error generating response suggestion:', error)
    return 'Thanks for sharing this with the community!'
  }
}