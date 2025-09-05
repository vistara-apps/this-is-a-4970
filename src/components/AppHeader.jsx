import React from 'react'
import { Shield, User, Crown } from 'lucide-react'

const AppHeader = ({ user, isPremium }) => {
  return (
    <header className="py-6 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
            <Shield className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              KnowYourRights.ai
            </h1>
            <p className="text-white/80 text-sm">
              Your pocket legal guide
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {isPremium && (
            <div className="flex items-center space-x-1 bg-yellow-500/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <Crown size={16} className="text-yellow-300" />
              <span className="text-yellow-300 text-sm font-medium">Premium</span>
            </div>
          )}
          
          <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
            <User className="text-white" size={24} />
          </div>
        </div>
      </div>
    </header>
  )
}

export default AppHeader