import { Bell, Moon, Sun, Clock, Shield, Save, Users, BookOpen } from "lucide-react";

export default function Settings({ isDark, setIsDark, userType = 'student' }) {
  const cardClass = isDark
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";

  const textClass = isDark ? "text-white" : "text-gray-900";
  const mutedTextClass = isDark ? "text-gray-300" : "text-gray-600";

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-3xl font-bold ${textClass}`}>Settings</h1>
        <p className={`mt-2 ${mutedTextClass}`}>Customize your UniTime experience</p>
      </div>

      {/* Notifications */}
      <div className={`p-6 rounded-xl border ${cardClass}`}>
        <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${textClass}`}>
          <Bell className="w-5 h-5 text-blue-500" />
          Notifications
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className={`font-medium ${textClass}`}>
                {userType === 'teacher' ? 'Class Reminders' : 'Study Reminders'}
              </p>
              <p className={`text-sm ${mutedTextClass}`}>
                {userType === 'teacher' ? 'Get notified before class starts' : 'Get notified when it\'s time to study'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className={`font-medium ${textClass}`}>
                {userType === 'teacher' ? 'Assignment Deadlines' : 'Break Reminders'}
              </p>
              <p className={`text-sm ${mutedTextClass}`}>
                {userType === 'teacher' ? 'Remind me of upcoming assignment deadlines' : 'Remind me to take breaks'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className={`font-medium ${textClass}`}>
                {userType === 'teacher' ? 'Student Performance Alerts' : 'Weekly Reports'}
              </p>
              <p className={`text-sm ${mutedTextClass}`}>
                {userType === 'teacher' ? 'Get alerts about student performance issues' : 'Receive weekly progress summaries'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className={`p-6 rounded-xl border ${cardClass}`}>
        <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${textClass}`}>
          {isDark ? <Moon className="w-5 h-5 text-yellow-400" /> : <Sun className="w-5 h-5 text-orange-500" />}
          Appearance
        </h2>
        <div className="space-y-4">
          <div>
            <p className={`font-medium mb-2 ${textClass}`}>Theme</p>
            <p className={`text-sm ${mutedTextClass} mb-3`}>Choose your preferred theme</p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDark(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                  !isDark ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Sun className="w-4 h-4" />
                Light
              </button>
              <button
                onClick={() => setIsDark(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                  isDark ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Moon className="w-4 h-4" />
                Dark
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Focus Settings */}
      <div className={`p-6 rounded-xl border ${cardClass}`}>
        <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${textClass}`}>
          {userType === 'teacher' ? <BookOpen className="w-5 h-5 text-green-500" /> : <Clock className="w-5 h-5 text-green-500" />}
          {userType === 'teacher' ? 'Class Settings' : 'Focus Settings'}
        </h2>
        <div className="space-y-4">
          {userType === 'teacher' ? (
            <>
              <div>
                <label className={`block font-medium mb-2 ${textClass}`}>Default Class Duration (minutes)</label>
                <select className={`w-full p-3 rounded-lg border ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}>
                  <option>60</option>
                  <option>75</option>
                  <option>90</option>
                  <option>120</option>
                </select>
              </div>

              <div>
                <label className={`block font-medium mb-2 ${textClass}`}>Attendance Tracking</label>
                <select className={`w-full p-3 rounded-lg border ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}>
                  <option>Manual</option>
                  <option>Automatic</option>
                  <option>Hybrid</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className={`block font-medium mb-2 ${textClass}`}>Default Study Session (minutes)</label>
                <select className={`w-full p-3 rounded-lg border ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}>
                  <option>25</option>
                  <option>30</option>
                  <option>45</option>
                  <option>60</option>
                </select>
              </div>

              <div>
                <label className={`block font-medium mb-2 ${textClass}`}>Default Break Time (minutes)</label>
                <select className={`w-full p-3 rounded-lg border ${
                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                }`}>
                  <option>5</option>
                  <option>10</option>
                  <option>15</option>
                  <option>20</option>
                </select>
              </div>
            </>
          )}

          <div className="flex items-center justify-between">
            <div>
              <p className={`font-medium ${textClass}`}>
                {userType === 'teacher' ? 'Auto-grade Assignments' : 'Auto-start Breaks'}
              </p>
              <p className={`text-sm ${mutedTextClass}`}>
                {userType === 'teacher' ? 'Automatically grade simple assignments' : 'Automatically start break timer after study session'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Privacy */}
      <div className={`p-6 rounded-xl border ${cardClass}`}>
        <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${textClass}`}>
          <Shield className="w-5 h-5 text-purple-500" />
          Privacy & Security
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className={`font-medium ${textClass}`}>Share Anonymous Usage Data</p>
              <p className={`text-sm ${mutedTextClass}`}>Help improve UniTime with anonymous analytics</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className={`font-medium ${textClass}`}>
                {userType === 'teacher' ? 'Student Data Privacy' : 'Study Session Privacy'}
              </p>
              <p className={`text-sm ${mutedTextClass}`}>
                {userType === 'teacher' ? 'Control how student data is shared and used' : 'Hide study activities from other users'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {userType === 'teacher' && (
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${textClass}`}>Grade Visibility</p>
                <p className={`text-sm ${mutedTextClass}`}>Allow students to see their grades immediately</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={() => alert('Settings saved successfully!')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${
            isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
          } text-white transition-colors`}
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
}