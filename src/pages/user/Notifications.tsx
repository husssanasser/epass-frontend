import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { permitAPI } from '../../services/api';
import { Notification } from '../../types';

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await permitAPI.getNotifications();
        setNotifications(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const getIcon = (message: string) => {
    if (message.includes('APPROVED') || message.includes('✅')) return '✅';
    if (message.includes('REJECTED') || message.includes('❌')) return '❌';
    return '⏳';
  };

  const getColor = (message: string) => {
    if (message.includes('APPROVED') || message.includes('✅')) return '#e8f5e9';
    if (message.includes('REJECTED') || message.includes('❌')) return '#fce4ec';
    return '#fff8e1';
  };

  const getBorderColor = (message: string) => {
    if (message.includes('APPROVED') || message.includes('✅')) return '#28a745';
    if (message.includes('REJECTED') || message.includes('❌')) return '#dc3545';
    return '#ffc107';
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate('/user/dashboard')}>
            ← Back
          </button>
          <h2 style={styles.title}>Notifications</h2>
        </div>

        {loading ? (
          <p style={styles.empty}>Loading...</p>
        ) : notifications.length === 0 ? (
          <div style={styles.emptyBox}>
            <p style={styles.emptyIcon}>🔔</p>
            <p style={styles.empty}>No notifications yet.</p>
          </div>
        ) : (
          <div>
            <p style={styles.count}>
              You have <strong>{notifications.length}</strong> notification(s)
            </p>
            {notifications.slice().reverse().map(n => (
              <div key={n.id} style={{
                ...styles.notifCard,
                backgroundColor: getColor(n.message),
                borderLeft: `4px solid ${getBorderColor(n.message)}`
              }}>
                <div style={styles.notifHeader}>
                  <span style={styles.notifIcon}>{getIcon(n.message)}</span>
                  <span style={styles.notifDate}>
                    {n.createdAt?.split('T')[0]}
                  </span>
                </div>
                <p style={styles.notifMessage}>{n.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh', backgroundColor: '#003580',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '20px'
  },
  card: {
    backgroundColor: 'white', borderRadius: '12px',
    padding: '40px', width: '650px',
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
  title: {
    color: '#003580', fontSize: '22px', fontWeight: 'bold'
  },
  count: {
    color: '#666', fontSize: '14px', marginBottom: '16px'
  },
  emptyBox: {
    textAlign: 'center', padding: '40px'
  },
  emptyIcon: {
    fontSize: '48px', margin: '0 0 12px 0'
  },
  empty: {
    textAlign: 'center', color: '#666', fontSize: '16px'
  },
  notifCard: {
    borderRadius: '8px', padding: '16px',
    marginBottom: '12px'
  },
  notifHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '8px'
  },
  notifIcon: { fontSize: '20px' },
  notifDate: { color: '#999', fontSize: '12px' },
  notifMessage: {
    color: '#333', fontSize: '14px',
    margin: 0, lineHeight: '1.5'
  },
};

export default Notifications;