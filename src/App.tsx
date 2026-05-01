import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import UserDashboard from './pages/user/UserDashboard';
import SubmitPermit from './pages/user/SubmitPermit';
import TrackStatus from './pages/user/TrackStatus';
import DownloadPermit from './pages/user/DownloadPermit';
import AdminDashboard from './pages/admin/AdminDashboard';
import VerifyQR from './pages/VerifyQR';
import Chatbot from './components/Chatbot';
import Notifications from './pages/user/Notifications';
import MyQRCode from './pages/user/MyQRCode';
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactElement, allowedRoles: string[] }) => {
  const { isLoggedIn, role } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" />;
  if (!allowedRoles.includes(role || '')) return <Navigate to="/login" />;
  return children;
};

const AppRoutes = () => {
  const { isLoggedIn } = useAuth();

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify" element={<VerifyQR />} />

        <Route path="/user/dashboard" element={
          <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
            <UserDashboard />
          </ProtectedRoute>
        } />
        <Route path="/user/submit" element={
          <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
            <SubmitPermit />
          </ProtectedRoute>
        } />
        <Route path="/user/track" element={
          <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
            <TrackStatus />
          </ProtectedRoute>
        } />
        <Route path="/user/permits" element={
          <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
            <DownloadPermit />
          </ProtectedRoute>
        } />

        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/user/notifications" element={
  <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
    <Notifications />
  </ProtectedRoute>
} />
<Route path="/user/qrcode" element={
  <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
    <MyQRCode />
  </ProtectedRoute>
} />
      </Routes>

      {isLoggedIn && <Chatbot />}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );

}

export default App;