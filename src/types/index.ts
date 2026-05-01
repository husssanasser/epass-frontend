export interface User {
  id: number;
  fullName: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'OFFICER';
}

export interface PermitRequest {
  id: number;
  permitType: string;
  purpose: string;
  startDate: string;
  endDate: string;
  destination: string;
  documentUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  user: User;
}

export interface Permit {
  id: number;
  qrCode: string;
  issueDate: string;
  expiryDate: string;
  permitRequest: PermitRequest;
  user: User;
}

export interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  dateOfBirth: string;
}