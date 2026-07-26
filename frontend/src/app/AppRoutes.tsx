import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthProvider';
import { Login } from '../features/auth/Login';
import { Register } from '../features/auth/Register';
import { VerifyEmail } from '../features/auth/VerifyEmail';
import { ForgotPassword } from '../features/auth/ForgotPassword';
import { ResetPassword } from '../features/auth/ResetPassword';
import { Dashboard } from '../features/analytics/Dashboard';
import { PracticeLoop } from '../features/practice/PracticeLoop';
import { MockInterview } from '../features/interviews/MockInterview';
import { InterviewDashboard } from '../features/interviews/InterviewDashboard';
import { InterviewSetup } from '../features/interviews/InterviewSetup';
import { LiveInterviewRoom } from '../features/interviews/LiveInterviewRoom';
import { CodingInterviewRoom } from '../features/interviews/CodingInterviewRoom';
import { InterviewReportView } from '../features/interviews/InterviewReportView';
import { CodingPracticePage } from '../features/leetcode/components/CodingPracticePage';
import { Roadmap } from '../features/roadmap/Roadmap';
import { ResourceLibrary } from '../features/resources/ResourceLibrary';
import { Profile } from '../features/profile/Profile';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Loading session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Application Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/practice"
            element={
              <ProtectedRoute>
                <PracticeLoop />
              </ProtectedRoute>
            }
          />

          {/* AI Video Interview Module */}
          <Route
            path="/interview"
            element={
              <ProtectedRoute>
                <InterviewDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview/setup"
            element={
              <ProtectedRoute>
                <InterviewSetup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview/room/:sessionId"
            element={
              <ProtectedRoute>
                <LiveInterviewRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview/coding/:sessionId"
            element={
              <ProtectedRoute>
                <CodingInterviewRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview/report/:sessionId"
            element={
              <ProtectedRoute>
                <InterviewReportView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview/legacy"
            element={
              <ProtectedRoute>
                <MockInterview />
              </ProtectedRoute>
            }
          />

          <Route
            path="/roadmap"
            element={
              <ProtectedRoute>
                <Roadmap />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources"
            element={
              <ProtectedRoute>
                <ResourceLibrary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* LeetCode-Style Coding Practice */}
          <Route
            path="/coding-practice"
            element={
              <ProtectedRoute>
                <CodingPracticePage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
