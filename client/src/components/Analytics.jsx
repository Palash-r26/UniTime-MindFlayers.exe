import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, onSnapshot, collection, query, where } from "firebase/firestore";
import { 
  TrendingUp, Clock, Target, Award, Calendar, 
  BarChart3, PieChart, Users, BookOpen 
} from "lucide-react";

export default function Analytics({ isDark, userType = 'student' }) {
  // --- REAL-TIME STATES ---
  const [metrics, setMetrics] = useState({
    totalHours: '0h',
    productive: '0%',
    streak: '0',
    sessions: '0'
  });
  const [weeklyData, setWeeklyData] = useState([]);
  const [subjectBreakdown, setSubjectBreakdown] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [studyDays, setStudyDays] = useState([]);
  const [loading, setLoading] = useState(true);

  const cardClass = isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const textClass = isDark ? "text-white" : "text-gray-900";
  const mutedTextClass = isDark ? "text-gray-300" : "text-gray-600";

  useEffect(() => {
    if (!auth.currentUser) return;

    // 1. Listen for Overall Analytics Metrics
    const analyticsRef = doc(db, "analytics", auth.currentUser.uid);
    const unsubMetrics = onSnapshot(analyticsRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setMetrics({
          totalHours: data.totalHours || '0h',
          productive: data.productivityScore || '0%',
          streak: data.streak || '0',
          sessions: data.totalSessions || '0'
        });
        setWeeklyData(data.weeklyProgress || []);
        setSubjectBreakdown(data.subjectBreakdown || []);
        setStudyDays(data.activeDays || []);
      }
    });

    // 2. Listen for Achievements Collection
    const achvQuery = query(
      collection(db, "achievements"), 
      where("userId", "==", auth.currentUser.uid)
    );
    const unsubAchv = onSnapshot(achvQuery, (snapshot) => {
      const achvList = snapshot.docs.map(d => d.data());
      setAchievements(achvList);
      setLoading(false);
    });

    return () => {
      unsubMetrics();
      unsubAchv();
    };
  }, [userType]);

  if (loading) {
    return <div className="p-8 text-center animate-pulse">Loading real-time analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-3xl font-bold ${textClass}`}>Analytics</h1>
        <p className={`mt-2 ${mutedTextClass}`}>
          {userType === 'teacher' 
            ? 'Track your teaching performance and student progress' 
            : 'Track your academic progress and productivity'}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard 
          icon={userType === 'teacher' ? <Users /> : <Clock />} 
          value={metrics.totalHours} 
          label={userType === 'teacher' ? 'Teaching Hours' : 'This Week'} 
          color="text-blue-500" 
          {...{cardClass, textClass, mutedTextClass}}
        />
        <MetricCard 
          icon={<Target />} 
          value={metrics.productive} 
          label={userType === 'teacher' ? 'Avg Attendance' : 'Productive'} 
          color="text-green-500" 
          {...{cardClass, textClass, mutedTextClass}}
        />
        <MetricCard 
          icon={<TrendingUp />} 
          value={metrics.streak} 
          label={userType === 'teacher' ? 'Week Streak' : 'Day Streak'} 
          color="text-purple-500" 
          {...{cardClass, textClass, mutedTextClass}}
        />
        <MetricCard 
          icon={<Award />} 
          value={metrics.sessions} 
          label={userType === 'teacher' ? 'Classes' : 'Sessions'} 
          color="text-yellow-500" 
          {...{cardClass, textClass, mutedTextClass}}
        />
      </div>

      {/* Weekly Progress Chart */}
      <div className={`p-6 rounded-xl border ${cardClass}`}>
        <h2 className={`text-xl font-semibold mb-6 flex items-center gap-2 ${textClass}`}>
          <BarChart3 className="w-5 h-5 text-blue-500" />
          {userType === 'teacher' ? 'Weekly Class Attendance' : 'Weekly Study Hours'}
        </h2>
        <div className="space-y-4">
          {weeklyData.map((day, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className={`w-12 text-sm font-medium ${textClass}`}>{day.day}</div>
              <div className="flex-1">
                <div className={`h-6 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} relative overflow-hidden`}>
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${day.value}%` }}
                  ></div>
                </div>
              </div>
              <div className={`w-16 text-sm text-right ${textClass}`}>
                {userType === 'teacher' ? `${day.value}%` : `${day.hours}h`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subject Breakdown */}
      <div className={`p-6 rounded-xl border ${cardClass}`}>
        <h2 className={`text-xl font-semibold mb-6 flex items-center gap-2 ${textClass}`}>
          <PieChart className="w-5 h-5 text-green-500" />
          {userType === 'teacher' ? 'Subject Performance' : 'Subject Breakdown'}
        </h2>
        <div className="space-y-4">
          {subjectBreakdown.map((subject, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className={`w-4 h-4 rounded-full ${subject.color}`}></div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className={`font-medium ${textClass}`}>{subject.subject}</span>
                  <span className={`text-sm ${mutedTextClass}`}>
                    {userType === 'teacher' ? `${subject.students} students` : `${subject.hours}h`}
                  </span>
                </div>
                <div className={`h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div
                    className={`h-full rounded-full ${subject.color} transition-all duration-500`}
                    style={{ width: `${subject.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className={`p-6 rounded-xl border ${cardClass}`}>
        <h2 className={`text-xl font-semibold mb-6 flex items-center gap-2 ${textClass}`}>
          <Award className="w-5 h-5 text-yellow-500" />
          Recent Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {achievements.map((achievement, index) => (
            <div key={index} className={`flex items-start gap-4 p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <span className="text-2xl">{achievement.icon}</span>
              <div>
                <h3 className={`font-semibold ${textClass}`}>{achievement.title}</h3>
                <p className={`text-sm ${mutedTextClass}`}>{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Component */}
      <CalendarSection {...{cardClass, textClass, mutedTextClass, isDark, userType, studyDays}} />
    </div>
  );
}

// --- SUB-COMPONENTS FOR CLEANER CODE ---

function MetricCard({ icon, value, label, color, cardClass, textClass, mutedTextClass }) {
  return (
    <div className={`p-6 rounded-xl border ${cardClass}`}>
      <div className="flex items-center gap-3">
        <div className={color}>{React.cloneElement(icon, { size: 32 })}</div>
        <div>
          <p className={`text-2xl font-bold ${textClass}`}>{value}</p>
          <p className={`text-sm ${mutedTextClass}`}>{label}</p>
        </div>
      </div>
    </div>
  );
}

function CalendarSection({ cardClass, textClass, mutedTextClass, isDark, userType, studyDays }) {
  return (
    <div className={`p-4 rounded-xl border ${cardClass}`}>
      <h2 className={`text-base font-semibold mb-4 flex items-center gap-2 ${textClass}`}>
        <Calendar className="w-4 h-4 text-purple-500" />
        {userType === 'teacher' ? 'Class Schedule' : 'Study Calendar'}
      </h2>
      <div className="grid grid-cols-7 gap-1">
        {['S','M','T','W','T','F','S'].map(d => (
          <div key={d} className={`text-center text-xs font-medium py-1 ${mutedTextClass}`}>{d}</div>
        ))}
        {Array.from({ length: 31 }, (_, i) => {
          const day = i + 1;
          const isActive = studyDays.includes(day);
          return (
            <div key={day} className={`h-10 flex items-center justify-center rounded-md text-xs ${
              isActive ? (isDark ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800') : (isDark ? 'text-gray-400' : 'text-gray-300')
            }`}>
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}