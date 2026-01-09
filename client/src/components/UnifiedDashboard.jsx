import React, { useState, useEffect } from "react";
import { 
  Clock, AlertTriangle, CheckCircle, 
  Brain, Calendar, ArrowRight, Loader2, Sparkles 
} from "lucide-react";
import { db, auth } from "../firebase";
import { collection, query, onSnapshot } from "firebase/firestore";

const UnifiedDashboard = ({ isDark }) => {
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [metrics, setMetrics] = useState({ active: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);

  // New State for "Plan Now" Feature
  const [planningId, setPlanningId] = useState(null);
  const [aiPlans, setAiPlans] = useState({}); 

  // Fetch real data from 'timetable' collection
  useEffect(() => {
    if (!auth.currentUser) return;
    
    const q = query(collection(db, "timetable"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const classData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUpcomingClasses(classData);
      
      const cancelledCount = classData.filter(c => c.isCancelled).length;
      setMetrics({
        active: classData.length - cancelledCount,
        cancelled: cancelledCount
      });
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- HANDLE "PLAN NOW" CLICK ---
  const handlePlanFreeTime = async (cls) => {

    setPlanningId(cls.id); 
    try {
      const prompt = `My ${cls.subject} class at ${cls.time} was cancelled. I have a free hour. Suggest a short 1-line study task.`;

      // Use dynamic API URL
      const API_URL = import.meta.env.VITE_API_URL || "${API_BASE_URL}";
      
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await response.json();

      setAiPlans(prev => ({
        ...prev,
        [cls.id]: data.text || "Revise notes."
      }));

    } catch (error) {
      console.error("Error:", error);
      alert("AI Server not running!");
    } finally {
      setPlanningId(null);
    }
  };

  const theme = isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900";
  const card = isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";

  return (
    <div className={`min-h-screen p-6 ${theme}`}>
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* HEADER & METRICS */}
        <header className="pb-6 border-b border-gray-700/50">
          <h1 className="text-2xl font-bold">Student Dashboard</h1>
          <p className="opacity-70">Real-time updates from teachers.</p>
        </header>

        <div className="grid grid-cols-3 gap-4">
          <div className={`p-4 rounded-xl border ${card}`}>
            <p className="text-2xl font-bold">{upcomingClasses.length}</p>
            <span className="opacity-70 text-sm">Total Classes</span>
          </div>
          <div className={`p-4 rounded-xl border ${card}`}>
            <p className="text-2xl font-bold text-green-500">{metrics.active}</p>
            <span className="opacity-70 text-sm">Active</span>
          </div>
          <div className={`p-4 rounded-xl border ${card}`}>
            <p className="text-2xl font-bold text-red-500">{metrics.cancelled}</p>
            <span className="opacity-70 text-sm">Cancelled</span>
          </div>
        </div>

        {/* SCHEDULE LIST */}
        <h2 className="text-lg font-bold pt-4">Your Schedule</h2>
        
        {loading ? <div className="text-center opacity-50 py-10">Loading...</div> : 
         upcomingClasses.length === 0 ? <div className="text-center opacity-50 py-10">No classes yet.</div> : (
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingClasses.map((cls) => (
              <div key={cls.id} className={`p-5 rounded-xl border relative transition-all ${cls.isCancelled ? 'border-red-500/40 bg-red-500/5' : card}`}>
                
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`font-bold text-lg ${cls.isCancelled ? 'line-through opacity-60' : ''}`}>{cls.subject}</h3>
                    <div className="flex items-center gap-2 text-sm opacity-70 mt-1">
                      <Clock size={14} /> {cls.time} • {cls.day}
                    </div>
                  </div>
                  {cls.isCancelled && <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">CANCELLED</span>}
                </div>

                {/* --- PLAN NOW SECTION --- */}
                {cls.isCancelled && (
                  <div className={`mt-4 p-3 rounded-lg border ${isDark ? 'bg-red-900/10 border-red-500/20' : 'bg-red-50 border-red-100'}`}>
                    
                    {aiPlans[cls.id] ? (
                      <div className="animate-in fade-in">
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="w-4 h-4 text-indigo-500" />
                          <span className="text-sm font-bold text-indigo-500">AI Plan:</span>
                        </div>
                        <p className="text-sm opacity-90">{aiPlans[cls.id]}</p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Brain className="w-5 h-5 text-indigo-500" />
                          <div className="text-sm">
                            <span className="font-bold text-indigo-400">Free Time!</span>
                            <p className="opacity-70 text-xs">Utilize this hour?</p>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => handlePlanFreeTime(cls)}
                          disabled={planningId === cls.id}
                          className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg flex items-center gap-1"
                        >
                          {planningId === cls.id ? <Loader2 className="animate-spin" size={12}/> : "Plan Now"}
                        </button>
                      </div>
                    )}

                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedDashboard;