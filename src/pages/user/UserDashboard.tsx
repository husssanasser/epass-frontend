import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { permitAPI } from '../../services/api';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    unreadNotifications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [requestsRes, notifRes] = await Promise.all([
          permitAPI.getMyRequests(),
          permitAPI.getNotifications(),
        ]);
        const requests = requestsRes.data;
        const notifications = notifRes.data;
        setStats({
          pending: requests.filter((r: any) => r.status === 'PENDING').length,
          approved: requests.filter((r: any) => r.status === 'APPROVED').length,
          rejected: requests.filter((r: any) => r.status === 'REJECTED').length,
          unreadNotifications: notifications.filter((n: any) => !n.isRead).length,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <img
          src="/logo.png"
          alt="E-Pass"
          style={{
            
  width: '120px', height: '120px',
  objectFit: 'cover',
  display: 'block',
  margin: '0 auto 20px auto',
  borderRadius: '50%',
  border: '3px solid white',
  backgroundColor: 'white'
}}
          
        />
        <button style={styles.sideBtn} onClick={() => navigate('/user/submit')}>
          Submit Permit
        </button>
        <button style={styles.sideBtn} onClick={() => navigate('/user/track')}>
          Track Status
        </button>
        <button style={styles.sideBtn} onClick={() => navigate('/user/permits')}>
          Download Permit
        </button>
        <button style={styles.sideBtn} onClick={() => navigate('/user/notifications')}>
          Notifications
        </button>
        <button style={styles.sideBtn} onClick={() => navigate('/user/qrcode')}>
  QR Code
</button>
   
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.welcome}>Welcome, {user?.fullName}</h1>
          <p style={styles.subtitle}>Permit Management System</p>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div style={styles.cards}>
              <div style={{ ...styles.card, borderTop: '4px solid #ffc107' }}>
                <h3 style={{ ...styles.cardNumber, color: '#ffc107' }}>{stats.pending}</h3>
                <p style={styles.cardTitle}>Pending Requests</p>
                <p style={styles.cardDesc}>Waiting for admin review</p>
                <button
                  style={{ ...styles.cardBtn, backgroundColor: '#ffc107' }}
                  onClick={() => navigate('/user/track')}
                >
                  View
                </button>
              </div>

              <div style={{ ...styles.card, borderTop: '4px solid #28a745' }}>
                <h3 style={{ ...styles.cardNumber, color: '#28a745' }}>{stats.approved}</h3>
                <p style={styles.cardTitle}>Approved Permits</p>
                <p style={styles.cardDesc}>Ready to download</p>
                <button
                  style={{ ...styles.cardBtn, backgroundColor: '#28a745' }}
                  onClick={() => navigate('/user/permits')}
                >
                  Download
                </button>
              </div>

              <div style={{ ...styles.card, borderTop: '4px solid #dc3545' }}>
                <h3 style={{ ...styles.cardNumber, color: '#dc3545' }}>{stats.rejected}</h3>
                <p style={styles.cardTitle}>Rejected Requests</p>
                <p style={styles.cardDesc}>Did not meet requirements</p>
                <button
                  style={{ ...styles.cardBtn, backgroundColor: '#dc3545' }}
                  onClick={() => navigate('/user/track')}
                >
                  View
                </button>
              </div>

          
            </div>

            <div style={styles.quickActions}>
              <h3 style={styles.quickTitle}>Quick Actions</h3>
              <div style={styles.actionButtons}>
                <button style={styles.actionBtn} onClick={() => navigate('/user/submit')}>
                  New Permit Request
                </button>
                <button style={styles.actionBtn} onClick={() => navigate('/user/track')}>
                  Track My Requests
                </button>
                <button style={styles.actionBtn} onClick={() => navigate('/user/permits')}>
                  Download Permits
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { display: 'flex', minHeight: '100vh' },
  sidebar: {
    width: '200px', backgroundColor: '#003580', padding: '20px',
    display: 'flex', flexDirection: 'column', gap: '10px'
  },
  sideBtn: {
    padding: '10px', backgroundColor: '#0052cc', color: 'white',
    border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px',
    textAlign: 'left'
  },
  logoutBtn: {
    padding: '10px', backgroundColor: '#cc0000', color: 'white',
    border: 'none', borderRadius: '6px', cursor: 'pointer',
    fontSize: '13px', marginTop: 'auto'
  },
  main: { flex: 1, padding: '40px', backgroundColor: '#f5f5f5' },
  header: { marginBottom: '30px' },
  welcome: { color: '#003580', fontSize: '28px', margin: 0 },
  subtitle: { color: '#666', margin: '4px 0 0 0' },
  cards: { display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' },
  card: {
    backgroundColor: 'white', borderRadius: '12px', padding: '24px',
    width: '180px', textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  cardNumber: { fontSize: '36px', fontWeight: 'bold', margin: '0 0 4px 0' },
  cardTitle: { color: '#333', fontSize: '14px', fontWeight: 'bold', margin: '0 0 4px 0' },
  cardDesc: { color: '#999', fontSize: '12px', margin: '0 0 12px 0' },
  cardBtn: {
    padding: '6px 12px', color: 'white', border: 'none',
    borderRadius: '6px', cursor: 'pointer', fontSize: '12px', width: '100%'
  },
  quickActions: {
    backgroundColor: 'white', borderRadius: '12px',
    padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  quickTitle: { color: '#003580', fontSize: '18px', marginBottom: '16px' },
  actionButtons: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  actionBtn: {
    padding: '12px 20px', backgroundColor: '#003580', color: 'white',
    border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px'
  },
};

export default UserDashboard;