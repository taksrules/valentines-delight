import * as React from 'react';

interface MagicLinkEmailProps {
  url: string;
  host: string;
}

export const MagicLinkEmail = ({ url, host }: MagicLinkEmailProps) => (
  <div style={{
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
    backgroundColor: '#ffffff',
    padding: '40px 20px',
  }}>
    <div style={{
      maxWidth: '480px',
      margin: '0 auto',
      border: '1px solid #f0f0f0',
      borderRadius: '24px',
      padding: '40px',
      textAlign: 'center',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    }}>
      <div style={{
        fontSize: '40px',
        marginBottom: '20px',
      }}>❤️</div>
      <h1 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: '10px',
      }}>Welcome to Tenderly</h1>
      <p style={{
        fontSize: '16px',
        color: '#666',
        lineHeight: '24px',
        marginBottom: '30px',
      }}>
        You requested a magic link to sign in to your Emotional Moments Platform account on <strong>{host}</strong>.
      </p>
      <a href={url} style={{
        display: 'inline-block',
        backgroundColor: '#e11d48',
        color: '#ffffff',
        padding: '14px 32px',
        borderRadius: '16px',
        fontSize: '16px',
        fontWeight: '600',
        textDecoration: 'none',
        boxShadow: '0 4px 12px rgba(225, 29, 72, 0.25)',
      }}>
        Sign in to Tenderly
      </a>
      <p style={{
        fontSize: '14px',
        color: '#999',
        marginTop: '30px',
      }}>
        If you didn't request this email, you can safely ignore it.
      </p>
      <hr style={{
        border: 'none',
        borderTop: '1px solid #f0f0f0',
        margin: '30px 0',
      }} />
      <p style={{
        fontSize: '12px',
        color: '#ccc',
      }}>
        © 2026 Tenderly. All rights reserved.
      </p>
    </div>
  </div>
);

export default MagicLinkEmail;
