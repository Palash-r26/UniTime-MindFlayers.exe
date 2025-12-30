import React from "react"
import { Target } from "lucide-react"

const Profile = ({ studentProfile, analytics }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-indigo-600 text-3xl font-bold">
            {studentProfile.name
              .split(" ")
              .map(n => n[0])
              .join("")}
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{studentProfile.name}</h1>
            <p className="text-indigo-100">
              {studentProfile.major} • {studentProfile.year}
            </p>
            <p className="text-indigo-100">GPA: {studentProfile.gpa}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-indigo-400">
          <div className="text-center">
            <p className="text-2xl font-bold">{analytics.skillsLearned}</p>
            <p className="text-indigo-100 text-sm">Skills Mastered</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{analytics.streakDays}</p>
            <p className="text-indigo-100 text-sm">Day Streak</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">47</p>
            <p className="text-indigo-100 text-sm">Hours Saved</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Learning Preferences
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <span className="font-medium text-gray-900">Learning Style</span>
            <span className="text-indigo-600 font-semibold">
              {studentProfile.learningStyle}
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <span className="font-medium text-gray-900">
              Preferred Session Length
            </span>
            <span className="text-indigo-600 font-semibold">45-60 minutes</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <span className="font-medium text-gray-900">
              Peak Learning Time
            </span>
            <span className="text-indigo-600 font-semibold">
              Morning (9-11 AM)
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Academic Goals</h2>

        <div className="space-y-3">
          {studentProfile.goals.map((goal, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-transparent rounded-xl border border-indigo-100"
            >
              <Target className="w-5 h-5 text-indigo-600" />
              <span className="font-medium text-gray-900">{goal}</span>
            </div>
          ))}
        </div>

        <button className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors">
          Update Goals
        </button>
      </div>
    </div>
  )
}

export default Profile