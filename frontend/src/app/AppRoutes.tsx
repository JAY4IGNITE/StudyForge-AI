import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthProvider';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Login = React.lazy(() => import('../features/auth/Login').then(m => ({ default: m.Login })));
const Register = React.lazy(() => import('../features/auth/Register').then(m => ({ default: m.Register })));
const OAuthCallback = React.lazy(() => import('../features/auth/OAuthCallback').then(m => ({ default: m.OAuthCallback })));
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
const AtsDashboard = React.lazy(() => import('../pages/AtsDashboard'));
const JobSearch = React.lazy(() => import('../pages/JobSearch').then(m => ({ default: m.JobSearch })));
const JobDetails = React.lazy(() => import('../pages/JobDetails').then(m => ({ default: m.JobDetails })));
const SavedJobs = React.lazy(() => import('../pages/SavedJobs').then(m => ({ default: m.SavedJobs })));
const LandingPage = React.lazy(() => import('../pages/LandingPage').then(m => ({ default: m.LandingPage })));

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-secondary">
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
    <Loader2 className="h-8 w-8 animate-spin text-ember" />
  </div>
);

import { AnimatedPage } from '../components/motion/AnimatedPage';

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<AnimatedPage><LandingPage /></AnimatedPage>} />
        <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
        <Route path="/register" element={<AnimatedPage><Register /></AnimatedPage>} />
        <Route path="/oauth/callback" element={<AnimatedPage><OAuthCallback /></AnimatedPage>} />
        <Route path="/verify-email" element={<AnimatedPage><VerifyEmail /></AnimatedPage>} />
        <Route path="/forgot-password" element={<AnimatedPage><ForgotPassword /></AnimatedPage>} />
        <Route path="/reset-password" element={<AnimatedPage><ResetPassword /></AnimatedPage>} />

        {/* Protected Application Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><AnimatedPage><Dashboard /></AnimatedPage></ProtectedRoute>} />
        <Route path="/practice" element={<ProtectedRoute><AnimatedPage><PracticeLoop /></AnimatedPage></ProtectedRoute>} />

        {/* AI Video Interview Module */}
        <Route path="/interview" element={<ProtectedRoute><AnimatedPage><InterviewDashboard /></AnimatedPage></ProtectedRoute>} />
        <Route path="/interview/setup" element={<ProtectedRoute><AnimatedPage><InterviewSetup /></AnimatedPage></ProtectedRoute>} />
        <Route path="/interview/room/:sessionId" element={<ProtectedRoute><AnimatedPage><LiveInterviewRoom /></AnimatedPage></ProtectedRoute>} />
        <Route path="/interview/coding/:sessionId" element={<ProtectedRoute><AnimatedPage><CodingInterviewRoom /></AnimatedPage></ProtectedRoute>} />
        <Route path="/interview/report/:sessionId" element={<ProtectedRoute><AnimatedPage><InterviewReportView /></AnimatedPage></ProtectedRoute>} />
        <Route path="/interview/legacy" element={<ProtectedRoute><AnimatedPage><MockInterview /></AnimatedPage></ProtectedRoute>} />

        <Route path="/roadmap" element={<ProtectedRoute><AnimatedPage><StudyRoadmap /></AnimatedPage></ProtectedRoute>} />
        <Route path="/resources" element={<ProtectedRoute><AnimatedPage><Resources /></AnimatedPage></ProtectedRoute>} />
        <Route path="/flashcards" element={<ProtectedRoute><AnimatedPage><Flashcards /></AnimatedPage></ProtectedRoute>} />
        <Route path="/ai-tutor" element={<ProtectedRoute><AnimatedPage><AITutor /></AnimatedPage></ProtectedRoute>} />
        <Route path="/photo-solve" element={<ProtectedRoute><AnimatedPage><PhotoSolve /></AnimatedPage></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><AnimatedPage><Profile /></AnimatedPage></ProtectedRoute>} />

        {/* LeetCode-Style Coding Practice */}
        <Route path="/coding-practice" element={<ProtectedRoute><AnimatedPage><CodingPracticePage /></AnimatedPage></ProtectedRoute>} />

        {/* ATS Scanner */}
        <Route path="/ats" element={<ProtectedRoute><AnimatedPage><AtsDashboard /></AnimatedPage></ProtectedRoute>} />

        {/* Job Search */}
        <Route path="/jobs" element={<ProtectedRoute><AnimatedPage><JobSearch /></AnimatedPage></ProtectedRoute>} />
        <Route path="/jobs/saved" element={<ProtectedRoute><AnimatedPage><SavedJobs /></AnimatedPage></ProtectedRoute>} />
        <Route path="/jobs/:jobId" element={<ProtectedRoute><AnimatedPage><JobDetails /></AnimatedPage></ProtectedRoute>} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="fixed inset-0 z-[-1] bg-gradient-mesh particles-bg pointer-events-none" />
        <Suspense fallback={<PageLoader />}>
          <AnimatedRoutes />
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
};
