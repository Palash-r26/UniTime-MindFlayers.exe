import React, { useState, useEffect } from 'react';
import { Play, Pause, Save, RotateCcw, ChevronDown, Clock } from "lucide-react";
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp, query, where, onSnapshot } from "firebase/firestore";
import { isValidSubject, getDisplayName } from "../utils/subjectUtils";

const FocusTimer = ({ isDark, preSelectedSubject, preSelectedClass }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [subject, setSubject] = useState(preSelectedSubject || "");
  const [isSaving, setIsSaving] = useState(false);
  const [subjects, setSubjects] = useState([]);

  // React to prop change
  useEffect(() => {
    if (preSelectedSubject) {
      setSubject(preSelectedSubject);
    }
  }, [preSelectedSubject]);

  const [activeGapClass, setActiveGapClass] = useState(null);
  const [classes, setClasses] = useState([]);

  // Fetch subjects AND full class details from Timetable
  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, "timetable"), where("userId", "==", auth.currentUser.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedClasses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClasses(fetchedClasses);

      const fetchedSubjects = fetchedClasses.map(c => c.subject);

      // INLINED HELPER
      const getCode = (str) => {
        if (!str) return null;
        const clean = str.trim();
        const lower = clean.toLowerCase();
        const direct = clean.match(/(\d{8}|NECXXXXX|SIP2XXXX)/);
        if (direct) return direct[0];
        // Simple keywords check
        const map = [
          { k: ["data science lab", "science lab"], c: "29242206" },
          { k: ["algorithms lab", "algo lab"], c: "29242207" },
          { k: ["data science", "data sci"], c: "29242201" },
          { k: ["design and analysis", "algorithms", "daa", "dsa"], c: "29242202" },
          { k: ["theory of computation", "toc"], c: "29242203" },
          { k: ["communication", "networks", "cn"], c: "29242204" },
          { k: ["design pattern", "patterns"], c: "29242205" },
          { k: ["competitive programming", "cp"], c: "29242208" },
          { k: ["proficiency"], c: "29242209" },
          { k: ["macro project", "project-ii"], c: "29242210" },
          { k: ["project management", "economics"], c: "29242211" },
          { k: ["mandatory workshop", "intellectual"], c: "29242212" },
          { k: ["novel engaging", "nec"], c: "NECXXXXX" },
          { k: ["internship", "sip"], c: "SIP2XXXX" }
        ];
        const m = map.find(x => x.k.some(kw => lower.includes(kw)));
        return m ? m.c : null;
      };

      const VALID = [
        "29242201", "29242202", "29242203", "29242204", "29242205",
        "29242206", "29242207", "29242208", "29242209", "29242210",
        "29242211", "29242212", "NECXXXXX", "SIP2XXXX"
      ];

      // Filter & Format
      const uniqueSubjects = [...new Set(fetchedSubjects)]
        .filter(s => {
          const c = getCode(s);
          return c && VALID.includes(c);
        })
        .map(s => {
          const c = getCode(s);
          return s.includes(c) ? s : `${c} - ${s}`;
        });

      setSubjects(uniqueSubjects.length > 0 ? uniqueSubjects : ["General Study"]);

      if (!subject && uniqueSubjects.length > 0) {
        // Don't auto-select here to avoid overriding user choice if they switch tabs
        // setSubject(uniqueSubjects[0]); 
        // Logic kept simple: default to first only if empty
        if (!subject) setSubject(uniqueSubjects[0]);
      } else if (!subject) {
        setSubject("General Study");
      }
    });

    return () => unsubscribe();
  }, []);


  // Check for active gaps (Cancelled class NOW matching selected subject)
  useEffect(() => {
    const checkGap = () => {
      // 1. Forced Active Class (User logic: "Delete" -> "Cover Gap" intent)
      if (preSelectedClass && subject === preSelectedClass.subject) {
        setActiveGapClass(preSelectedClass);
        return;
      }

      if (!subject || classes.length === 0) {
        setActiveGapClass(null);
        return;
      }

      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      // Find if selected subject matches a cancelled class happening right now
      const match = classes.find(cls => {
        if (!cls.isCancelled) return false;

        // Subject Match (Loose)
        const subjectMatch =
          (cls.subject && subject.includes(cls.subject)) ||
          (subject && subject.includes(cls.subject)); // Basic inclusion check

        // Time Match
        // Assuming cls.time is "HH:MM AM/PM" start time. 
        // Use a standard duration, e.g., 60 mins if end time missing.
        if (!cls.time) return false;

        const [timePart, period] = cls.time.split(' ');
        const [h, m] = timePart.split(':').map(Number);
        let startMins = h * 60 + (m || 0);
        if (period === 'PM' && h !== 12) startMins += 12 * 60;
        if (period === 'AM' && h === 12) startMins = 0;

        // Assume 50 min duration for class
        const endMins = startMins + 50;

        return subjectMatch && currentMinutes >= startMins && currentMinutes <= endMins;
      });

      setActiveGapClass(match || null);
    };

    const interval = setInterval(checkGap, 10000); // Check every 10s
    checkGap(); // Initial check

    return () => clearInterval(interval);
  }, [subject, classes, preSelectedClass]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isRunning && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  // Format: HH:MM:SS
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return { h, m, s };
  };

  const { h, m, s } = formatTime(time);

  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
  };

  const saveSession = async () => {
    if (time < 10) {
      alert("Session too short! Study for at least 10 seconds.");
      return;
    }
    const user = auth.currentUser;
    if (!user) {
      alert("Login required!");
      return;
    }
    setIsSaving(true);
    try {
      await addDoc(collection(db, "study_sessions"), {
        userId: user.uid,
        subject: subject,
        durationMinutes: Math.max(1, Math.floor(time / 60)),
        timestamp: serverTimestamp(),
        date: new Date().toISOString().split('T')[0],
        gapClosed: !!activeGapClass, // Mark as closing a gap if active
        relatedClassId: activeGapClass ? activeGapClass.id : null
      });
      setTime(0);
      setIsRunning(false);
      if (activeGapClass) alert("Gap Closed! Great job utilizing this free time.");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // --- BALANCED THEME ---
  const theme = {
    card: isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
    text: isDark ? "text-white" : "text-gray-800",
    subText: isDark ? "text-gray-400" : "text-gray-500",
    inputBg: isDark ? "bg-gray-900 border-gray-600" : "bg-gray-50 border-gray-200",
  };

  return (
    <div className={`rounded-2xl border p-5 shadow-sm transition-all flex flex-col md:flex-row items-center justify-between gap-6 ${theme.card}`}>

      {/* LEFT SIDE: Timer Display */}
      <div className="flex items-center gap-5">
        <div className={`p-3 rounded-xl ${isDark ? 'bg-indigo-500/10' : 'bg-indigo-50'} ${isRunning ? 'animate-pulse' : ''}`}>
          <Clock className={`w-8 h-8 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
        </div>

        <div>
          <p className={`text-xs font-medium tracking-wider mb-1 uppercase ${theme.subText}`}>Focus Timer</p>
          <div className={`font-mono text-5xl font-bold tracking-tight leading-none ${theme.text}`}>
            {h}:{m}:{s}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Controls & Subject */}
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">

        {/* Subject Dropdown */}
        <div className="relative min-w-[160px]">
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={isRunning}
            className={`w-full appearance-none pl-4 pr-10 py-3 rounded-xl border text-sm font-semibold outline-none transition-all cursor-pointer ${theme.inputBg} ${theme.text} focus:ring-2 focus:ring-indigo-500/50`}
          >
            {subjects.length > 0 ? (
              subjects.map((sub, i) => (
                <option key={i} value={sub} className={isDark ? "bg-gray-900" : "bg-white"}>{sub}</option>
              ))
            ) : (
              <option value="General Study" className={isDark ? "bg-gray-900" : "bg-white"}>General Study</option>
            )}
          </select>
          <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${theme.subText}`} />
        </div>

        {/* Action Buttons Group */}
        <div className="flex items-center gap-2">
          {!isRunning ? (
            <button
              onClick={() => setIsRunning(true)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-md transition-all hover:-translate-y-0.5 ${activeGapClass
                ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/20'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20'
                }`}
            >
              <Play className="w-5 h-5 fill-current" />
              {activeGapClass ? "Close Gap" : "Start"}
            </button>
          ) : (
            <button
              onClick={() => setIsRunning(false)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-semibold shadow-md shadow-amber-500/20 transition-all"
            >
              <Pause className="w-5 h-5 fill-current" /> Pause
            </button>
          )}

          {/* Reset Button */}
          {time > 0 && (
            <button
              onClick={resetTimer}
              disabled={isSaving}
              className={`p-3 rounded-xl border transition-all hover:bg-gray-100 dark:hover:bg-gray-700 ${isDark ? 'border-gray-600 text-gray-300' : 'border-gray-200 text-gray-600'}`}
              title="Reset"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}

          {/* Save Button */}
          {time > 0 && !isRunning && (
            <button
              onClick={saveSession}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-semibold shadow-md shadow-green-500/20 transition-all"
            >
              {isSaving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
              <span className="hidden sm:inline">Save</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FocusTimer;