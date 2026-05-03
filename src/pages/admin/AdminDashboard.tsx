import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { PermitRequest } from '../../types';
import { useAuth } from '../../context/AuthContext';

type Tab = 'PENDING' | 'APPROVED' | 'REJECTED';

const AdminDashboard = () => {
  const [requests, setRequests] = useState<PermitRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('PENDING');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getAllRequests();
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    setActionLoading(id);
    try {
      await adminAPI.approveRequest(id);
      await fetchRequests();
    } catch (err) {
      alert('Error approving permit');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: number) => {
    setActionLoading(id);
    try {
      await adminAPI.rejectRequest(id);
      await fetchRequests();
    } catch (err) {
      alert('Error rejecting permit');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = requests
    .filter(r => r.status === activeTab)
    .filter(r =>
      r.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      r.permitType?.toLowerCase().includes(search.toLowerCase())
    );

  const countByStatus = (status: Tab) => requests.filter(r => r.status === status).length;

  const getStatusColor = (status: string) => {
    if (status === 'APPROVED') return '#28a745';
    if (status === 'REJECTED') return '#dc3545';
    return '#ffc107';
  };

  const openAttachment = (url: string) => {
    if (url.startsWith('http://localhost')) {
      alert('This file was uploaded locally and cannot be viewed on the deployed version. Please re-upload.');
      return;
    }
    window.open(url, '_blank');
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>E-PASS</h2>
        <button style={styles.sideBtn} onClick={() => navigate('/admin/dashboard')}>Admin Review</button>
        <button style={styles.logoutBtn} onClick={() => { logout(); navigate('/login'); }}>Logout</button>
      </div>

      <div style={styles.main}>
        <h2 style={styles.title}>Admin Dashboard</h2>

        <div style={styles.tabs}>
          {(['PENDING', 'APPROVED', 'REJECTED'] as Tab[]).map(tab => (
            <button
              key={tab}
              style={{
                ...styles.tab,
                backgroundColor: activeTab === tab ? (
                  tab === 'PENDING' ? '#ffc107' :
                  tab === 'APPROVED' ? '#28a745' : '#dc3545'
                ) : '#e0e0e0',
                color: activeTab === tab ? 'white' : '#333',
              }}
              onClick={() => setActiveTab(tab)}
            >
              {tab} ({countByStatus(tab)})
            </button>
          ))}
        </div>

        <input
          style={styles.search}
          placeholder="Search by name or permit type..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {loading ? <p>Loading...</p> : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Applicant</th>
                <th style={styles.th}>Permit Type</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Attachment</th>
                <th style={styles.th}>Status</th>
                {activeTab === 'PENDING' && <th style={styles.th}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ ...styles.td, textAlign: 'center', color: '#999' }}>
                    No {activeTab.toLowerCase()} requests
                  </td>
                </tr>
              ) : (
                filtered.map(req => (
                  <tr key={req.id} style={styles.tableRow}>
                    <td style={styles.td}>#{req.id}</td>
                    <td style={styles.td}>{req.user?.fullName}</td>
                    <td style={styles.td}>{req.permitType}</td>
                    <td style={styles.td}>{req.submittedAt?.split('T')[0]}</td>
                    <td style={styles.td}>
                      {req.documentUrl
                        ? <button onClick={() => openAttachment(req.documentUrl!)} style={styles.attachmentBtn}>View File</button>
                        : <span style={{ color: '#999', fontSize: '12px' }}>No attachment</span>
                      }
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, backgroundColor: getStatusColor(req.status) }}>
                        {req.status}
                      </span>
                    </td>
                    {activeTab === 'PENDING' && (
                      <td style={styles.td}>
                        <button
                          style={styles.approveBtn}
                          onClick={() => handleApprove(req.id)}
                          disabled={actionLoading === req.id}
                        >
                          {actionLoading === req.id ? '...' : 'Approve'}
                        </button>
                        <button
                          style={styles.rejectBtn}
                          onClick={() => handleReject(req.id)}
                          disabled={actionLoading === req.id}
                        >
                          {actionLoading === req.id ? '...' : 'Reject'}
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
  logo: { color: 'white', textAlign: 'center', marginBottom: '20px' },
  sideBtn: {
    padding: '10px', backgroundColor: '#0052cc', color: 'white',
    border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px'
  },
  logoutBtn: {
    padding: '10px', backgroundColor: '#cc0000', color: 'white',
    border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', marginTop: 'auto'
  },
  main: { flex: 1, padding: '40px', backgroundColor: '#f5f5f5' },
  title: { color: '#003580', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' },
  tabs: { display: 'flex', gap: '12px', marginBottom: '20px' },
  tab: {
    padding: '10px 20px', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontSize: '14px', fontWeight: 'bold'
  },
  search: {
    width: '100%', padding: '10px', borderRadius: '6px',
    border: '1px solid #ccc', marginBottom: '20px',
    fontSize: '14px', boxSizing: 'border-box'
  },
  table: {
    width: '100%', borderCollapse: 'collapse',
    backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden'
  },
  tableHeader: { backgroundColor: '#003580' },
  th: { padding: '12px', textAlign: 'left', color: 'white', fontSize: '14px' },
  tableRow: { borderBottom: '1px solid #eee' },
  td: { padding: '12px', color: '#333', fontSize: '14px' },
  badge: {
    padding: '4px 10px', borderRadius: '12px',
    color: 'white', fontSize: '12px', fontWeight: 'bold'
  },
  approveBtn: {
    padding: '6px 12px', backgroundColor: '#28a745', color: 'white',
    border: 'none', borderRadius: '4px', cursor: 'pointer',
    marginRight: '6px', fontSize: '12px'
  },
  rejectBtn: {
    padding: '6px 12px', backgroundColor: '#dc3545', color: 'white',
    border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px'
  },
  attachmentBtn: {
    padding: '4px 10px', backgroundColor: '#003580', color: 'white',
    border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px'
  },
};

export default AdminDashboard;