import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UnifiedDashboard from './components/UnifiedDashboard';
import TeacherDashBoard from './components/TeacherDashBoard';
import Analytics from './components/Analytics';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Sidebar from './components/Sidebar';
import Signup from './components/Signup';
import StudentLogin from './components/StudentLogin';
import TeacherLogin from './components/TeacherLogin';
import { Bot, ArrowUp } from 'lucide-react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState('student'); // 'student' or 'teacher'
  const [authView, setAuthView] = useState('student-login'); // default to student login
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = (type) => {
    setIsLoggedIn(true);
    setUserType(type);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthView('student-login');
    setUserType('student');
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
            onLogin={() => handleLogin('student')}
            onSwitchToSignup={switchToSignup}
            onSwitchToTeacherLogin={switchToTeacherLogin}
          />
        )}
        {authView === 'teacher-login' && (
          <TeacherLogin
            onLogin={() => handleLogin('teacher')}
            onSwitchToSignup={switchToSignup}
            onSwitchToStudentLogin={switchToStudentLogin}
          />
        )}
      </div>
    );
  }

  if (userType === 'teacher') {
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
              <Route path="/" element={<TeacherDashBoard isDark={isDark} setIsDark={setIsDark} onLogout={handleLogout} />} />
              <Route path="/analytics" element={<Analytics isDark={isDark} userType="teacher" />} />
              <Route path="/profile" element={<Profile isDark={isDark} userType="teacher" />} />
              <Route path="/settings" element={<Settings isDark={isDark} setIsDark={setIsDark} userType="teacher" />} />
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Floating Chatbot and Scroll to Top */}
          <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
            <div className="relative w-16 h-16">
              <svg width="64" height="64" viewBox="0 0 64 64" className="absolute inset-0">
                <circle
                  cx="32"
                  cy="32"
                  r="24"
                  fill={isDark ? '#374151' : '#ffffff'}
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}
                  strokeWidth="2"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke={isDark ? '#60a5fa' : '#2563eb'}
                  strokeWidth="2"
                  strokeDasharray={`${(scrollProgress / 100) * 175} 175`}
                  strokeLinecap="round"
                  transform="rotate(-90 32 32)"
                />
              </svg>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-3 rounded-full shadow-lg bg-transparent"
              >
                <ArrowUp size={20} />
              </button>
            </div>
            <button
              className={`p-3 rounded-full shadow-lg ${
                isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <Bot size={20} />
            </button>
          </div>
        </div>
      </Router>
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

        {/* Floating Chatbot and Scroll to Top */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
          <div className="relative w-16 h-16">
            <svg width="64" height="64" viewBox="0 0 64 64" className="absolute inset-0">
              <circle
                cx="32"
                cy="32"
                r="24"
                fill={isDark ? '#374151' : '#ffffff'}
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}
                strokeWidth="2"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke={isDark ? '#60a5fa' : '#2563eb'}
                strokeWidth="2"
                strokeDasharray={`${(scrollProgress / 100) * 175} 175`}
                strokeLinecap="round"
                transform="rotate(-90 32 32)"
              />
            </svg>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-3 rounded-full shadow-lg bg-transparent"
            >
              <ArrowUp size={20} />
            </button>
          </div>
          <button
            className={`p-3 rounded-full shadow-lg ${
              isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <Bot size={20} />
          </button>
        </div>
      </div>
    </Router>
  );
}

export default App;
