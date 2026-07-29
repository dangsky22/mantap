import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import DomainSelectionPage from './pages/DomainSelectionPage';
import ChatRoomPage from './pages/ChatRoomPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/select-domain" element={<DomainSelectionPage />} />
        <Route path="/chat" element={<ChatRoomPage />} />
      </Routes>
    </Router>
  );
}

export default App;
