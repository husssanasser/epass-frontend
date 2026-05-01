import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { permitAPI } from '../../services/api';
import { PermitRequest } from '../../types';

const TrackStatus = () => {
  const [requests, setRequests] = useState<PermitRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await permitAPI.getMyRequests();
        setRequests(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const getStatusColor = (status: string) => {
    if (status === 'APPROVED') return '#28a745';
    if (status === 'REJECTED') return '#dc3545';
    return '#ffc107';
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate('/user/dashboard')}>← Back</button>
          <h2 style={styles.title}>Track Status</h2>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : requests.length === 0 ? (
          <p style={styles.empty}>No active requests found.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Request ID</th>
                <th style={styles.th}>Permit Type</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id} style={styles.tableRow}>
                  <td style={styles.td}>{req.id}</td>
                  <td style={styles.td}>{req.permitType}</td>
                  <td style={styles.td}>{req.submittedAt?.split('T')[0]}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, backgroundColor: getStatusColor(req.status) }}>
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { backgroundColor: '#003580', color: 'white' },
  th: { padding: '12px', textAlign: 'left', color: 'white' },
  tableRow: { borderBottom: '1px solid #eee' },
  td: { padding: '12px', color: '#333' },
  badge: { padding: '4px 10px', borderRadius: '12px', color: 'white', fontSize: '12px', fontWeight: 'bold' },
};

export default TrackStatus;