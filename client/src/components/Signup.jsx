import React, { useState } from 'react';
import { auth, db } from '../firebase'; 
import { createUserWithEmailAndPassword } from "firebase/auth"; 
import { doc, setDoc } from "firebase/firestore"; 
import { Loader2 } from "lucide-react";

const Signup = ({ onSwitchToLogin, onSwitchToLanding }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' 
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (formData.password !== formData.confirmPassword) {
      setIsError(true);
      setMessage('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // 1. Create Authentication User
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;

      // 2. Initialize User Profile in Firestore
      // We set default values here to prevent "undefined" errors in Profile/Settings
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        createdAt: new Date(),
        phone: "",
        location: "",
        major: "",
        year: "",
        gpa: "",
        photoURL: null, // Important for the profile picture logic
        achievements: [],
        goals: []
      });

      // 3. Initialize Default Settings
      await setDoc(doc(db, "settings", user.uid), {
        notifications: {
            reminders: true,
            deadlines: true,
            reports: false
        },
        focus: {
            sessionDuration: formData.role === 'teacher' ? "60" : "25",
            breakDuration: "5",
            autoStart: true
        },
        privacy: {
            shareUsage: false,
            hideActivities: true
        }
      });

      setIsError(false);
      setMessage('Account created successfully!');
      
      // Optional: Auto-redirect after delay
      setTimeout(() => {
         onSwitchToLogin(formData.role);
      }, 1500);

    } catch (error) {
      console.error("Signup Error:", error);
      setIsError(true);
      setMessage(error.message); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white w-[380px] max-w-[95%] px-8 py-10 rounded-xl shadow-lg text-center">
      <div className="flex justify-center items-center mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex justify-center items-center text-xl text-white shadow-md">
          U
        </div>
      </div>
      <h2 className="text-xl font-bold text-gray-600 mb-2">Create Account</h2>
      <p className="text-gray-600 text-sm mb-6">Join UniTime to start</p>

      <form id="signupForm" onSubmit={handleSubmit} className="space-y-4">
        <div className="text-left">
          <label className="block text-sm font-semibold text-gray-800 mb-1">Full Name</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-sm transition-all focus:border-blue-600 focus:outline-none" 
          />
        </div>
        <div className="text-left">
          <label className="block text-sm font-semibold text-gray-800 mb-1">Email</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-sm transition-all focus:border-blue-600 focus:outline-none" 
          />
        </div>
        <div className="text-left">
          <label className="block text-sm font-semibold text-gray-800 mb-1">Password</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-sm transition-all focus:border-blue-600 focus:outline-none" 
          />
        </div>
        <div className="text-left">
          <label className="block text-sm font-semibold text-gray-800 mb-1">Confirm Password</label>
          <input 
            type="password" 
            name="confirmPassword" 
            value={formData.confirmPassword} 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-sm transition-all focus:border-blue-600 focus:outline-none" 
          />
        </div>
        
        {/* Role Selection */}
        <div className="text-left">
          <label className="block text-sm font-semibold text-gray-800 mb-2">Select Role</label>
          <div className="grid grid-cols-2 gap-4">
            <label className={`cursor-pointer border-2 rounded-lg p-2 flex items-center justify-center gap-2 transition-all ${formData.role === 'student' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}>
              <input 
                type="radio" 
                name="role" 
                value="student" 
                checked={formData.role === 'student'} 
                onChange={handleChange} 
                className="hidden" 
              /> 
              <span className="font-medium text-sm">Student</span>
            </label>
            <label className={`cursor-pointer border-2 rounded-lg p-2 flex items-center justify-center gap-2 transition-all ${formData.role === 'teacher' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}>
              <input 
                type="radio" 
                name="role" 
                value="teacher" 
                checked={formData.role === 'teacher'} 
                onChange={handleChange} 
                className="hidden" 
              /> 
              <span className="font-medium text-sm">Teacher</span>
            </label>
          </div>
        </div>

        <div 
          className={`text-sm text-center font-medium ${isError ? 'text-red-500' : 'text-green-600'}`} 
          style={{ display: message ? 'block' : 'none' }}
        >
          {message}
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold text-base transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {loading && <Loader2 className="animate-spin w-5 h-5" />}
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="mt-6 text-sm text-gray-600 pt-5 border-t border-gray-200">
        Already have an account? <button onClick={() => onSwitchToLogin('student')} className="text-emerald-500 font-semibold hover:underline bg-transparent border-none cursor-pointer">Login</button>
      </div>
    </div>
  );
};

export default Signup;