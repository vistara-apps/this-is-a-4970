import React, { useState, useEffect } from 'react'
import AppHeader from './components/AppHeader'
import LocationSelector from './components/LocationSelector'
import GuideCard from './components/GuideCard'
import ScriptGenerator from './components/ScriptGenerator'
import RecordingTools from './components/RecordingTools'
import SubscriptionGate from './components/SubscriptionGate'
import { Shield, MapPin, MessageSquare, Mic, Crown } from 'lucide-react'

function App() {
  const [user, setUser] = useState(null)
  const [selectedState, setSelectedState] = useState('')
  const [currentGuide, setCurrentGuide] = useState(null)
  const [isPremium, setIsPremium] = useState(false)
  const [activeTab, setActiveTab] = useState('guides')

  // Simulate user login
  useEffect(() => {
    const mockUser = {
      userId: '1',
      email: 'user@example.com',
      preferredLanguage: 'en'
    }
    setUser(mockUser)
  }, [])

  // Auto-detect location (simulated)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(() => {
        // Simulate detecting California
        setSelectedState('CA')
      }, () => {
        // Default to California if location denied
        setSelectedState('CA')
      })
    }
  }, [])

  const handleStateChange = (state) => {
    setSelectedState(state)
    // Load guide for selected state
    const guide = getLegalGuideForState(state)
    setCurrentGuide(guide)
  }

  const handleSubscribe = () => {
    setIsPremium(true)
  }

  const tabs = [
    { id: 'guides', label: 'Guides', icon: Shield },
    { id: 'scripts', label: 'Scripts', icon: MessageSquare },
    { id: 'record', label: 'Record', icon: Mic },
  ]

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AppHeader user={user} isPremium={isPremium} />
        
        {/* Location Selector */}
        <div className="mb-6">
          <LocationSelector 
            selectedState={selectedState}
            onStateChange={handleStateChange}
          />
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white/20 backdrop-blur-sm rounded-lg p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white text-primary shadow-lg'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'guides' && (
            <div className="animate-fadeIn">
              {currentGuide && (
                <GuideCard guide={currentGuide} />
              )}
            </div>
          )}

          {activeTab === 'scripts' && (
            <div className="animate-fadeIn">
              {isPremium ? (
                <ScriptGenerator 
                  selectedState={selectedState}
                  language={user?.preferredLanguage || 'en'}
                />
              ) : (
                <SubscriptionGate 
                  feature="Personalized Scripts"
                  onSubscribe={handleSubscribe}
                />
              )}
            </div>
          )}

          {activeTab === 'record' && (
            <div className="animate-fadeIn">
              {isPremium ? (
                <RecordingTools selectedState={selectedState} />
              ) : (
                <SubscriptionGate 
                  feature="Recording Tools"
                  onSubscribe={handleSubscribe}
                />
              )}
            </div>
          )}
        </div>

        {/* Premium Upgrade Banner */}
        {!isPremium && (
          <div className="mt-8 mb-6">
            <div className="glass-effect rounded-lg p-6 text-center text-white">
              <Crown className="mx-auto mb-3 text-yellow-300" size={32} />
              <h3 className="text-xl font-semibold mb-2">Upgrade to Premium</h3>
              <p className="text-white/80 mb-4">
                Get personalized scripts, recording tools, and multilingual support
              </p>
              <button
                onClick={handleSubscribe}
                className="bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                Start Free Trial - $3/month
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Mock data function
function getLegalGuideForState(state) {
  const guides = {
    'CA': {
      guideId: '1',
      state: 'CA',
      title: 'California - Know Your Rights',
      content: {
        overview: 'In California, you have specific rights during police interactions.',
        whatToDo: [
          'Remain calm and polite',
          'Keep your hands visible',
          'Ask "Am I free to leave?"',
          'Request a lawyer if arrested',
          'Do not consent to searches'
        ],
        whatNotToSay: [
          'Do not admit guilt',
          'Do not lie to officers',
          'Do not argue or resist',
          'Do not provide information beyond required ID'
        ],
        specificRights: [
          'Right to remain silent (Miranda Rights)',
          'Right to refuse consent to search vehicle/person',
          'Right to ask if you are being detained',
          'Right to record police interactions in public'
        ]
      },
      language: 'en'
    },
    'NY': {
      guideId: '2',
      state: 'NY',
      title: 'New York - Know Your Rights',
      content: {
        overview: 'In New York, you have constitutional rights during police encounters.',
        whatToDo: [
          'Stay calm and respectful',
          'Keep hands where officers can see them',
          'Ask if you are free to leave',
          'Invoke your right to remain silent',
          'Request an attorney'
        ],
        whatNotToSay: [
          'Never admit to any wrongdoing',
          'Do not lie or provide false information',
          'Avoid arguing with officers',
          'Do not volunteer information'
        ],
        specificRights: [
          'Right to remain silent under 5th Amendment',
          'Right to refuse searches without warrant',
          'Right to know reason for detention',
          'Right to legal representation'
        ]
      },
      language: 'en'
    }
  }
  
  return guides[state] || guides['CA']
}

export default App