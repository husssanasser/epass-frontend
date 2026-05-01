import React, { useState } from 'react';
import { adminAPI } from '../services/api';

const VerifyQR = () => {
  const [token, setToken] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.verifyQR(token);
      setResult(res.data.result);
    } catch (err) {
      setResult('INVALID');
    } finally {
      setLoading(false);
    }
  };

  const getResultColor = () => {
    if (result === 'VALID') return '#28a745';
    if (result === 'EXPIRED') return '#ffc107';
    return '#dc3545';
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>QR Code Verification</h2>
        <p style={styles.subtitle}>Enter QR token to verify permit</p>

        <input
          style={styles.input}
          placeholder="Enter QR token..."
          value={token}
          onChange={e => setToken(e.target.value)}
        />

        <button style={styles.button} onClick={handleVerify} disabled={loading}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>

        {result && (
          <div style={{ ...styles.result, backgroundColor: getResultColor() }}>
            {result === 'VALID' && '✅ VALID — Permit is authentic and active'}
            {result === 'INVALID' && '❌ INVALID — Permit is not recognized'}
            {result === 'EXPIRED' && '⏰ EXPIRED — Permit has expired'}
          </div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { minHeight: '100vh', backgroundColor: '#003580', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: 'white', borderRadius: '12px', padding: '40px', width: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', textAlign: 'center' },
  title: { color: '#003580', fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' },
  subtitle: { color: '#666', marginBottom: '24px' },
  input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box', marginBottom: '16px' },
  button: { width: '100%', padding: '12px', backgroundColor: '#003580', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', marginBottom: '20px' },
  result: { padding: '16px', borderRadius: '8px', color: 'white', fontWeight: 'bold', fontSize: '16px' },
};

export default VerifyQR;