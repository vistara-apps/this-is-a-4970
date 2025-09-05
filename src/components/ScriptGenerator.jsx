import React, { useState } from 'react'
import { MessageSquare, Loader2, Copy, Globe } from 'lucide-react'
import { scriptService } from '../lib/openai'
import { useAppStore } from '../store'

const ScriptGenerator = ({ selectedState, language }) => {
  const [scenario, setScenario] = useState('')
  const [generatedScript, setGeneratedScript] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(language || 'en')
  const [customContext, setCustomContext] = useState('')

  const { user } = useAppStore()

  const scenarios = [
    { id: 'traffic-stop', label: 'Traffic Stop' },
    { id: 'questioning', label: 'Police Questioning' },
    { id: 'search-request', label: 'Search Request' },
    { id: 'arrest', label: 'During Arrest' },
    { id: 'stop-and-frisk', label: 'Stop and Frisk' }
  ]

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' }
  ]

  const generateScript = async () => {
    if (!scenario) return

    setIsLoading(true)
    
    try {
      const script = await scriptService.generateScript(
        scenario, 
        selectedState, 
        selectedLanguage, 
        customContext
      )
      setGeneratedScript(script)
    } catch (error) {
      console.error('Error generating script:', error)
      setGeneratedScript("Error generating script. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedScript)
  }

  return (
    <div className="bg-white rounded-lg shadow-card p-6">
      <div className="flex items-center space-x-3 mb-6">
        <MessageSquare className="text-primary" size={24} />
        <h2 className="text-xl font-semibold text-gray-900">Script Generator</h2>
      </div>

      {/* Language Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Language
        </label>
        <div className="flex space-x-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 ${
                selectedLanguage === lang.code
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Globe size={16} />
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Scenario Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Scenario
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {scenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => setScenario(s.id)}
              className={`p-3 text-left rounded-md border transition-all duration-200 ${
                scenario === s.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Context */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Context (Optional)
        </label>
        <textarea
          value={customContext}
          onChange={(e) => setCustomContext(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          rows="2"
          placeholder="Describe any specific circumstances or concerns..."
        />
        <p className="mt-1 text-xs text-gray-500">
          This helps generate more personalized and relevant scripts for your situation.
        </p>
      </div>

      {/* Generate Button */}
      <button
        onClick={generateScript}
        disabled={!scenario || isLoading}
        className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-md font-medium transition-all duration-200 flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            <span>Generating Script...</span>
          </>
        ) : (
          <span>Generate Script</span>
        )}
      </button>

      {/* Generated Script */}
      {generatedScript && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900">Your Script:</h3>
            <button
              onClick={copyToClipboard}
              className="text-primary hover:text-primary/80 transition-colors duration-200"
            >
              <Copy size={18} />
            </button>
          </div>
          <p className="text-gray-700 leading-relaxed italic">
            "{generatedScript}"
          </p>
          <div className="mt-3 text-xs text-gray-500">
            💡 Practice saying this calmly and clearly. Remember to stay respectful at all times.
          </div>
        </div>
      )}
    </div>
  )
}

export default ScriptGenerator
