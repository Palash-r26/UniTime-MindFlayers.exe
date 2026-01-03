import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UnifiedDashboard from './components/UnifiedDashboard';
import Analytics from './components/Analytics';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Sidebar from './components/Sidebar';
import Signup from './components/Signup';
import StudentLogin from './components/StudentLogin';
import TeacherLogin from './components/TeacherLogin';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authView, setAuthView] = useState('student-login'); // default to student login
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthView('student-login');
  };

  const switchToSignup = () => setAuthView('signup');
  const switchToStudentLogin = () => setAuthView('student-login');
  const switchToTeacherLogin = () => setAuthView('teacher-login');

  if (!isLoggedIn) {
    return (
      <div data-page="auth">
        {authView === 'signup' && (
          <Signup onSwitchToLogin={switchToStudentLogin} />
        )}
        {authView === 'student-login' && (
          <StudentLogin
            onLogin={handleLogin}
            onSwitchToSignup={switchToSignup}
            onSwitchToTeacherLogin={switchToTeacherLogin}
          />
        )}
        {authView === 'teacher-login' && (
          <TeacherLogin
            onLogin={handleLogin}
            onSwitchToSignup={switchToSignup}
            onSwitchToStudentLogin={switchToStudentLogin}
          />
        )}
      </div>
    );
  }

  return (
    <Router>
      <div className={`flex min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Sidebar
          onLogout={handleLogout}
          isDark={isDark}
          setIsDark={setIsDark}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <main className={`flex-1 p-8 transition-all duration-300 ${sidebarOpen ? 'ml-0' : '-ml-64'}`}>
          <Routes>
            <Route path="/" element={<UnifiedDashboard isDark={isDark} />} />
            <Route path="/analytics" element={<Analytics isDark={isDark} />} />
            <Route path="/profile" element={<Profile isDark={isDark} />} />
            <Route path="/settings" element={<Settings isDark={isDark} setIsDark={setIsDark} />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
