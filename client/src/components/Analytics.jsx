import { TrendingUp, Clock, Target, Award, Calendar, BarChart3, PieChart } from "lucide-react";

export default function Analytics({ isDark }) {
  const cardClass = isDark
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";

  const textClass = isDark ? "text-white" : "text-gray-900";
  const mutedTextClass = isDark ? "text-gray-300" : "text-gray-600";

  const weeklyData = [
    { day: 'Mon', hours: 4.5, goal: 5 },
    { day: 'Tue', hours: 6.2, goal: 5 },
    { day: 'Wed', hours: 3.8, goal: 5 },
    { day: 'Thu', hours: 5.5, goal: 5 },
    { day: 'Fri', hours: 4.2, goal: 5 },
    { day: 'Sat', hours: 7.1, goal: 5 },
    { day: 'Sun', hours: 2.3, goal: 5 }
  ];

  const subjectBreakdown = [
    { subject: 'Computer Science', hours: 18.5, percentage: 45, color: 'bg-blue-500' },
    { subject: 'Mathematics', hours: 12.3, percentage: 30, color: 'bg-green-500' },
    { subject: 'Physics', hours: 6.2, percentage: 15, color: 'bg-purple-500' },
    { subject: 'Other', hours: 4.0, percentage: 10, color: 'bg-orange-500' }
  ];

  const achievements = [
    { title: '7-Day Streak', description: 'Completed study goals for 7 consecutive days', icon: '🔥' },
    { title: 'Productivity Master', description: 'Achieved 90%+ productive time this week', icon: '⚡' },
    { title: 'Goal Crusher', description: 'Completed 15 study sessions this week', icon: '🎯' }
  ];

  const STUDY_DAYS = [2, 5, 7, 9, 12, 14, 16, 19, 21, 23, 26, 28, 30];

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-3xl font-bold ${textClass}`}>Analytics</h1>
        <p className={`mt-2 ${mutedTextClass}`}>Track your academic progress and productivity</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`p-6 rounded-xl border ${cardClass}`}>
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-500" />
            <div>
              <p className={`text-2xl font-bold ${textClass}`}>32.5h</p>
              <p className={`text-sm ${mutedTextClass}`}>This Week</p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${cardClass}`}>
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-green-500" />
            <div>
              <p className={`text-2xl font-bold ${textClass}`}>87%</p>
              <p className={`text-sm ${mutedTextClass}`}>Productive</p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${cardClass}`}>
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-purple-500" />
            <div>
              <p className={`text-2xl font-bold ${textClass}`}>12</p>
              <p className={`text-sm ${mutedTextClass}`}>Day Streak</p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${cardClass}`}>
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-yellow-500" />
            <div>
              <p className={`text-2xl font-bold ${textClass}`}>23</p>
              <p className={`text-sm ${mutedTextClass}`}>Sessions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className={`p-6 rounded-xl border ${cardClass}`}>
        <h2 className={`text-xl font-semibold mb-6 flex items-center gap-2 ${textClass}`}>
          <BarChart3 className="w-5 h-5 text-blue-500" />
          Weekly Study Hours
        </h2>
        <div className="space-y-4">
          {weeklyData.map((day, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className={`w-12 text-sm font-medium ${textClass}`}>{day.day}</div>
              <div className="flex-1">
                <div className={`h-6 rounded-full ${
                  isDark ? 'bg-gray-700' : 'bg-gray-200'
                } relative overflow-hidden`}>
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${(day.hours / 8) * 100}%` }}
                  ></div>
                  <div
                    className="absolute top-0 h-full border-r-2 border-dashed border-gray-400"
                    style={{ left: `${(day.goal / 8) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className={`w-16 text-sm text-right ${textClass}`}>{day.hours}h</div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-4 text-sm">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className={mutedTextClass}>Actual Hours</span>
          <div className="w-3 h-0.5 border-t-2 border-dashed border-gray-400 ml-4"></div>
          <span className={mutedTextClass}>Goal (5h)</span>
        </div>
      </div>

      {/* Subject Breakdown */}
      <div className={`p-6 rounded-xl border ${cardClass}`}>
        <h2 className={`text-xl font-semibold mb-6 flex items-center gap-2 ${textClass}`}>
          <PieChart className="w-5 h-5 text-green-500" />
          Subject Breakdown
        </h2>
        <div className="space-y-4">
          {subjectBreakdown.map((subject, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className={`w-4 h-4 rounded-full ${subject.color}`}></div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className={`font-medium ${textClass}`}>{subject.subject}</span>
                  <span className={`text-sm ${mutedTextClass}`}>{subject.hours}h ({subject.percentage}%)</span>
                </div>
                <div className={`h-2 rounded-full ${
                  isDark ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
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

      {/* Recent Achievements */}
      <div className={`p-6 rounded-xl border ${cardClass}`}>
        <h2 className={`text-xl font-semibold mb-6 flex items-center gap-2 ${textClass}`}>
          <Award className="w-5 h-5 text-yellow-500" />
          Recent Achievements
        </h2>
        <div className="space-y-4">
          {achievements.map((achievement, index) => (
            <div key={index} className={`flex items-start gap-4 p-4 rounded-lg ${
              isDark ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <span className="text-2xl">{achievement.icon}</span>
              <div>
                <h3 className={`font-semibold ${textClass}`}>{achievement.title}</h3>
                <p className={`text-sm ${mutedTextClass}`}>{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    {/* Study Calendar */}
<div className={`p-4 rounded-xl border ${cardClass}`}>
  <h2 className={`text-base font-semibold mb-4 flex items-center gap-2 ${textClass}`}>
    <Calendar className="w-4 h-4 text-purple-500" />
    Study Calendar
  </h2>

  <div className="grid grid-cols-7 gap-1">
    {['S','M','T','W','T','F','S'].map(d => (
      <div key={d} className={`text-center text-xs font-medium py-1 ${mutedTextClass}`}>
        {d}
      </div>
    ))}

    {Array.from({ length: 31 }, (_, i) => {
      const day = i + 1;
      const isStudy = STUDY_DAYS.includes(day);

      return (
        <div
          key={day}
          className={`h-10 flex items-center justify-center rounded-md text-xs ${
            isStudy
              ? isDark ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'
              : isDark ? 'text-gray-400' : 'text-gray-300'
          }`}
        >
          {day}
        </div>
      );
    })}
  </div>

  <div className="flex items-center gap-2 mt-3 text-xs">
    <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-blue-600' : 'bg-blue-100'}`} />
    <span className={mutedTextClass}>Study days</span>
  </div>
</div>
    </div>
  );
}