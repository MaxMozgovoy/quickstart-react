import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

const LottiePlayer = ({ url, style }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const animation = lottie.loadAnimation({
        container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: url,
      });

      return () => {
        animation.destroy();
      };
    }
  }, [url]);

  return (
    <div ref={containerRef} style={style}>
      {/* The Lottie animation will be rendered here */}
    </div>
  );
};

export default LottiePlayer;