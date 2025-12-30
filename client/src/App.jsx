import React, { useState } from 'react';
import AdaptiveStudentPlatform from './test.jsx';
import Signup from './components/Signup';
import StudentLogin from './components/StudentLogin';
import TeacherLogin from './components/TeacherLogin';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [authView, setAuthView] = useState('student-login'); // default to student login

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
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

  return <AdaptiveStudentPlatform userRole={userRole} onLogout={handleLogout} />;
}

export default App;
