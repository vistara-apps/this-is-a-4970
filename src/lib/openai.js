import OpenAI from 'openai'
import { config } from '../config'

// Initialize OpenAI client
export const openai = config.openai.apiKey 
  ? new OpenAI({
      apiKey: config.openai.apiKey,
      dangerouslyAllowBrowser: true // Note: In production, API calls should go through your backend
    })
  : null

// Script generation service
export const scriptService = {
  async generateScript(scenario, state, language = 'en', customContext = '') {
    if (!openai) {
      // Return mock data if OpenAI is not configured
      return getMockScript(scenario, language)
    }

    try {
      const prompt = createScriptPrompt(scenario, state, language, customContext)
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a legal rights advisor helping people understand their rights during police interactions. Provide clear, concise, and legally accurate scripts that people can use to assert their constitutional rights. Always emphasize remaining calm and respectful."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.3,
      })

      return completion.choices[0]?.message?.content || getMockScript(scenario, language)
    } catch (error) {
      console.error('OpenAI API error:', error)
      return getMockScript(scenario, language)
    }
  },

  async generateSummaryCard(interactionData) {
    if (!openai) {
      return getMockSummaryCard(interactionData)
    }

    try {
      const prompt = createSummaryPrompt(interactionData)
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a legal documentation assistant. Create clear, factual summaries of police interactions that can be used for legal reference. Focus on rights exercised, key events, and important details."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 400,
        temperature: 0.2,
      })

      return completion.choices[0]?.message?.content || getMockSummaryCard(interactionData)
    } catch (error) {
      console.error('OpenAI API error:', error)
      return getMockSummaryCard(interactionData)
    }
  }
}

// Helper function to create script generation prompts
function createScriptPrompt(scenario, state, language, customContext) {
  const languageInstruction = language === 'es' 
    ? 'Respond in Spanish.' 
    : 'Respond in English.'

  const scenarioDescriptions = {
    'traffic-stop': 'during a traffic stop',
    'questioning': 'when being questioned by police',
    'search-request': 'when police request to search person or property',
    'arrest': 'during an arrest situation',
    'stop-and-frisk': 'during a stop and frisk encounter'
  }

  return `
Generate a clear, respectful script for someone to use ${scenarioDescriptions[scenario] || 'during a police interaction'} in ${state}. 

Requirements:
- Include assertion of constitutional rights (4th, 5th, 6th amendments)
- Emphasize remaining calm and respectful
- Be specific to ${state} laws where applicable
- Keep it concise and memorable
- Include key phrases like "Am I free to leave?" and "I do not consent to searches"

${customContext ? `Additional context: ${customContext}` : ''}

${languageInstruction}

Provide only the script text, formatted as a direct quote.
  `.trim()
}

// Helper function to create summary prompts
function createSummaryPrompt(interactionData) {
  return `
Create a factual summary of this police interaction for legal documentation:

Date/Time: ${interactionData.timestamp}
Location: ${interactionData.location}
Duration: ${interactionData.duration || 'Not specified'}
Notes: ${interactionData.notes || 'No additional notes'}

Please create a structured summary including:
1. Basic interaction details
2. Rights that were exercised
3. Key events or statements
4. Recommendations for follow-up

Keep it professional and factual.
  `.trim()
}

// Mock data for when OpenAI is not available
function getMockScript(scenario, language) {
  const scripts = {
    'traffic-stop': {
      en: `"Good evening, officer. I understand you've stopped me. Am I free to leave? I choose to remain silent and would like to speak with an attorney. I do not consent to any searches of my person or vehicle."`,
      es: `"Buenas tardes, oficial. Entiendo que me ha detenido. ¿Soy libre de irme? Elijo permanecer en silencio y me gustaría hablar con un abogado. No consiento ningún registro de mi persona o vehículo."`
    },
    'questioning': {
      en: `"I am exercising my right to remain silent. I would like to speak with an attorney before answering any questions. Am I under arrest or am I free to leave?"`,
      es: `"Estoy ejerciendo mi derecho a permanecer en silencio. Me gustaría hablar con un abogado antes de responder cualquier pregunta. ¿Estoy arrestado o soy libre de irme?"`
    },
    'search-request': {
      en: `"I do not consent to any search of my person, belongings, or property. I am exercising my Fourth Amendment rights. Please state clearly if this is a lawful order or a request."`,
      es: `"No consiento ningún registro de mi persona, pertenencias o propiedad. Estoy ejerciendo mis derechos de la Cuarta Enmienda. Por favor, declare claramente si esto es una orden legal o una solicitud."`
    },
    'arrest': {
      en: `"I am invoking my right to remain silent and my right to an attorney. I will not answer any questions without my lawyer present. Please ensure this interaction is being recorded."`,
      es: `"Estoy invocando mi derecho a permanecer en silencio y mi derecho a un abogado. No responderé ninguna pregunta sin mi abogado presente. Por favor, asegúrese de que esta interacción esté siendo grabada."`
    },
    'stop-and-frisk': {
      en: `"Am I being detained or am I free to leave? I do not consent to this search. I am not resisting, but I do not consent. I want to speak with an attorney."`,
      es: `"¿Estoy siendo detenido o soy libre de irme? No consiento este registro. No me estoy resistiendo, pero no consiento. Quiero hablar con un abogado."`
    }
  }

  return scripts[scenario]?.[language] || scripts[scenario]?.en || "Script not available"
}

function getMockSummaryCard(interactionData) {
  return `
POLICE INTERACTION SUMMARY

Date/Time: ${interactionData.timestamp}
Location: ${interactionData.location}
Duration: ${interactionData.duration || 'Not specified'}

RIGHTS EXERCISED:
• Right to remain silent was invoked
• Right to legal representation was requested
• Did not consent to searches
• Asked if free to leave

INTERACTION NOTES:
${interactionData.notes || 'No additional notes provided'}

RECOMMENDATIONS:
• Keep this documentation for your records
• Contact an attorney if you have concerns
• Report any rights violations to appropriate authorities
• Consider filing a complaint if misconduct occurred

This summary is for documentation purposes only and does not constitute legal advice.
  `.trim()
}
