import React, { useEffect } from 'react';

const VoiceSearchPage = ({ 
  isListening, 
  transcript, 
  onClose,
  onSearchComplete
}) => {
  // Auto-close and search after 1.5 seconds of silence
  useEffect(() => {
    let timeoutId;
    if (transcript && !isListening) {
      timeoutId = setTimeout(() => {
        onSearchComplete(transcript);
      }, 1500);
    }
    return () => clearTimeout(timeoutId);
  }, [transcript, isListening, onSearchComplete]);

  return (
    <div className="fixed inset-0 bg-[#202124] z-50">
      <div className="flex h-full">
        {/* Left side - Transcript */}
        <div className="flex-1 flex items-center justify-center px-12">
          <div className="w-full max-w-3xl">
            {transcript ? (
              <p className="text-4xl text-white font-light break-words">{transcript}</p>
            ) : (
              <p className="text-2xl text-gray-400">Speak now...</p>
            )}
          </div>
        </div>

        {/* Right side - Microphone */}
        <div className="w-96 flex flex-col items-center justify-center border-l border-gray-700">
          <div className={`relative ${isListening ? 'animate-pulse' : ''}`}>
            <div className="w-32 h-32 rounded-full bg-red-500 flex items-center justify-center">
              <svg 
                className="w-16 h-16 text-white" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 text-center text-gray-400">
            {isListening ? (
              <p>Listening...</p>
            ) : transcript ? (
              <p>Done</p>
            ) : (
              <p>Click the microphone to try again</p>
            )}
          </div>

          {/* Close button */}
          <button 
            onClick={onClose}
            className="mt-8 px-6 py-2 text-gray-400 hover:bg-[#303134] rounded-full"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceSearchPage;