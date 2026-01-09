import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, onSnapshot, collection, query, where } from "firebase/firestore";
import {
  Calendar, Clock, Brain, Users, Award, Target, ChevronRight, Book, Code, Coffee, Video, Star
} from "lucide-react";

const Dashboard = ({ isDark }) => {
  const [analytics, setAnalytics] = useState({ weeklyHoursOptimized: 0, productivityScore: 0, streakDays: 0, skillsLearned: 0 });
  const [timeGaps, setTimeGaps] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- HELPERS ---
  const getIcon = (iconName) => {
    const icons = { book: <Book size={20}/>, code: <Code size={20}/>, coffee: <Coffee size={20}/>, video: <Video size={20}/>, star: <Star size={20}/>, target: <Target size={20}/>, award: <Award size={20}/> };
    return icons[iconName?.toLowerCase()] || <Star size={20}/>;
  };
  const getTypeColor = (type) => ({ learning: "bg-pink-500", coding: "bg-indigo-500", break: "bg-teal-500", review: "bg-amber-500" }[type?.toLowerCase()] || "bg-gray-500");

  useEffect(() => {
    if (!auth.currentUser) return;
    
    // 1. Analytics
    const unsubAnalytics = onSnapshot(doc(db, "analytics", auth.currentUser.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAnalytics({
            weeklyHoursOptimized: data.totalHours ? parseInt(data.totalHours) : 0,
            productivityScore: data.productivityScore || 0,
            streakDays: data.streak || 0,
            skillsLearned: data.totalSessions || 0 
        });
      }
    });
    // 2. Time Gaps
    const unsubGaps = onSnapshot(query(collection(db, "timeGaps"), where("userId", "==", auth.currentUser.uid)), (snap) => setTimeGaps(snap.docs.map(d => ({id:d.id, ...d.data()}))));
    // 3. Recs
    const unsubRecs = onSnapshot(query(collection(db, "recommendations"), where("userId", "==", auth.currentUser.uid)), (snap) => setRecommendations(snap.docs.map(d => ({id:d.id, ...d.data()}))));
    // 4. Achv
    const unsubAchv = onSnapshot(query(collection(db, "achievements"), where("userId", "==", auth.currentUser.uid)), (snap) => {
      setAchievements(snap.docs.map(d => ({id:d.id, ...d.data()})));
      setLoading(false);
    });

    return () => { unsubAnalytics(); unsubGaps(); unsubRecs(); unsubAchv(); };
  }, []);

  if (loading) return <div className="p-10 text-center animate-pulse">Loading Student Dashboard...</div>;

  return (
    <div className={`space-y-6 ${isDark ? "text-white" : "text-gray-900"}`}>
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard color="from-indigo-500 to-indigo-600" icon={<Clock />} value={`${analytics.weeklyHoursOptimized}h`} label="Optimized Hours" />
        <StatCard color="from-pink-500 to-pink-600" icon={<Users />} value={analytics.productivityScore} label="Productivity Score" />
        <StatCard color="from-amber-500 to-amber-600" icon={<Award />} value={analytics.streakDays} label="Day Streak" />
        <StatCard color="from-emerald-500 to-emerald-600" icon={<Target />} value={analytics.skillsLearned} label="Sessions Completed" />
      </div>

      {/* Time Gaps */}
      <div className={`rounded-2xl shadow-sm border p-6 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
        <h2 className="text-xl font-bold flex items-center gap-2 mb-6"><Calendar className="w-6 h-6 text-indigo-600" /> Available Study Gaps</h2>
        {timeGaps.length > 0 ? (
          <div className="space-y-3">
            {timeGaps.map(gap => (
              <div key={gap.id} className={`flex items-center justify-between p-4 rounded-xl border ${isDark ? "bg-gray-700 border-gray-600" : "bg-gradient-to-r from-indigo-50 to-transparent border-indigo-100"}`}>
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-100 rounded-lg p-3"><Clock className="w-5 h-5 text-indigo-600" /></div>
                  <div><p className="font-semibold">{gap.start} - {gap.end}</p><p className="text-sm opacity-70">{gap.duration} mins • {gap.reason}</p></div>
                </div>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">Plan</button>
              </div>
            ))}
          </div>
        ) : <p className="opacity-50 italic">No gaps detected today.</p>}
      </div>

      {/* Recommendations */}
      <div className={`rounded-2xl shadow-sm border p-6 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
        <h2 className="text-xl font-bold flex items-center gap-2 mb-6"><Brain className="w-6 h-6 text-pink-600" /> AI Recommendations</h2>
        {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map(rec => (
                <div key={rec.id} className={`group border rounded-xl p-5 hover:shadow-lg transition-all ${isDark ? "border-gray-600 hover:border-indigo-400" : "border-gray-200 hover:border-indigo-200"}`}>
                <div className="flex items-start justify-between mb-3">
                    <div className={`${getTypeColor(rec.type)} rounded-lg p-2.5 text-white`}>{getIcon(rec.icon)}</div>
                    <span className="text-sm font-bold text-indigo-600">{rec.relevance}% match</span>
                </div>
                <h3 className="font-bold mb-2">{rec.title}</h3>
                <p className="text-sm opacity-70 mb-4">{rec.description}</p>
                <div className="flex items-center justify-between">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{rec.difficulty}</span>
                    <button className="text-indigo-600 font-medium text-sm flex items-center gap-1">Start <ChevronRight className="w-4 h-4" /></button>
                </div>
                </div>
            ))}
            </div>
        ) : <div className="p-8 text-center border border-dashed rounded-xl opacity-60">Upload a timetable to get recommendations.</div>}
      </div>

      {/* Achievements */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-sm border border-purple-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6"><Award className="w-6 h-6 text-purple-600" /> Recent Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map(ach => (
            <div key={ach.id} className={`rounded-xl p-4 text-center border-2 ${ach.unlocked ? "bg-white border-purple-200" : "bg-gray-100 opacity-60 border-transparent"}`}>
              <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white">{getIcon(ach.icon)}</div>
              <p className="font-semibold text-sm text-gray-900 mb-1">{ach.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ color, icon, value, label }) => (
  <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white shadow-lg`}>
    <div className="flex items-center justify-between mb-2">{React.cloneElement(icon, { className: "w-8 h-8 opacity-80" })}<span className="text-3xl font-bold">{value}</span></div>
    <p className="opacity-80 text-sm font-medium">{label}</p>
  </div>
);

export default Dashboard;