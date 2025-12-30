import React from "react"
import {
  Calendar,
  Clock,
  Brain,
  Users,
  Code,
  Coffee,
  Book,
  Video,
  Award,
  Star,
  Target,
  ChevronRight
} from "lucide-react"

const Dashboard = ({ timeGaps, recommendations, achievements, analytics, getIcon, getDifficultyColor, getTypeColor }) => {
  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">
              {analytics.weeklyHoursOptimized}h
            </span>
          </div>
          <p className="text-indigo-100 text-sm">Hours Optimized This Week</p>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">
              {analytics.productivityScore}
            </span>
          </div>
          <p className="text-pink-100 text-sm">Productivity Score</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{analytics.streakDays}</span>
          </div>
          <p className="text-amber-100 text-sm">Day Streak</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">
              {analytics.skillsLearned}
            </span>
          </div>
          <p className="text-emerald-100 text-sm">Skills Learned</p>
        </div>
      </div>

      {/* Time Gaps */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-600" />
            Available Time Today
          </h2>
          <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">
            View Calendar
          </button>
        </div>

        <div className="space-y-3">
          {timeGaps.map(gap => (
            <div
              key={gap.id}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-transparent rounded-xl border border-indigo-100"
            >
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 rounded-lg p-3">
                  <Clock className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {gap.start} - {gap.end}
                  </p>
                  <p className="text-sm text-gray-600">
                    {gap.duration} minutes • {gap.reason}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {gap.type === "predicted" && (
                  <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium">
                    {gap.confidence}% confidence
                  </span>
                )}
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                  Plan Activity
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personalized Recommendations */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="w-6 h-6 text-pink-600" />
            AI-Powered Recommendations
          </h2>
          <span className="text-sm text-gray-500">
            Based on your goals & availability
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map(rec => (
            <div
              key={rec.id}
              className="group border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-indigo-200 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`${getTypeColor(
                    rec.type
                  )} rounded-lg p-2.5 text-white`}
                >
                  {getIcon(rec.icon)}
                </div>
                <span className="text-sm font-bold text-indigo-600">
                  {rec.relevance}% match
                </span>
              </div>

              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {rec.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">{rec.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {rec.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {rec.duration}m
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                      rec.difficulty
                    )}`}
                  >
                    {rec.difficulty}
                  </span>
                </div>
                <button className="text-indigo-600 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  Start <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {rec.progress && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{rec.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-indigo-600 h-1.5 rounded-full"
                      style={{ width: `${rec.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-sm border border-purple-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
          <Award className="w-6 h-6 text-purple-600" />
          Recent Achievements
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map(achievement => (
            <div
              key={achievement.id}
              className={`${
                achievement.unlocked ? "bg-white" : "bg-gray-100"
              } rounded-xl p-4 text-center ${
                achievement.unlocked
                  ? "border-2 border-purple-200"
                  : "opacity-60"
              }`}
            >
              <div
                className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                  achievement.unlocked
                    ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                {getIcon(achievement.icon)}
              </div>
              <p className="font-semibold text-sm text-gray-900 mb-1">
                {achievement.title}
              </p>
              <p className="text-xs text-gray-600">{achievement.date}</p>
              {!achievement.unlocked && achievement.progress && (
                <div className="mt-2">
                  <div className="w-full bg-gray-300 rounded-full h-1">
                    <div
                      className="bg-purple-500 h-1 rounded-full"
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard