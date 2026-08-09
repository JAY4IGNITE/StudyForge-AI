import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthProvider';
import { Loader2 } from 'lucide-react';

const Login = React.lazy(() => import('../features/auth/Login').then(m => ({ default: m.Login })));
const Register = React.lazy(() => import('../features/auth/Register').then(m => ({ default: m.Register })));
const VerifyEmail = React.lazy(() => import('../features/auth/VerifyEmail').then(m => ({ default: m.VerifyEmail })));
const ForgotPassword = React.lazy(() => import('../features/auth/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const ResetPassword = React.lazy(() => import('../features/auth/ResetPassword').then(m => ({ default: m.ResetPassword })));
const Dashboard = React.lazy(() => import('../pages/Dashboard').then(m => ({ default: m.Dashboard })));
const PracticeLoop = React.lazy(() => import('../features/practice/PracticeLoop').then(m => ({ default: m.PracticeLoop })));
const MockInterview = React.lazy(() => import('../features/interviews/MockInterview').then(m => ({ default: m.MockInterview })));
const InterviewDashboard = React.lazy(() => import('../features/interviews/InterviewDashboard').then(m => ({ default: m.InterviewDashboard })));
const InterviewSetup = React.lazy(() => import('../features/interviews/InterviewSetup').then(m => ({ default: m.InterviewSetup })));
const LiveInterviewRoom = React.lazy(() => import('../features/interviews/LiveInterviewRoom').then(m => ({ default: m.LiveInterviewRoom })));
const CodingInterviewRoom = React.lazy(() => import('../features/interviews/CodingInterviewRoom').then(m => ({ default: m.CodingInterviewRoom })));
const InterviewReportView = React.lazy(() => import('../features/interviews/InterviewReportView').then(m => ({ default: m.InterviewReportView })));
const CodingPracticePage = React.lazy(() => import('../features/leetcode/components/CodingPracticePage').then(m => ({ default: m.CodingPracticePage })));
const StudyRoadmap = React.lazy(() => import('../pages/StudyRoadmap').then(m => ({ default: m.StudyRoadmap })));
const Resources = React.lazy(() => import('../pages/Resources').then(m => ({ default: m.Resources })));
const Profile = React.lazy(() => import('../features/profile/Profile').then(m => ({ default: m.Profile })));
const Flashcards = React.lazy(() => import('../pages/Flashcards').then(m => ({ default: m.Flashcards })));
const AITutor = React.lazy(() => import('../pages/AITutor').then(m => ({ default: m.AITutor })));
const PhotoSolve = React.lazy(() => import('../pages/PhotoSolve').then(m => ({ default: m.PhotoSolve })));

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Loading session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Application Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/practice" element={<ProtectedRoute><PracticeLoop /></ProtectedRoute>} />

            {/* AI Video Interview Module */}
            <Route path="/interview" element={<ProtectedRoute><InterviewDashboard /></ProtectedRoute>} />
            <Route path="/interview/setup" element={<ProtectedRoute><InterviewSetup /></ProtectedRoute>} />
            <Route path="/interview/room/:sessionId" element={<ProtectedRoute><LiveInterviewRoom /></ProtectedRoute>} />
            <Route path="/interview/coding/:sessionId" element={<ProtectedRoute><CodingInterviewRoom /></ProtectedRoute>} />
            <Route path="/interview/report/:sessionId" element={<ProtectedRoute><InterviewReportView /></ProtectedRoute>} />
            <Route path="/interview/legacy" element={<ProtectedRoute><MockInterview /></ProtectedRoute>} />

            <Route path="/roadmap" element={<ProtectedRoute><StudyRoadmap /></ProtectedRoute>} />
            <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
            <Route path="/flashcards" element={<ProtectedRoute><Flashcards /></ProtectedRoute>} />
            <Route path="/ai-tutor" element={<ProtectedRoute><AITutor /></ProtectedRoute>} />
            <Route path="/photo-solve" element={<ProtectedRoute><PhotoSolve /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* LeetCode-Style Coding Practice */}
            <Route path="/coding-practice" element={<ProtectedRoute><CodingPracticePage /></ProtectedRoute>} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
};
