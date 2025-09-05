import React, { useState } from 'react'
import { Shield, CheckCircle, XCircle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'

const GuideCard = ({ guide }) => {
  const [expandedSection, setExpandedSection] = useState('overview')

  if (!guide) return null

  const sections = [
    {
      id: 'overview',
      title: 'Overview',
      icon: Shield,
      content: guide.content.overview
    },
    {
      id: 'whatToDo',
      title: 'What TO Do',
      icon: CheckCircle,
      content: guide.content.whatToDo,
      color: 'text-green-600'
    },
    {
      id: 'whatNotToSay',
      title: 'What NOT to Say',
      icon: XCircle,
      content: guide.content.whatNotToSay,
      color: 'text-red-600'
    },
    {
      id: 'specificRights',
      title: 'Your Specific Rights',
      icon: AlertTriangle,
      content: guide.content.specificRights,
      color: 'text-amber-600'
    }
  ]

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId)
  }

  return (
    <div className="bg-white rounded-lg shadow-card overflow-hidden">
      <div className="bg-primary text-white p-6">
        <h2 className="text-xl font-semibold mb-2">{guide.title}</h2>
        <p className="text-blue-100">
          Essential information for police interactions in {guide.state}
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {sections.map((section) => {
          const Icon = section.icon
          const isExpanded = expandedSection === section.id
          
          return (
            <div key={section.id} className="border-b border-gray-100 last:border-b-0">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="flex items-center space-x-3">
                  <Icon size={20} className={section.color || 'text-gray-600'} />
                  <span className="font-medium text-gray-900">{section.title}</span>
                </div>
                {isExpanded ? (
                  <ChevronUp size={20} className="text-gray-400" />
                ) : (
                  <ChevronDown size={20} className="text-gray-400" />
                )}
              </button>
              
              {isExpanded && (
                <div className="px-6 pb-4 animate-slideUp">
                  {Array.isArray(section.content) ? (
                    <ul className="space-y-2">
                      {section.content.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            section.id === 'whatToDo' ? 'bg-green-500' :
                            section.id === 'whatNotToSay' ? 'bg-red-500' :
                            'bg-amber-500'
                          }`} />
                          <span className="text-gray-700 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700 leading-relaxed">{section.content}</p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default GuideCard