import React, { useState } from 'react';
import { auth, db } from '../firebase'; // Ensure this points to your firebase.js config
import { createUserWithEmailAndPassword } from "firebase/auth"; //
import { doc, setDoc } from "firebase/firestore"; //

const Signup = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' // Default role
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

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

    // Validation: Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setIsError(true);
      setMessage('Passwords do not match');
      return;
    }

    try {
      // 1. Create the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;

      // 2. Store the user's role and name in Firestore
      // This is crucial so App.jsx knows whether to show the Student or Teacher dashboard
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        createdAt: new Date()
      });

      setIsError(false);
      setMessage('Account created successfully!');
      
      // Optional: Redirect to login or auto-login logic can go here
    } catch (error) {
      setIsError(true);
      setMessage(error.message); // Displays Firebase auth errors (e.g., email already in use)
    }
  };

  return (
    <div className="bg-white w-[380px] max-w-[95%] px-8 py-10 rounded-xl shadow-lg text-center">
      <div className="flex justify-center items-center mb-2.5">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex justify-center items-center text-xl text-white shadow-md">
          U
        </div>
      </div>
      <h2 className="text-xl font-bold text-gray-600 mb-1.25">Create Account</h2>
      <p className="text-gray-600 text-sm mb-6.25">Join UniTime to start</p>

      <form id="signupForm" onSubmit={handleSubmit}>
        <div className="text-left mb-3.75">
          <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-1.5">Full Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3.5 py-2.75 border-2 border-gray-200 rounded-lg text-sm transition-all focus:border-blue-600 focus:outline-none focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]" />
        </div>
        <div className="text-left mb-3.75">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-1.5">Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3.5 py-2.75 border-2 border-gray-200 rounded-lg text-sm transition-all focus:border-blue-600 focus:outline-none focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]" />
        </div>
        <div className="text-left mb-3.75">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-1.5">Password</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-3.5 py-2.75 border-2 border-gray-200 rounded-lg text-sm transition-all focus:border-blue-600 focus:outline-none focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]" />
        </div>
        <div className="text-left mb-3.75">
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-800 mb-1.5">Confirm Password</label>
          <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="w-full px-3.5 py-2.75 border-2 border-gray-200 rounded-lg text-sm transition-all focus:border-blue-600 focus:outline-none focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]" />
        </div>
        <div className="text-left mb-3.75">
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">Select Role</label>
          <div className="flex justify-around mb-3.75 border-2 border-gray-200 rounded-lg p-2.5">
            <label className="font-medium text-sm flex items-center gap-1.25 mb-0">
              <input type="radio" name="role" value="student" checked={formData.role === 'student'} onChange={handleChange} required className="w-auto" /> Student
            </label>
            <label className="font-medium text-sm flex items-center gap-1.25 mb-0">
              <input type="radio" name="role" value="teacher" checked={formData.role === 'teacher'} onChange={handleChange} required className="w-auto" /> Teacher
            </label>
          </div>
        </div>

        {/* Dynamic message display */}
        <div 
          className={`text-sm mt-3.75 mb-3.75 ${isError ? 'text-red-500' : 'text-green-500'}`} 
          style={{ display: message ? 'block' : 'none' }}
        >
          {message}
        </div>

        <button type="submit" className="w-full py-3 bg-emerald-500 border-none text-white rounded-lg font-semibold text-base cursor-pointer transition-all hover:bg-emerald-600 hover:shadow-[0_6px_15px_rgba(16,185,129,0.2)] mt-2.5">
          Create Account
        </button>
      </form>

      <div className="mt-6.25 text-sm text-gray-800 pt-5 border-t border-gray-200">
        Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin('student'); }} className="text-emerald-500 font-semibold no-underline hover:underline">Login</a>
      </div>
    </div>
  );
};

export default Signup;