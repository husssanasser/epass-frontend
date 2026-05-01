import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { PermitRequest } from '../../types';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const [requests, setRequests] = useState<PermitRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
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
    try {
      await adminAPI.approveRequest(id);
      fetchRequests();
      alert('Permit Approved Successfully!');
    } catch (err) {
      alert('Error approving permit');
    }
  };

  const handleReject = async (id: number) => {
    try {
      await adminAPI.rejectRequest(id);
      fetchRequests();
      alert('Permit Rejected');
    } catch (err) {
      alert('Error rejecting permit');
    }
  };

  const filtered = requests.filter(r =>
    r.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    r.permitType?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    if (status === 'APPROVED') return '#28a745';
    if (status === 'REJECTED') return '#dc3545';
    return '#ffc107';
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>E-PASS</h2>
        <button style={styles.sideBtn} onClick={() => navigate('/admin/dashboard')}>Admin Review</button>
        <button style={styles.sideBtn} onClick={() => navigate('/verify')}>QR Verify</button>
        <button style={styles.logoutBtn} onClick={() => { logout(); navigate('/login'); }}>Logout</button>
      </div>

      <div style={styles.main}>
        <h2 style={styles.title}>Admin Dashboard</h2>

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
                <th style={styles.th}>Request ID</th>
                <th style={styles.th}>Applicant Name</th>
                <th style={styles.th}>Permit Type</th>
                <th style={styles.th}>Submission Date</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(req => (
                <tr key={req.id} style={styles.tableRow}>
                  <td style={styles.td}>{req.id}</td>
                  <td style={styles.td}>{req.user?.fullName}</td>
                  <td style={styles.td}>{req.permitType}</td>
                  <td style={styles.td}>{req.submittedAt?.split('T')[0]}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, backgroundColor: getStatusColor(req.status) }}>
                      {req.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {req.status === 'PENDING' && (
                      <>
                        <button style={styles.approveBtn} onClick={() => handleApprove(req.id)}>Approve</button>
                        <button style={styles.rejectBtn} onClick={() => handleReject(req.id)}>Reject</button>
                      </>
                    )}
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
  container: { display: 'flex', minHeight: '100vh' },
  sidebar: { width: '200px', backgroundColor: '#003580', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' },
  logo: { color: 'white', textAlign: 'center', marginBottom: '20px' },
  sideBtn: { padding: '10px', backgroundColor: '#0052cc', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  logoutBtn: { padding: '10px', backgroundColor: '#cc0000', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', marginTop: 'auto' },
  main: { flex: 1, padding: '40px', backgroundColor: '#f5f5f5' },
  title: { color: '#003580', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' },
  search: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '20px', fontSize: '14px', boxSizing: 'border-box' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden' },
  tableHeader: { backgroundColor: '#003580' },
  th: { padding: '12px', textAlign: 'left', color: 'white', fontSize: '14px' },
  tableRow: { borderBottom: '1px solid #eee' },
  td: { padding: '12px', color: '#333', fontSize: '14px' },
  badge: { padding: '4px 10px', borderRadius: '12px', color: 'white', fontSize: '12px', fontWeight: 'bold' },
  approveBtn: { padding: '6px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '6px', fontSize: '12px' },
  rejectBtn: { padding: '6px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
};

export default AdminDashboard;