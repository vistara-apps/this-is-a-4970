import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase, dbHelpers } from '../lib/supabase'
import { stripeService, subscriptionHelpers } from '../lib/stripe'

// Main application store
export const useAppStore = create(
  persist(
    (set, get) => ({
      // User state
      user: null,
      isAuthenticated: false,
      subscriptionStatus: 'free',
      
      // App state
      selectedState: 'CA',
      currentGuide: null,
      activeTab: 'guides',
      isLoading: false,
      error: null,

      // User actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      signIn: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          if (supabase) {
            const { data, error } = await supabase.auth.signInWithPassword({
              email,
              password,
            })
            
            if (error) throw error
            
            const userData = await dbHelpers.getOrCreateUser(email)
            set({ 
              user: userData, 
              isAuthenticated: true,
              subscriptionStatus: userData?.subscription_status || 'free'
            })
          } else {
            // Mock authentication for demo
            const mockUser = {
              id: '1',
              email,
              subscription_status: 'free',
              preferred_language: 'en'
            }
            set({ 
              user: mockUser, 
              isAuthenticated: true,
              subscriptionStatus: 'free'
            })
          }
        } catch (error) {
          set({ error: error.message })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      signUp: async (email, password, userData = {}) => {
        set({ isLoading: true, error: null })
        try {
          if (supabase) {
            const { data, error } = await supabase.auth.signUp({
              email,
              password,
            })
            
            if (error) throw error
            
            const newUser = await dbHelpers.getOrCreateUser(email, userData)
            set({ 
              user: newUser, 
              isAuthenticated: true,
              subscriptionStatus: newUser?.subscription_status || 'free'
            })
          } else {
            // Mock registration for demo
            const mockUser = {
              id: Date.now().toString(),
              email,
              subscription_status: 'free',
              preferred_language: userData.preferred_language || 'en',
              ...userData
            }
            set({ 
              user: mockUser, 
              isAuthenticated: true,
              subscriptionStatus: 'free'
            })
          }
        } catch (error) {
          set({ error: error.message })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      signOut: async () => {
        if (supabase) {
          await supabase.auth.signOut()
        }
        set({ 
          user: null, 
          isAuthenticated: false, 
          subscriptionStatus: 'free',
          currentGuide: null 
        })
      },

      // Subscription actions
      upgradeToTrial: async () => {
        const { user } = get()
        if (!user) return

        set({ isLoading: true })
        try {
          await stripeService.createCheckoutSession(
            'price_trial',
            user.id,
            user.email
          )
          
          // Update subscription status
          set({ subscriptionStatus: 'trialing' })
        } catch (error) {
          set({ error: error.message })
        } finally {
          set({ isLoading: false })
        }
      },

      upgradeToPremium: async () => {
        const { user } = get()
        if (!user) return

        set({ isLoading: true })
        try {
          await stripeService.createCheckoutSession(
            'price_premium_monthly',
            user.id,
            user.email
          )
          
          // Update subscription status
          set({ subscriptionStatus: 'active' })
        } catch (error) {
          set({ error: error.message })
        } finally {
          set({ isLoading: false })
        }
      },

      // App state actions
      setSelectedState: async (state) => {
        set({ selectedState: state, isLoading: true })
        try {
          const guide = await dbHelpers.getLegalGuide(state, get().user?.preferred_language || 'en')
          set({ currentGuide: guide })
        } catch (error) {
          console.error('Error loading guide:', error)
          // Fallback to mock data
          const mockGuide = getMockGuide(state)
          set({ currentGuide: mockGuide })
        } finally {
          set({ isLoading: false })
        }
      },

      setActiveTab: (tab) => set({ activeTab: tab }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),

      // Helper getters
      isPremium: () => {
        const { subscriptionStatus } = get()
        return subscriptionHelpers.isSubscriptionActive(subscriptionStatus)
      },

      canAccessFeature: (feature) => {
        const { subscriptionStatus } = get()
        const isPremium = subscriptionHelpers.isSubscriptionActive(subscriptionStatus)
        
        const premiumFeatures = ['scripts', 'recording', 'multilingual']
        return !premiumFeatures.includes(feature) || isPremium
      }
    }),
    {
      name: 'knowyourrights-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        subscriptionStatus: state.subscriptionStatus,
        selectedState: state.selectedState,
      }),
    }
  )
)

// Recording store for managing audio recordings
export const useRecordingStore = create((set, get) => ({
  isRecording: false,
  isPaused: false,
  recordingTime: 0,
  recordings: [],
  currentNotes: '',

  startRecording: () => {
    set({ 
      isRecording: true, 
      isPaused: false, 
      recordingTime: 0 
    })
    
    // Start timer
    const interval = setInterval(() => {
      const { isRecording, isPaused } = get()
      if (isRecording && !isPaused) {
        set(state => ({ recordingTime: state.recordingTime + 1 }))
      }
    }, 1000)
    
    set({ recordingInterval: interval })
  },

  pauseRecording: () => {
    set({ isPaused: true })
  },

  resumeRecording: () => {
    set({ isPaused: false })
  },

  stopRecording: async () => {
    const { recordingTime, currentNotes, recordingInterval } = get()
    
    if (recordingInterval) {
      clearInterval(recordingInterval)
    }

    const newRecording = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      duration: recordingTime,
      notes: currentNotes,
      location: useAppStore.getState().selectedState
    }

    // Save to database if user is authenticated
    const { user } = useAppStore.getState()
    if (user && supabase) {
      try {
        await dbHelpers.saveInteractionRecord(user.id, {
          timestamp: newRecording.timestamp,
          location: newRecording.location,
          notes: newRecording.notes,
          // audio_url would be set after uploading the actual audio file
        })
      } catch (error) {
        console.error('Error saving recording:', error)
      }
    }

    set(state => ({
      isRecording: false,
      isPaused: false,
      recordingTime: 0,
      currentNotes: '',
      recordings: [newRecording, ...state.recordings],
      recordingInterval: null
    }))
  },

  setNotes: (notes) => set({ currentNotes: notes }),

  loadUserRecordings: async () => {
    const { user } = useAppStore.getState()
    if (!user || !supabase) return

    try {
      const records = await dbHelpers.getUserRecords(user.id)
      const formattedRecordings = records.map(record => ({
        id: record.id,
        timestamp: record.timestamp,
        duration: 0, // Duration would be calculated from audio file
        notes: record.notes,
        location: record.location,
        audioUrl: record.audio_url,
        generatedCardUrl: record.generated_card_url
      }))
      
      set({ recordings: formattedRecordings })
    } catch (error) {
      console.error('Error loading recordings:', error)
    }
  }
}))

// Mock data helper
function getMockGuide(state) {
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
