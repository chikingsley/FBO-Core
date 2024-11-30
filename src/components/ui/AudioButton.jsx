// src/components/ui/AudioButton.jsx
import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import Button from './Button'; // Import our existing Button component

const AudioButton = ({ onAudioStart, onAudioStop, className = '' }) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  const handleClick = () => {
    if (!isAudioEnabled) {
      onAudioStart?.();
      setIsAudioEnabled(true);
    } else {
      onAudioStop?.();
      setIsAudioEnabled(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant={isAudioEnabled ? 'default' : 'secondary'}
      className={`fixed bottom-5 left-5 z-50 ${className}`}
    >
      {isAudioEnabled ? (
        <>
          <Volume2 className="mr-2 h-4 w-4" />
          Audio On
        </>
      ) : (
        <>
          <VolumeX className="mr-2 h-4 w-4" />
          Start Audio
        </>
      )}
    </Button>
  );
};

// Example usage
const AudioButtonDemo = () => {
  return (
    <AudioButton 
      onAudioStart={() => console.log('Starting audio...')}
      onAudioStop={() => console.log('Stopping audio...')}
    />
  );
};

export default AudioButton;