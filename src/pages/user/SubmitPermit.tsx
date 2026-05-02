import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { permitAPI, uploadAPI } from '../../services/api';

const SubmitPermit = () => {
  const [permitType, setPermitType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [destination, setDestination] = useState('');
  const [requestTime, setRequestTime] = useState('');
  const [durationHours, setDurationHours] = useState('');
  const [caseType, setCaseType] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [reason, setReason] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadAPI.uploadFile(file);
      setDocumentUrl(res.data.url);
    } catch (err) {
      setError('File upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!permitType) { setError('Please select a permit type'); return; }
    if (!startDate) { setError('Please enter start date (YYYY-MM-DD)'); return; }
    if (!requestTime) { setError('Please enter request time'); return; }
    if (!destination) { setError('Please enter destination'); return; }
    if (permitType === 'Health' && !caseType) { setError('Please select case type'); return; }
    if (permitType === 'Health' && caseType === 'appointment' && !documentUrl) {
      setError('Please upload an attachment for appointment'); return;
    }
    if (permitType === 'Education' && !documentUrl) {
      setError('Please upload exam notice'); return;
    }
    if (permitType === 'Travel' && !documentUrl) {
      setError('Please upload ticket or booking'); return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await permitAPI.submit({
        permitType,
        purpose: reason,
        startDate,
        endDate: endDate || startDate,
        destination,
        requestTime,
        durationHours: durationHours ? parseInt(durationHours) : null,
        caseType,
        institutionName,
        reason,
        documentUrl,
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
    if (status === 'APPROVED') return 'Your permit has been automatically APPROVED.';
    if (status === 'REJECTED') return 'Your permit has been REJECTED. Please check the requirements.';
    return 'Your permit is under admin review. You will be notified soon.';
  };

  const getRules = () => {
    switch (permitType) {
      case 'Work':
        return 'Up to 8 hours with a valid reason — Auto Approved';
      case 'Health':
        if (caseType === 'emergency') return 'Destination must include: Hospital / Emergency / مستشفى / طوارئ — Auto Approved';
        if (caseType === 'appointment') return 'Attachment required — Sent to Admin Review';
        return 'Select case type to see requirements';
      case 'Education':
        return 'Exam notice attachment required — Sent to Admin Review';
      case 'Essential Needs':
        return 'First request this week — Auto Approved. Second request — Admin Review';
      case 'Travel':
        return 'Travel ticket or booking attachment required — Sent to Admin Review';
      default:
        return '';
    }
  };

  const FileUploadField = ({ label }: { label: string }) => (
    <div style={styles.inputGroup}>
      <label style={styles.label}>{label}</label>
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        style={{ display: 'none' }}
        id="fileUpload"
        onChange={handleFileUpload}
      />
      <label
        htmlFor="fileUpload"
        style={{
          ...styles.uploadBtn,
          backgroundColor: documentUrl ? '#e8f5e9' : '#f8f9ff',
          borderColor: documentUrl ? '#28a745' : '#003580',
          color: documentUrl ? '#28a745' : '#003580',
        }}
      >
        {uploading ? 'Uploading...' : documentUrl ? 'File Uploaded' : 'Click to Upload File'}
      </label>
      {documentUrl && (
        <p style={styles.uploadedText}>File is ready to submit</p>
      )}
    </div>
  );

  const renderExtraFields = () => {
    switch (permitType) {

      case 'Work':
        return (
          <>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Duration (Hours)</label>
              <input
                style={styles.input}
                type="number"
                placeholder="e.g. 6"
                min="1"
                max="12"
                value={durationHours}
                onChange={e => setDurationHours(e.target.value)}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Reason</label>
              <input
                style={styles.input}
                placeholder="e.g. Daily Shift / Work Task"
                value={reason}
                onChange={e => setReason(e.target.value)}
              />
            </div>
          </>
        );

      case 'Health':
        return (
          <>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Case Type</label>
              <div style={styles.typeButtons}>
                <button
                  type="button"
                  style={{
                    ...styles.typeBtn,
                    ...(caseType === 'emergency' ? styles.typeBtnActive : {})
                  }}
                  onClick={() => { setCaseType('emergency'); setDocumentUrl(''); }}
                >
                  Emergency
                </button>
                <button
                  type="button"
                  style={{
                    ...styles.typeBtn,
                    ...(caseType === 'appointment' ? styles.typeBtnActive : {})
                  }}
                  onClick={() => { setCaseType('appointment'); setDocumentUrl(''); }}
                >
                  Appointment
                </button>
              </div>
            </div>

            {caseType === 'emergency' && (
              <div style={styles.infoBox}>
                <p style={styles.infoText}>
                  Destination must include: Hospital / Emergency / مستشفى / طوارئ
                </p>
              </div>
            )}

            {caseType === 'appointment' && (
              <FileUploadField label="Attachment — Booking or Report (Required)" />
            )}
          </>
        );

      case 'Education':
        return (
          <>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Institution Name</label>
              <input
                style={styles.input}
                placeholder="School or University name"
                value={institutionName}
                onChange={e => setInstitutionName(e.target.value)}
              />
            </div>
            <FileUploadField label="Attachment — Exam Notice (Required)" />
          </>
        );

      case 'Essential Needs':
        return (
          <div style={styles.inputGroup}>
            <label style={styles.label}>Reason</label>
            <input
              style={styles.input}
              placeholder="e.g. Grocery / Pharmacy"
              value={reason}
              onChange={e => setReason(e.target.value)}
            />
          </div>
        );

      case 'Travel':
        return (
          <>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Reason for Travel</label>
              <input
                style={styles.input}
                placeholder="Brief reason"
                value={reason}
                onChange={e => setReason(e.target.value)}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>End Date (YYYY-MM-DD)</label>
              <input
                style={styles.input}
                type="text"
                placeholder="e.g. 2026-05-20"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>
            <FileUploadField label="Attachment — Ticket or Booking (Required)" />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Submit Permit Request</h2>

        {error && <div style={styles.error}>{error}</div>}

        {result && (
          <div style={{
            ...styles.resultBox,
            backgroundColor: getStatusColor(result.status) + '15',
            borderColor: getStatusColor(result.status),
          }}>
            <p style={{ color: getStatusColor(result.status), fontWeight: 'bold', margin: 0, fontSize: '15px' }}>
              {getStatusMessage(result.status)}
            </p>
            <p style={{ color: '#666', fontSize: '13px', margin: '8px 0 0 0' }}>
              Request ID: #{result.requestId}
            </p>
            {result.status === 'APPROVED' && (
              <button style={styles.actionBtn as React.CSSProperties} onClick={() => navigate('/user/permits')}>
                Download Permit
              </button>
            )}
            {result.status === 'PENDING' && (
              <button style={{ ...styles.actionBtn as React.CSSProperties, backgroundColor: '#ffc107' }} onClick={() => navigate('/user/track')}>
                Track Status
              </button>
            )}
            <button
              style={{ ...styles.cancelBtn, marginTop: '12px', width: '100%' }}
              onClick={() => navigate('/user/dashboard')}
            >
              Back to Dashboard
            </button>
          </div>
        )}

        {!result && (
          <>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Permit Type</label>
              <select
                style={styles.input}
                value={permitType}
                onChange={e => {
                  setPermitType(e.target.value);
                  setCaseType('');
                  setDocumentUrl('');
                  setReason('');
                  setDurationHours('');
                }}
              >
                <option value="">Select Type</option>
                <option value="Work">Work</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Essential Needs">Essential Needs</option>
                <option value="Travel">Travel</option>
              </select>
            </div>

            {permitType && (
              <div style={styles.infoBox}>
                <p style={styles.infoText}>{getRules()}</p>
              </div>
            )}

            <div style={styles.row}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Start Date (YYYY-MM-DD)</label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="e.g. 2026-05-15"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Request Time</label>
                <input
                  style={styles.input}
                  type="time"
                  value={requestTime}
                  onChange={e => setRequestTime(e.target.value)}
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

            {renderExtraFields()}

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
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#003580',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '40px',
    width: '520px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
  },
  title: {
    color: '#003580',
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '20px'
  },
  inputGroup: { marginBottom: '16px' },
  row: { display: 'flex', gap: '16px', marginBottom: '16px' },
  label: {
    display: 'block',
    color: '#333',
    fontWeight: 'bold',
    marginBottom: '6px',
    fontSize: '14px'
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  typeButtons: {
    display: 'flex',
    gap: '12px',
  },
  typeBtn: {
    flex: 1,
    padding: '10px',
    borderRadius: '6px',
    border: '2px solid #ccc',
    backgroundColor: 'white',
    color: '#666',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  typeBtnActive: {
    border: '2px solid #003580',
    backgroundColor: '#003580',
    color: 'white',
  },
  uploadBtn: {
    display: 'block',
    padding: '12px',
    border: '2px dashed',
    borderRadius: '6px',
    textAlign: 'center',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    width: '100%',
    boxSizing: 'border-box',
  },
  uploadedText: {
    color: '#28a745',
    fontSize: '12px',
    margin: '6px 0 0 0'
  },
  buttons: { display: 'flex', gap: '12px', marginTop: '20px' },
  cancelBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#f0f0f0',
    color: '#333',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px'
  },
  submitBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#003580',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px'
  },
  error: {
    backgroundColor: '#ffe0e0',
    color: '#cc0000',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '16px',
    fontSize: '14px'
  },
  resultBox: {
    padding: '20px',
    borderRadius: '8px',
    border: '2px solid',
    marginBottom: '20px'
  },
  actionBtn: {
    marginTop: '12px',
    padding: '10px 16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'block',
    width: '100%',
    boxSizing: 'border-box',
  },
  infoBox: {
    backgroundColor: '#f0f4ff',
    padding: '10px 14px',
    borderRadius: '8px',
    marginBottom: '16px',
    borderLeft: '3px solid #003580'
  },
  infoText: {
    color: '#003580',
    fontSize: '13px',
    margin: 0
  },
};

export default SubmitPermit;