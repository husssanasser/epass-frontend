import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { permitAPI } from '../../services/api';

const SubmitPermit = () => {
  const [permitType, setPermitType] = useState('');
  const [purpose, setPurpose] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [destination, setDestination] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!permitType) { setError('Please select a permit type'); return; }
    if (!purpose || purpose.trim().length < 5) { setError('Purpose must be at least 5 characters'); return; }
    if (!startDate) { setError('Please select a start date'); return; }
    if (!endDate) { setError('Please select an end date'); return; }
    if (!destination) { setError('Please enter a destination'); return; }
    if (endDate < startDate) { setError('End date must be after start date'); return; }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await permitAPI.submit({
        permitType, purpose, startDate, endDate, destination, documentUrl: ''
      });
      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'APPROVED') return '#28a745';
    if (status === 'REJECTED') return '#dc3545';
    return '#ffc107';
  };

  const getStatusMessage = (status: string) => {
    if (status === 'APPROVED') return '✅ Your permit has been automatically APPROVED! You can download it now.';
    if (status === 'REJECTED') return '❌ Your permit has been automatically REJECTED.';
    return '⏳ Your permit is under review by our admin team. You will be notified soon.';
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Submit Permit Request</h2>

        {error && <div style={styles.error}>{error}</div>}

        {result && (
          <div style={{
            ...styles.resultBox,
            backgroundColor: getStatusColor(result.status) + '20',
            borderColor: getStatusColor(result.status),
          }}>
            <p style={{ color: getStatusColor(result.status), fontWeight: 'bold', margin: 0 }}>
              {getStatusMessage(result.status)}
            </p>
            <p style={{ color: '#666', fontSize: '13px', margin: '8px 0 0 0' }}>
              Request ID: #{result.requestId}
            </p>
            {result.status === 'APPROVED' && (
              <button style={styles.downloadBtn} onClick={() => navigate('/user/permits')}>
                Download Permit →
              </button>
            )}
            {result.status === 'PENDING' && (
              <button style={styles.trackBtn} onClick={() => navigate('/user/track')}>
                Track Status →
              </button>
            )}
          </div>
        )}

        {!result && (
          <>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Permit Type</label>
              <select style={styles.input} value={permitType} onChange={e => setPermitType(e.target.value)}>
                <option value="">Select Type</option>
                <option value="Work Permit">Work Permit</option>
                <option value="Health Permit">Health Permit</option>
                <option value="Movement Permit">Movement Permit</option>
                <option value="Emergency Permit">Emergency Permit</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Purpose</label>
              <textarea
                style={{ ...styles.input, height: '80px' }}
                placeholder="Describe the purpose of your permit request..."
                value={purpose}
                onChange={e => setPurpose(e.target.value)}
              />
            </div>

            <div style={styles.row}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Start Date</label>
                <input
                  style={styles.input}
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>End Date</label>
                <input
                  style={styles.input}
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Destination</label>
              <input
                style={styles.input}
                placeholder="Enter destination"
                value={destination}
                onChange={e => setDestination(e.target.value)}
              />
            </div>

            <div style={styles.infoBox}>
              <p style={styles.infoTitle}>How it works:</p>
              <p style={styles.info}>Emergency Permit → Auto Approved ✅</p>
              <p style={styles.info}>Health Permit → Auto Approved ✅</p>
              <p style={styles.info}>Work Permit → Admin Review ⏳</p>
              <p style={styles.info}>Movement Permit → Admin Review ⏳</p>
            </div>

            <div style={styles.buttons}>
              <button style={styles.cancelBtn} onClick={() => navigate('/user/dashboard')}>
                Cancel
              </button>
              <button style={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
                {loading ? 'Evaluating...' : 'Submit'}
              </button>
            </div>
          </>
        )}

        {result && (
          <button
            style={{ ...styles.cancelBtn, marginTop: '12px', width: '100%' }}
            onClick={() => navigate('/user/dashboard')}
          >
            Back to Dashboard
          </button>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh', backgroundColor: '#003580',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  card: {
    backgroundColor: 'white', borderRadius: '12px',
    padding: '40px', width: '500px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
  },
  title: {
    color: '#003580', fontSize: '22px',
    fontWeight: 'bold', marginBottom: '20px'
  },
  inputGroup: { marginBottom: '16px' },
  row: { display: 'flex', gap: '16px', marginBottom: '16px' },
  label: {
    display: 'block', color: '#333',
    fontWeight: 'bold', marginBottom: '6px', fontSize: '14px'
  },
  input: {
    width: '100%', padding: '10px', borderRadius: '6px',
    border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box'
  },
  buttons: { display: 'flex', gap: '12px', marginTop: '20px' },
  cancelBtn: {
    flex: 1, padding: '12px', backgroundColor: '#ccc',
    color: '#333', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontSize: '15px'
  },
  submitBtn: {
    flex: 1, padding: '12px', backgroundColor: '#003580',
    color: 'white', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontSize: '15px'
  },
  error: {
    backgroundColor: '#ffe0e0', color: 'red',
    padding: '10px', borderRadius: '6px', marginBottom: '16px'
  },
  resultBox: {
    padding: '16px', borderRadius: '8px',
    border: '2px solid', marginBottom: '20px'
  },
  downloadBtn: {
    marginTop: '10px', padding: '8px 16px',
    backgroundColor: '#28a745', color: 'white',
    border: 'none', borderRadius: '6px',
    cursor: 'pointer', fontSize: '14px'
  },
  trackBtn: {
    marginTop: '10px', padding: '8px 16px',
    backgroundColor: '#ffc107', color: 'white',
    border: 'none', borderRadius: '6px',
    cursor: 'pointer', fontSize: '14px'
  },
  infoBox: {
    backgroundColor: '#f0f4ff', padding: '12px',
    borderRadius: '8px', marginBottom: '16px'
  },
  infoTitle: {
    fontWeight: 'bold', color: '#003580',
    margin: '0 0 8px 0', fontSize: '14px'
  },
  info: { color: '#555', fontSize: '12px', margin: '4px 0' },
};

export default SubmitPermit;