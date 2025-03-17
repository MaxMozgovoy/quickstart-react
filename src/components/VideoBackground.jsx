import React from 'react';

const VideoBackground = ({ videoUrl }) => {
  return (
    <div
      style={{
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
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
          objectFit: 'contain', // Changed to 'contain' to fit entire video
          width: '100%',      // Ensure video takes full width of container
          height: '100%',     // Ensure video takes full height of container
        }}
      />
    </div>
  );
};

export default VideoBackground;