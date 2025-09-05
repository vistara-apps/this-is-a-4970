import React, { useState } from 'react'
import { Shield, User, Crown, LogOut, Settings } from 'lucide-react'
import { useAppStore } from '../store'
import AuthModal from './AuthModal'

const AppHeader = ({ user, isPremium }) => {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { isAuthenticated, signOut, subscriptionStatus } = useAppStore()
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
          
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="bg-white/20 backdrop-blur-sm p-2 rounded-lg hover:bg-white/30 transition-colors duration-200"
              >
                <User className="text-white" size={24} />
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 min-w-48 z-50">
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                    <p className="text-xs text-gray-500 capitalize">{subscriptionStatus} Account</p>
                  </div>
                  
                  <div className="py-1">
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                      <Settings size={16} />
                      <span>Account Settings</span>
                    </button>
                    <button 
                      onClick={() => {
                        signOut()
                        setShowUserMenu(false)
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-white hover:bg-white/30 transition-colors duration-200 font-medium"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="signin"
      />
    </header>
  )
}

export default AppHeader
