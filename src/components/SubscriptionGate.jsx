import React from 'react'
import { Crown, Check } from 'lucide-react'

const SubscriptionGate = ({ feature, onSubscribe }) => {
  const premiumFeatures = [
    'Personalized "What to Say" Scripts',
    'Audio Recording & Documentation',
    'Multilingual Support (English & Spanish)',
    'Shareable Summary Cards',
    'Real-time Legal Updates',
    'Emergency Contact Integration'
  ]

  return (
    <div className="bg-white rounded-lg shadow-card p-6 text-center">
      <div className="mb-6">
        <Crown className="mx-auto text-yellow-500 mb-4" size={48} />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Premium Feature: {feature}
        </h2>
        <p className="text-gray-600">
          Upgrade to access advanced tools and personalized content
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          What's Included in Premium:
        </h3>
        <div className="space-y-3">
          {premiumFeatures.map((featureItem, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Check className="text-green-500 flex-shrink-0" size={18} />
              <span className="text-sm text-gray-700">{featureItem}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={onSubscribe}
          className="w-full bg-gradient-to-r from-primary to-accent text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
        >
          Start 7-Day Free Trial
        </button>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Then just $3/month • Cancel anytime
          </p>
          <p className="text-xs text-gray-500 mt-1">
            No commitment • Full access to all premium features
          </p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          💡 <strong>Why Premium?</strong> Advanced features help you stay protected 
          and informed during critical moments when every word matters.
        </p>
      </div>
    </div>
  )
}

export default SubscriptionGate