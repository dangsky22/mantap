import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import DomainSelectionPage from './pages/DomainSelectionPage';
import ChatRoomPage from './pages/ChatRoomPage';
import AuthPage from './pages/AuthPage';
import ProblemPage from './pages/ProblemPage';
import DashboardPage from './pages/DashboardPage';
import { useAuth } from './hooks/useAuth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/auth" state={{ from: window.location.pathname }} replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
        <Route path="/problem" element={<ProtectedRoute><ProblemPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/select-domain" element={<ProtectedRoute><DomainSelectionPage /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><ChatRoomPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
