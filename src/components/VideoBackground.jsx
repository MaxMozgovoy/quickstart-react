// --- START OF FILE VideoBackground.js ---
import React from 'react';

const VideoBackground = ({ videoUrl }) => {
  return (
    <div
      style={{
        position: 'fixed', // Changed to 'fixed' to cover the whole viewport
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 0, // Behind other content
        pointerEvents: 'none',
      }}
    >
      <video
        src={videoUrl}
        autoPlay
        loop
        muted
        playsInline
        style={{
          minWidth: '100%',
          minHeight: '100%',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          objectFit: 'cover', // Changed back to 'cover' to stretch and fill screen
        }}
      />
    </div>
  );
};

export default VideoBackground;
// --- END OF FILE VideoBackground.js ---