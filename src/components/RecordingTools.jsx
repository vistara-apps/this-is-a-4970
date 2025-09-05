import React, { useState, useRef } from 'react'
import { Mic, Square, Play, Pause, Download, FileText, Share } from 'lucide-react'

const RecordingTools = ({ selectedState }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [notes, setNotes] = useState('')
  const [recordings, setRecordings] = useState([])
  const intervalRef = useRef(null)

  const startRecording = () => {
    setIsRecording(true)
    setRecordingTime(0)
    intervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1)
    }, 1000)
  }

  const stopRecording = () => {
    setIsRecording(false)
    setIsPaused(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    // Create mock recording
    const newRecording = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      duration: recordingTime,
      notes: notes,
      location: selectedState
    }
    
    setRecordings(prev => [newRecording, ...prev])
    setNotes('')
    setRecordingTime(0)
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
    if (isPaused) {
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const generateSummaryCard = (recording) => {
    const summaryData = {
      timestamp: new Date(recording.timestamp).toLocaleString(),
      location: recording.location,
      duration: formatTime(recording.duration),
      notes: recording.notes,
      rights: [
        "Right to remain silent was exercised",
        "Right to record interaction in public space",
        "Did not consent to searches",
        "Requested legal representation"
      ]
    }
    
    // In a real app, this would generate a shareable summary
    console.log('Summary Card Generated:', summaryData)
    alert('Summary card generated! (This would normally create a downloadable summary)')
  }

  return (
    <div className="space-y-6">
      {/* Recording Controls */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Mic className="text-primary" size={24} />
          <h2 className="text-xl font-semibold text-gray-900">Record Interaction</h2>
        </div>

        <div className="text-center mb-6">
          <div className="text-4xl font-mono font-bold text-gray-900 mb-4">
            {formatTime(recordingTime)}
          </div>
          
          <div className="flex justify-center space-x-4">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full transition-all duration-200 transform hover:scale-105"
              >
                <Mic size={24} />
              </button>
            ) : (
              <>
                <button
                  onClick={togglePause}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white p-4 rounded-full transition-all duration-200"
                >
                  {isPaused ? <Play size={24} /> : <Pause size={24} />}
                </button>
                <button
                  onClick={stopRecording}
                  className="bg-gray-500 hover:bg-gray-600 text-white p-4 rounded-full transition-all duration-200"
                >
                  <Square size={24} />
                </button>
              </>
            )}
          </div>
          
          {isRecording && (
            <div className="mt-4">
              <div className="flex items-center justify-center space-x-2 text-red-500">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="font-medium">
                  {isPaused ? 'Recording Paused' : 'Recording...'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Notes Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            rows="3"
            placeholder="Describe the interaction, location, officers present, etc..."
          />
        </div>

        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
          <strong>Legal Note:</strong> Recording police interactions in public is generally legal, 
          but laws vary by state. In {selectedState}, ensure you're in a public space and not 
          interfering with police duties.
        </div>
      </div>

      {/* Previous Recordings */}
      {recordings.length > 0 && (
        <div className="bg-white rounded-lg shadow-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Previous Recordings</h3>
          <div className="space-y-3">
            {recordings.map((recording) => (
              <div key={recording.id} className="border border-gray-200 rounded-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-gray-600">
                    {new Date(recording.timestamp).toLocaleString()}
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatTime(recording.duration)}
                  </div>
                </div>
                
                {recording.notes && (
                  <p className="text-sm text-gray-700 mb-3">{recording.notes}</p>
                )}
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => generateSummaryCard(recording)}
                    className="flex items-center space-x-1 text-sm bg-primary text-white px-3 py-1 rounded hover:bg-primary/90 transition-colors duration-200"
                  >
                    <FileText size={14} />
                    <span>Generate Summary</span>
                  </button>
                  <button className="flex items-center space-x-1 text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 transition-colors duration-200">
                    <Share size={14} />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default RecordingTools