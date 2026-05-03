import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import SplashScreen from '../../components/SplashScreen';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [redirectTo, setRedirectTo] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const isValidEmail = (email: string) => {
    const allowedDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    return allowedDomains.includes(domain);
  };

  const handleLogin = async () => {
    if (!isValidEmail(email)) {
      setError('Please use a valid email (Gmail, Hotmail, Outlook, Yahoo, or iCloud)');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await authAPI.login(email, password);
      const { token, role, name, email: userEmail } = res.data;
      login(token, { id: 0, fullName: name, email: userEmail, role });

      if (role === 'ADMIN') {
        setRedirectTo('/admin/dashboard');
      } else {
        setRedirectTo('/user/dashboard');
      }
      setShowSplash(true);

    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => navigate(redirectTo)} />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <img src="/logo.png" alt="E-Pass" style={styles.logoImg} />
          <p style={styles.subtitle}>Permit Management System</p>
        </div>

        <h2 style={styles.formTitle}>Login</h2>

        {error && <div style={styles.error}>{error}</div>}

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
            placeholder="Enter Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <Link to="/forgot-password" style={styles.forgotLink}>
          Forgot password?
        </Link>

        <button style={styles.button} onClick={handleLogin} disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </button>

        <p style={styles.registerText}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>Register</Link>
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
  logoImg: { width: '100px', height: '100px', objectFit: 'contain', marginBottom: '8px' },
  subtitle: { color: '#666', fontSize: '14px', margin: '4px 0 0 0' },
  formTitle: { color: '#003580', fontSize: '22px', fontWeight: 'bold', marginBottom: '20px' },
  inputGroup: { marginBottom: '16px' },
  label: { display: 'block', color: '#333', fontWeight: 'bold', marginBottom: '6px', fontSize: '14px' },
  input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box' },
  forgotLink: { color: '#003580', fontSize: '13px', textDecoration: 'none', display: 'block', marginBottom: '16px' },
  button: { width: '100%', padding: '12px', backgroundColor: '#003580', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '16px' },
  error: { backgroundColor: '#ffe0e0', color: 'red', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' },
  registerText: { textAlign: 'center', fontSize: '14px', color: '#666' },
  link: { color: '#003580', fontWeight: 'bold', textDecoration: 'none' },
};

export default Login;