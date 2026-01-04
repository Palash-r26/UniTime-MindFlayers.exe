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

// Firebase Imports
import { auth, db } from './firebase'; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState('student');
  const [loading, setLoading] = useState(true);
  const [authView, setAuthView] = useState('student-login');
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // 1. Listen for Real-time Auth State Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch the user's role from your Firestore 'users' collection
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserType(userDoc.data().role);
          }
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      } else {
        setIsLoggedIn(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Scroll Progress Tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3. AI Helper Function (Communicates with your server/index.js)
  const askGemini = async (prompt) => {
    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      
      if (data.text) {
        alert("AI Suggestion: " + data.text); 
        return data.text;
      } else {
        throw new Error("Invalid response from AI");
      }
    } catch (error) {
      console.error("AI Error:", error);
      alert("AI Chatbot is currently unavailable. Ensure your server is running.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setAuthView('student-login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const switchToSignup = () => setAuthView('signup');
  const switchToStudentLogin = () => setAuthView('student-login');
  const switchToTeacherLogin = () => setAuthView('teacher-login');

  // Loading Screen
  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-blue-600 font-bold">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      Connecting to UniTime...
    </div>
  );

  // Authentication View
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800" data-page="auth">
        {authView === 'signup' && <Signup onSwitchToLogin={switchToStudentLogin} />}
        {authView === 'student-login' && (
          <StudentLogin
            onLogin={() => setIsLoggedIn(true)}
            onSwitchToSignup={switchToSignup}
            onSwitchToTeacherLogin={switchToTeacherLogin}
          />
        )}
        {authView === 'teacher-login' && (
          <TeacherLogin
            onLogin={() => setIsLoggedIn(true)}
            onSwitchToSignup={switchToSignup}
            onSwitchToStudentLogin={switchToStudentLogin}
          />
        )}
      </div>
    );
  }

  // Common Layout Wrapper
  const Layout = ({ children }) => (
    <div className={`flex min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Sidebar
        onLogout={handleLogout}
        isDark={isDark}
        setIsDark={setIsDark}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <main className={`flex-1 p-8 transition-all duration-300 ${sidebarOpen ? 'ml-0' : 'lg:ml-0'}`}>
        {children}
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <div className="relative w-16 h-16">
          <svg width="64" height="64" viewBox="0 0 64 64" className="absolute inset-0">
            <circle cx="32" cy="32" r="24" fill={isDark ? '#374151' : '#ffffff'} />
            <circle cx="32" cy="32" r="28" fill="none" stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} strokeWidth="2" />
            <circle cx="32" cy="32" r="28" fill="none" stroke={isDark ? '#60a5fa' : '#2563eb'} strokeWidth="2"
              strokeDasharray={`${(scrollProgress / 100) * 175} 175`} strokeLinecap="round" transform="rotate(-90 32 32)" />
          </svg>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-3 rounded-full text-gray-500 dark:text-gray-400"
          >
            <ArrowUp size={20} />
          </button>
        </div>
        <button
          onClick={() => askGemini("Analyze my performance gaps and suggest a study priority for my next 30-minute break.")}
          className={`p-4 rounded-full shadow-2xl transition-transform hover:scale-110 ${
            isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
          }`}
        >
          <Bot size={24} />
        </button>
      </div>
    </div>
  );

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={
            userType === 'teacher' 
              ? <TeacherDashBoard isDark={isDark} setIsDark={setIsDark} onLogout={handleLogout} /> 
              : <UnifiedDashboard isDark={isDark} />
          } />
          <Route path="/analytics" element={<Analytics isDark={isDark} userType={userType} />} />
          <Route path="/profile" element={<Profile isDark={isDark} userType={userType} />} />
          <Route path="/settings" element={<Settings isDark={isDark} setIsDark={setIsDark} userType={userType} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;