import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: object) =>
    api.post('/auth/register', data),
  resetPassword: (email: string, newPassword: string) =>
    api.post('/auth/reset-password', { email, newPassword }),
};

export const permitAPI = {
  submit: (data: object) =>
    api.post('/permits/submit', data),
  getMyRequests: () =>
    api.get('/permits/my-requests'),
  getMyPermits: () =>
    api.get('/permits/my-permits'),
  downloadPermit: (permitId: number) =>
    api.get(`/permits/download/${permitId}`, { responseType: 'blob' }),
  getNotifications: () =>
    api.get('/permits/notifications'),
};

export const adminAPI = {
    getAllRequests: () =>
        api.get('/admin/requests'),
    getPendingRequests: () =>
        api.get('/admin/requests/pending'),
    approveRequest: (id: number) =>
        api.put(`/admin/requests/${id}/approve`),
    rejectRequest: (id: number) =>
        api.put(`/admin/requests/${id}/reject`),
    verifyQR: (token: string) =>
        api.get(`/verify/${token}`),
};

export const chatAPI = {
  sendMessage: (message: string) =>
    api.post('/chatbot/message', { message }),
};
export const uploadAPI = {
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};
export default api;