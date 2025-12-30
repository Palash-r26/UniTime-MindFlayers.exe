import React from "react"
import { Activity } from "lucide-react"

const Analytics = ({ analytics, studentProfile }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
          <Activity className="w-6 h-6 text-indigo-600" />
          Productivity Trends
        </h2>

        <div className="mb-8">
          <div className="flex items-end justify-between h-64 gap-2">
            {analytics.weeklyTrend.map((value, idx) => (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div
                  className="w-full bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-lg hover:from-indigo-600 hover:to-indigo-500 transition-all cursor-pointer"
                  style={{ height: `${value}%` }}
                ></div>
                <span className="text-xs text-gray-600 font-medium">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][idx]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
            <p className="text-3xl font-bold text-indigo-600 mb-1">85%</p>
            <p className="text-sm text-gray-600">Time Utilization</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
            <p className="text-3xl font-bold text-emerald-600 mb-1">23</p>
            <p className="text-sm text-gray-600">Activities Completed</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
            <p className="text-3xl font-bold text-purple-600 mb-1">4.2h</p>
            <p className="text-sm text-gray-600">Avg. Daily Learning</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Learning Progress by Goal
        </h2>

        <div className="space-y-6">
          {studentProfile.goals.map((goal, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{goal}</span>
                <span className="text-sm text-gray-600">
                  {[78, 65, 42][idx]}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    ["bg-indigo-500", "bg-pink-500", "bg-amber-500"][idx]
                  }`}
                  style={{ width: `${[78, 65, 42][idx]}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Analytics