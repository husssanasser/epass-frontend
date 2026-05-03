import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email: string) => {
    const allowedDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    return allowedDomains.includes(domain);
  };

  const handleRegister = async () => {
    if (!fullName.trim()) { setError('Please enter your full name'); return; }
    if (!isValidEmail(email)) {
      setError('Please use a valid email (Gmail, Hotmail, Outlook, Yahoo, or iCloud)');
      return;
    }
    if (!password || password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (!dateOfBirth) { setError('Please enter your date of birth'); return; }

    setLoading(true);
    setError('');
    try {
      await authAPI.register({ fullName, email, password, dateOfBirth });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
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

        <h2 style={styles.formTitle}>Create Account</h2>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.inputGroup}>
          <label style={styles.label}>Full Name</label>
          <input
            style={styles.input}
            placeholder="Enter Name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            placeholder="ex: name@gmail.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Date of Birth (YYYY-MM-DD)</label>
          <input
            style={styles.input}
            type="text"
            placeholder="e.g. 1999-05-15"
            value={dateOfBirth}
            onChange={e => setDateOfBirth(e.target.value)}
          />
        </div>

        <button style={styles.button} onClick={handleRegister} disabled={loading}>
          {loading ? 'Loading...' : 'Register'}
        </button>

        <p style={styles.loginText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Login</Link>
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
  loginText: { textAlign: 'center', fontSize: '14px', color: '#666' },
  link: { color: '#003580', fontWeight: 'bold', textDecoration: 'none' },
};

export default Register;