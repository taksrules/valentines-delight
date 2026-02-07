import React from 'react';

interface ShareCardLayoutProps {
  photoUrl: string; // Base64 or absolute URL
  headline: string;
  date: string;
  qrCode: string; // Base64
  journeyId: string;
}

export const ShareCardLayout: React.FC<ShareCardLayoutProps> = ({
  photoUrl,
  headline,
  date,
  qrCode,
  journeyId,
}) => {
  return (
    <div
      style={{
        width: '1080px',
        height: '1350px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundColor: '#0a0a0a',
        overflow: 'hidden',
        fontFamily: 'Geist Bold',
      }}
    >
      {/* 1. Background Photo */}
      <img
        src={photoUrl}
        alt="Background"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '1080px',
          height: '1350px',
          objectFit: 'cover',
        }}
      />

      {/* 2. Vignette Overlay - LIGHTER */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '1080px',
          height: '1350px',
          background: 'radial-gradient(circle at center, transparent 60%, rgba(0,0,0,0.15) 100%)',
          display: 'flex',
        }}
      />

      {/* 3. Headline Box - WITH BLUR */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(10px)',
            padding: '40px 60px',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
            }}
          >
            <span
              style={{
                display: 'flex',
                fontSize: '96px',
                color: 'white',
                fontWeight: 700,
                textShadow: '0 2px 8px rgba(0,0,0,0.5)',
              }}
            >
              She said YES!
            </span>
            {/* SVG Heart Icon for better compatibility */}
            <svg width="64" height="64" viewBox="0 0 24 24" fill="#e11d48" style={{ display: 'flex' }}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          
          <span
            style={{
              display: 'flex',
              fontSize: '32px',
              color: '#ffffff',
              opacity: 0.95,
              fontWeight: 400,
              fontFamily: 'Geist Regular',
              marginTop: '16px',
              textShadow: '0 2px 4px rgba(0,0,0,0.4)',
            }}
          >
            {date}
          </span>
        </div>
      </div>

      {/* 4. Bottom Branding Bar - PROPER GRADIENT */}
      <div
        style={{
          height: '240px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          padding: '0 80px 60px 80px',
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.75) 100%)',
        }}
      >
        {/* Branding Left */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              display: 'flex',
              fontSize: '48px',
              color: '#e11d48',
              fontWeight: 700,
              fontFamily: 'Geist Bold',
            }}
          >
            Tenderly
          </span>
          <span
            style={{
              display: 'flex',
              fontSize: '24px',
              color: '#ffffff',
              opacity: 0.8,
              fontFamily: 'Geist Regular',
              marginTop: '8px',
            }}
          >
            tenderly.space
          </span>
        </div>

        {/* QR Code Container Case Right */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '12px'
        }}>
          <div
            style={{
              width: '140px',
              height: '140px',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            <img
              src={qrCode}
              alt="QR Code"
              style={{
                width: '120px',
                height: '120px',
                display: 'flex',
              }}
            />
          </div>
          
          <div
            style={{
              display: 'flex',
              fontSize: '14px',
              fontFamily: 'Geist Regular',
              color: '#ffffff',
              opacity: 0.4,
              letterSpacing: '0.5px'
            }}
          >
            #{journeyId.toLowerCase()}
          </div>
        </div>
      </div>
    </div>
  );
};
