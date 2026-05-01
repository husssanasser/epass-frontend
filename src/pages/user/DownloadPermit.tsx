import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { permitAPI } from '../../services/api';
import { Permit } from '../../types';

const DownloadPermit = () => {
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

  const handleDownload = async (permitId: number) => {
    try {
      const res = await permitAPI.downloadPermit(permitId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `epass-permit-${permitId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate('/user/dashboard')}>← Back</button>
          <h2 style={styles.title}>Download Approved Permit</h2>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : permits.length === 0 ? (
          <p style={styles.empty}>No approved permits found.</p>
        ) : (
          permits.map(permit => (
            <div key={permit.id} style={styles.permitCard}>
              <div style={styles.permitInfo}>
                <p><strong>Permit ID:</strong> {permit.id}</p>
                <p><strong>Full Name:</strong> {permit.user?.fullName}</p>
                <p><strong>Permit Type:</strong> {permit.permitRequest?.permitType}</p>
                <p><strong>Purpose:</strong> {permit.permitRequest?.purpose}</p>
                <p><strong>Dates:</strong> {permit.permitRequest?.startDate} → {permit.permitRequest?.endDate}</p>
                <p><strong>Destination:</strong> {permit.permitRequest?.destination}</p>
              </div>
              <button style={styles.downloadBtn} onClick={() => handleDownload(permit.id)}>
                ⬇️ Download
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { minHeight: '100vh', backgroundColor: '#003580', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: 'white', borderRadius: '12px', padding: '40px', width: '700px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  backBtn: { padding: '8px 16px', backgroundColor: '#003580', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  title: { color: '#003580', fontSize: '22px', fontWeight: 'bold' },
  empty: { textAlign: 'center', color: '#666' },
  permitCard: { border: '1px solid #eee', borderRadius: '8px', padding: '20px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  permitInfo: { fontSize: '14px', color: '#333' },
  downloadBtn: { padding: '10px 20px', backgroundColor: '#003580', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' },
};

export default DownloadPermit;