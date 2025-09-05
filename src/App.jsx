import React, { useState, useEffect } from 'react'
import AppHeader from './components/AppHeader'
import LocationSelector from './components/LocationSelector'
import GuideCard from './components/GuideCard'
import ScriptGenerator from './components/ScriptGenerator'
import RecordingTools from './components/RecordingTools'
import SubscriptionGate from './components/SubscriptionGate'
import AuthModal from './components/AuthModal'
import { Shield, MapPin, MessageSquare, Mic, Crown } from 'lucide-react'
import { useAppStore } from './store'
import { validateConfig } from './config'

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  
  const {
    user,
    isAuthenticated,
    selectedState,
    currentGuide,
    activeTab,
    isPremium,
    canAccessFeature,
    setSelectedState,
    setActiveTab,
    upgradeToTrial
  } = useAppStore()

  // Initialize app
  useEffect(() => {
    // Validate configuration
    try {
      validateConfig()
    } catch (error) {
      console.error('Configuration error:', error)
    }

    // Auto-detect location if not already set
    if (!selectedState && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(() => {
        // Simulate detecting California
        setSelectedState('CA')
      }, () => {
        // Default to California if location denied
        setSelectedState('CA')
      })
    }
  }, [selectedState, setSelectedState])

  const handleStateChange = (state) => {
    setSelectedState(state)
  }

  const handleSubscribe = () => {
    if (isAuthenticated) {
      upgradeToTrial()
    } else {
      setShowAuthModal(true)
    }
  }

  const handleAuthRequired = () => {
    setShowAuthModal(true)
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
              const canAccess = canAccessFeature(tab.id)
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (canAccess || isAuthenticated) {
                      setActiveTab(tab.id)
                    } else {
                      handleAuthRequired()
                    }
                  }}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white text-primary shadow-lg'
                      : 'text-white hover:bg-white/10'
                  } ${!canAccess && !isAuthenticated ? 'opacity-75' : ''}`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                  {!canAccess && !isAuthenticated && (
                    <Crown size={14} className="text-yellow-300" />
                  )}
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
              {canAccessFeature('scripts') ? (
                <ScriptGenerator 
                  selectedState={selectedState}
                  language={user?.preferred_language || 'en'}
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
              {canAccessFeature('recording') ? (
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
        {!isPremium() && (
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
                {isAuthenticated ? 'Start Free Trial - $3/month' : 'Sign Up for Free Trial'}
              </button>
            </div>
          </div>
        )}

        {/* Auth Modal */}
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          defaultMode="signup"
        />
      </div>
    </div>
  )
}



export default App
