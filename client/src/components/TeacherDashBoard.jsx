import React, { useState } from "react";
import {
  ClipboardList,
  AlertTriangle,
  TrendingUp,
  CheckCircle
} from "lucide-react";

const TeacherDashboard = ({ isDark, setIsDark, onLogout }) => {
  const [classCancelled, setClassCancelled] = useState(false);

  const toggleTheme = () => setIsDark(!isDark);

  const assignments = [
    {
      id: 1,
      title: "Deadlock Prevention Assignment",
      subject: "Operating Systems",
      submissions: 42,
      total: 60,
    },
    {
      id: 2,
      title: "AVL Tree Practice",
      subject: "Data Structures",
      submissions: 55,
      total: 60,
    },
  ];

  const gapInsights = [
    {
      topic: "Deadlock Conditions",
      affectedStudents: 28,
      severity: "high",
    },
    {
      topic: "AVL Rotations",
      affectedStudents: 17,
      severity: "medium",
    },
  ];

  return (
    <div
      className={`min-h-screen transition-colors ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <main className="px-6 py-8 space-y-8 max-w-5xl mx-auto">
        {/* Class Control */}
        <div
          className={`p-6 rounded-2xl border shadow-sm ${
            isDark ? "bg-white/10 border-white/20" : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-1">Today's Class</h2>
              <p className="text-sm text-gray-400">
                Operating Systems — 2:30 PM
              </p>
            </div>

            <button
              onClick={() => setClassCancelled(!classCancelled)}
              className={
                classCancelled
                  ? "px-4 py-2 bg-green-600 text-white rounded-lg font-semibold"
                  : "px-4 py-2 bg-red-600 text-white rounded-lg font-semibold"
              }
            >
              {classCancelled ? "Undo Cancel" : "Cancel Class"}
            </button>
          </div>

          {classCancelled && (
            <div className="mt-4 flex items-start gap-3 text-sm">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              <p className="text-gray-400">
                Class cancelled. AI will recommend productive activities to all
                students automatically.
              </p>
            </div>
          )}
        </div>

        {/* Assignments */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ClipboardList className="w-5 h-5" />
            Assignments
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {assignments.map((a) => (
              <div
                key={a.id}
                className={`p-5 rounded-xl border ${
                  isDark ? "bg-white/10 border-white/20" : "bg-white border-gray-200"
                }`}
              >
                <h3 className="font-bold text-lg mb-1">{a.title}</h3>
                <p className="text-sm text-gray-400 mb-3">{a.subject}</p>

                <div className="flex items-center justify-between text-sm">
                  <span>
                    {a.submissions}/{a.total} submissions
                  </span>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Learning Gaps */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            AI Detected Learning Gaps
          </h2>

          <div className="space-y-3">
            {gapInsights.map((gap, index) => (
              <div
                key={index}
                className={`p-5 rounded-xl border ${
                  isDark ? "bg-white/10 border-white/20" : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">{gap.topic}</h3>
                    <p className="text-sm text-gray-400">
                      {gap.affectedStudents} students affected
                    </p>
                  </div>

                  <span
                    className={
                      gap.severity === "high"
                        ? "px-3 py-1 text-xs font-bold rounded bg-red-500/20 text-red-400"
                        : "px-3 py-1 text-xs font-bold rounded bg-yellow-500/20 text-yellow-400"
                    }
                  >
                    {gap.severity.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 pt-6">
          You manage learning. UniTime handles optimization.
        </p>
      </main>
    </div>
  );
};

export default TeacherDashboard;
