import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminAPI } from '../services/api';

const VerifyQR = () => {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(searchParams.get('token') || '');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

 useEffect(() => {
  const t = searchParams.get('token');
  if (t) {
    verifyToken(t);
  }
}, [searchParams]);

  const verifyToken = async (t: string) => {
    setLoading(true);
    try {
      const res = await adminAPI.verifyQR(t);
      setResult(res.data);
    } catch (err) {
      setResult({ status: 'INVALID', message: 'QR Code not recognized' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = () => {
    if (!token.trim()) return;
    verifyToken(token);
  };

  const getStatusColor = () => {
    if (result?.status === 'VALID') return '#28a745';
    if (result?.status === 'EXPIRED') return '#ffc107';
    return '#dc3545';
  };

  const getStatusIcon = () => {
    if (result?.status === 'VALID') return '✓';
    if (result?.status === 'EXPIRED') return '⏰';
    return '✗';
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <img src="/logo.png" alt="E-Pass" style={styles.logo} />
          <h2 style={styles.title}>QR Code Verification</h2>
          <p style={styles.subtitle}>Scan or enter token to verify permit</p>
        </div>

        {!result && !loading && (
          <div style={styles.inputSection}>
            <input
              style={styles.input}
              placeholder="Enter QR token..."
              value={token}
              onChange={e => setToken(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleVerify()}
            />
            <button style={styles.button} onClick={handleVerify}>
              Verify
            </button>
          </div>
        )}

        {loading && (
          <div style={styles.loadingBox}>
            <p style={styles.loadingText}>Verifying permit...</p>
          </div>
        )}

        {result && (
          <div style={{ ...styles.resultCard, borderColor: getStatusColor() }}>
            <div style={{ ...styles.statusHeader, backgroundColor: getStatusColor() }}>
              <span style={styles.statusIcon}>{getStatusIcon()}</span>
              <span style={styles.statusText}>{result.status}</span>
              <p style={styles.statusMessage}>{result.message}</p>
            </div>

            {result.status === 'VALID' && (
              <div style={styles.details}>
                <h3 style={styles.detailsTitle}>Permit Details</h3>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Permit ID</span>
                  <span style={styles.detailValue}>#{result.permitId}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Applicant Name</span>
                  <span style={styles.detailValue}>{result.applicantName}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Permit Type</span>
                  <span style={styles.detailValue}>{result.permitType}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Purpose</span>
                  <span style={styles.detailValue}>{result.purpose}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Destination</span>
                  <span style={styles.detailValue}>{result.destination}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Start Date</span>
                  <span style={styles.detailValue}>{result.startDate}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>End Date</span>
                  <span style={styles.detailValue}>{result.endDate}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Expiry Date</span>
                  <span style={styles.detailValue}>{result.expiryDate}</span>
                </div>
              </div>
            )}

            <button
              style={styles.resetBtn}
              onClick={() => { setResult(null); setToken(''); }}
            >
              Verify Another Permit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh', backgroundColor: '#003580',
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: '20px'
  },
  card: {
    backgroundColor: 'white', borderRadius: '12px',
    padding: '40px', width: '500px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
  },
  header: { textAlign: 'center', marginBottom: '24px' },
  logo: { width: '80px', height: '80px', objectFit: 'contain', marginBottom: '12px' },
  title: { color: '#003580', fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px 0' },
  subtitle: { color: '#666', fontSize: '14px', margin: 0 },
  inputSection: { display: 'flex', gap: '10px', marginBottom: '20px' },
  input: { flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' },
  button: {
    padding: '10px 20px', backgroundColor: '#003580',
    color: 'white', border: 'none', borderRadius: '6px',
    cursor: 'pointer', fontSize: '14px', fontWeight: 'bold'
  },
  loadingBox: { textAlign: 'center', padding: '20px' },
  loadingText: { color: '#003580', fontSize: '16px' },
  resultCard: { border: '2px solid', borderRadius: '12px', overflow: 'hidden' },
  statusHeader: { padding: '20px', textAlign: 'center', color: 'white' },
  statusIcon: { fontSize: '40px', display: 'block', marginBottom: '8px' },
  statusText: { fontSize: '24px', fontWeight: 'bold', display: 'block' },
  statusMessage: { margin: '4px 0 0 0', fontSize: '14px', opacity: 0.9 },
  details: { padding: '20px' },
  detailsTitle: { color: '#003580', fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' },
  detailRow: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f5f5f5' },
  detailLabel: { color: '#666', fontSize: '13px' },
  detailValue: { color: '#333', fontSize: '13px', fontWeight: 'bold' },
  resetBtn: {
    width: '100%', padding: '12px', backgroundColor: '#003580',
    color: 'white', border: 'none', cursor: 'pointer',
    fontSize: '14px', fontWeight: 'bold'
  },
};

export default VerifyQR;