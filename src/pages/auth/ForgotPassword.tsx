import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async () => {
    setLoading(true);
    setError('');
    try {
      await authAPI.resetPassword(email, newPassword);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>E-PASS</h1>
          <p style={styles.subtitle}>Permit Management System</p>
        </div>

        <h2 style={styles.formTitle}>Forget Password</h2>

        {error && <div style={styles.error}>{error}</div>}

        {success ? (
          <div style={styles.success}>
            <p>✅ Password Reset Successfully!</p>
            <p>Redirecting to login...</p>
          </div>
        ) : (
          <>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                style={styles.input}
                type="email"
                placeholder="ex: name@hotmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>New Password</label>
              <input
                style={styles.input}
                type="password"
                placeholder="Enter Password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>

            <button
              style={styles.button}
              onClick={handleReset}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Reset Password'}
            </button>
          </>
        )}

        <p style={styles.loginText}>
          <Link to="/login" style={styles.link}>Back to Login</Link>
        </p>
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
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '40px',
    width: '400px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  },
  header: { textAlign: 'center', marginBottom: '24px' },
  title: { color: '#003580', fontSize: '28px', fontWeight: 'bold', margin: 0 },
  subtitle: { color: '#666', fontSize: '14px', margin: '4px 0 0 0' },
  formTitle: { color: '#003580', fontSize: '22px', fontWeight: 'bold', marginBottom: '20px' },
  inputGroup: { marginBottom: '16px' },
  label: { display: 'block', color: '#333', fontWeight: 'bold', marginBottom: '6px', fontSize: '14px' },
  input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', backgroundColor: '#003580', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '16px' },
  error: { backgroundColor: '#ffe0e0', color: 'red', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' },
  success: { backgroundColor: '#e0ffe0', color: 'green', padding: '20px', borderRadius: '6px', marginBottom: '16px', textAlign: 'center' },
  loginText: { textAlign: 'center', fontSize: '14px', color: '#666' },
  link: { color: '#003580', fontWeight: 'bold', textDecoration: 'none' },
};

export default ForgotPassword;