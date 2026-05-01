import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { permitAPI } from '../../services/api';
import { Permit } from '../../types';

const MyQRCode = () => {
  const [permits, setPermits] = useState<Permit[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPermits = async () => {
      try {
        const res = await permitAPI.getMyPermits();
        setPermits(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPermits();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate('/user/dashboard')}>
            Back
          </button>
          <h2 style={styles.title}>My QR Codes</h2>
        </div>
        {loading ? (
          <p style={styles.empty}>Loading...</p>
        ) : permits.length === 0 ? (
          <div style={styles.emptyBox}>
            <p style={styles.empty}>No approved permits found.</p>
            <button style={styles.submitBtn} onClick={() => navigate('/user/submit')}>
              Submit a Permit Request
            </button>
          </div>
        ) : (
          permits.map(permit => (
            <div key={permit.id} style={styles.permitCard}>
              <div style={styles.permitInfo}>
                <div style={styles.infoRow}>
                  <span style={styles.label}>Permit ID</span>
                  <span style={styles.value}>#{permit.id}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.label}>Permit Type</span>
                  <span style={styles.value}>{permit.permitRequest?.permitType}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.label}>Applicant</span>
                  <span style={styles.value}>{permit.user?.fullName}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.label}>Expiry Date</span>
                  <span style={styles.value}>{permit.expiryDate}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.label}>Status</span>
                  <span style={styles.approvedBadge}>APPROVED</span>
                </div>
              </div>
              <div style={styles.qrSection}>
                {permit.qrCode ? (
                  <>
                    <img
                      src={`data:image/png;base64,${permit.qrCode}`}
                      alt="QR Code"
                      style={styles.qrImage}
                    />
                    <p style={styles.qrNote}>
                      Scan this QR code at checkpoints for verification
                    </p>
                  </>
                ) : (
                  <p style={styles.empty}>QR Code not available</p>
                )}
              </div>
            </div>
          ))
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
    padding: '40px', width: '700px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
  },
  header: {
    display: 'flex', alignItems: 'center',
    gap: '16px', marginBottom: '24px'
  },
  backBtn: {
    padding: '8px 16px', backgroundColor: '#003580',
    color: 'white', border: 'none', borderRadius: '6px',
    cursor: 'pointer', fontSize: '14px'
  },
  title: { color: '#003580', fontSize: '22px', fontWeight: 'bold' },
  emptyBox: { textAlign: 'center', padding: '40px' },
  empty: { textAlign: 'center', color: '#666', fontSize: '16px' },
  submitBtn: {
    marginTop: '16px', padding: '10px 20px',
    backgroundColor: '#003580', color: 'white',
    border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontSize: '14px'
  },
  permitCard: {
    border: '1px solid #eee', borderRadius: '12px',
    padding: '24px', marginBottom: '20px',
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', gap: '20px'
  },
  permitInfo: { flex: 1 },
  infoRow: {
    display: 'flex', justifyContent: 'space-between',
    padding: '8px 0', borderBottom: '1px solid #f5f5f5'
  },
  label: { color: '#666', fontSize: '14px' },
  value: { color: '#333', fontSize: '14px', fontWeight: 'bold' },
  approvedBadge: {
    backgroundColor: '#28a745', color: 'white',
    padding: '3px 10px', borderRadius: '12px', fontSize: '12px'
  },
  qrSection: { textAlign: 'center' },
  qrImage: {
    width: '160px', height: '160px',
    border: '2px solid #eee', borderRadius: '8px', padding: '8px'
  },
  qrNote: {
    color: '#999', fontSize: '11px',
    marginTop: '8px', maxWidth: '160px'
  },
};

export default MyQRCode;