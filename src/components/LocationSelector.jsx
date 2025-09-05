import React, { useState } from 'react'
import { MapPin, ChevronDown } from 'lucide-react'

const LocationSelector = ({ selectedState, onStateChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  const states = [
    { code: 'CA', name: 'California' },
    { code: 'NY', name: 'New York' },
    { code: 'TX', name: 'Texas' },
    { code: 'FL', name: 'Florida' },
    { code: 'IL', name: 'Illinois' },
    { code: 'PA', name: 'Pennsylvania' },
    { code: 'OH', name: 'Ohio' },
    { code: 'GA', name: 'Georgia' },
    { code: 'NC', name: 'North Carolina' },
    { code: 'MI', name: 'Michigan' }
  ]

  const selectedStateName = states.find(s => s.code === selectedState)?.name || 'Select State'

  const handleStateSelect = (stateCode) => {
    onStateChange(stateCode)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-3 text-white flex items-center justify-between hover:bg-white/30 transition-all duration-200"
      >
        <div className="flex items-center space-x-3">
          <MapPin size={20} />
          <span className="font-medium">{selectedStateName}</span>
        </div>
        <ChevronDown 
          size={20} 
          className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-card border border-gray-200 z-50 max-h-60 overflow-y-auto">
          {states.map((state) => (
            <button
              key={state.code}
              onClick={() => handleStateSelect(state.code)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 ${
                selectedState === state.code ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700'
              }`}
            >
              {state.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LocationSelector