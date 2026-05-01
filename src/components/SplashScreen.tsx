import React, { useEffect, useState } from 'react';

interface Props {
  onFinish: () => void;
}

const SplashScreen = ({ onFinish }: Props) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 2000);
    const removeTimer = setTimeout(() => onFinish(), 2800);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onFinish]);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: '#003580',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999,
      opacity: fadeOut ? 0 : 1,
      transition: 'opacity 0.8s ease-in-out'
    }}>
      <div style={{ textAlign: 'center' }}>
        <img
          src="/logo.png"
          alt="E-Pass"
          style={{ width: '200px', height: '200px', objectFit: 'contain' }}
        />
        <p style={{ color: 'white', fontSize: '18px', marginTop: '16px', letterSpacing: '2px' }}>
          Permit Management System
        </p>
        <div style={{
          width: '200px', height: '4px',
          backgroundColor: 'rgba(255,255,255,0.3)',
          borderRadius: '2px', margin: '24px auto 0 auto', overflow: 'hidden'
        }}>
          <div style={{
            height: '100%', backgroundColor: 'white',
            borderRadius: '2px', width: '100%',
            animation: 'loading 2s ease-in-out forwards'
          }} />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;