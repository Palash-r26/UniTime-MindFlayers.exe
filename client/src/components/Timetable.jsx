import React, { useState } from "react";
import {
  Calendar,
  Upload,
  Clock,
  MapPin,
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react";

const Timetable = ({ isDark }) => {
  const [uploadedTimetable, setUploadedTimetable] = useState(null);
  const [timetableFile, setTimetableFile] = useState(null);
  const [showTimetable, setShowTimetable] = useState(true);

  // Sample timetable data - previous week classes
  const previousWeekClasses = [
    { id: 1, subject: "Operating Systems", day: "Monday", time: "10:00 AM", room: "CS-101", attended: true },
    { id: 2, subject: "Data Structures", day: "Monday", time: "2:00 PM", room: "CS-102", attended: false },
    { id: 3, subject: "Database Systems", day: "Tuesday", time: "11:00 AM", room: "CS-103", attended: true },
    { id: 4, subject: "Computer Networks", day: "Tuesday", time: "3:00 PM", room: "CS-104", attended: false },
    { id: 5, subject: "Algorithms", day: "Wednesday", time: "9:00 AM", room: "CS-105", attended: true },
    { id: 6, subject: "Software Engineering", day: "Wednesday", time: "1:00 PM", room: "CS-106", attended: false },
    { id: 7, subject: "Web Development", day: "Thursday", time: "10:00 AM", room: "CS-107", attended: true },
    { id: 8, subject: "Machine Learning", day: "Friday", time: "11:00 AM", room: "CS-108", attended: false }
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setTimetableFile(file);
      setUploadedTimetable(file.name);
    }
  };

  const removeTimetable = () => {
    setTimetableFile(null);
    setUploadedTimetable(null);
  };

  const theme = isDark
    ? "bg-gray-900 text-white"
    : "bg-gray-50 text-gray-900";

  const card = isDark
    ? "bg-white/10 border-white/20"
    : "bg-white border-gray-200";

  return (
    <div className={`min-h-screen transition-colors ${theme}`}>
      {/* HEADER */}
      <header
        className={`sticky top-0 z-50 border-b ${
          isDark ? "bg-gray-900/80 border-white/10" : "bg-white border-gray-200"
        } backdrop-blur`}
      >
        <div className="flex justify-between items-center px-6 py-4">
          <div>
            <h1 className="text-xl font-bold">UniTime</h1>
            <p className="text-sm opacity-70">Timetable</p>
          </div>
        </div>
      </header>

      <main className="px-6 py-8 max-w-5xl mx-auto">
        {/* TIMETABLE */}
        <div className={`rounded-xl border ${card}`}>
          <button
            onClick={() => setShowTimetable(!showTimetable)}
            className="w-full px-6 py-4 flex justify-between items-center"
          >
            <span className="flex items-center gap-2 font-semibold">
              <Calendar /> Timetable
            </span>
            {showTimetable ? <ChevronUp /> : <ChevronDown />}
          </button>

          {showTimetable && (
            <div className="px-6 pb-6 space-y-6">
              {/* Upload Section */}
              <div className={`p-4 rounded-lg border-2 border-dashed ${
                isDark ? 'border-gray-600' : 'border-gray-300'
              }`}>
                <div className="text-center">
                  <Upload className={`mx-auto h-8 w-8 mb-2 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <p className="text-sm font-medium mb-2">Upload Your Timetable</p>
                  <p className="text-xs opacity-70 mb-4">
                    Upload your class schedule to track attendance and room locations
                  </p>

                  {!uploadedTimetable ? (
                    <label className={`inline-flex items-center px-4 py-2 rounded-lg cursor-pointer font-semibold ${
                      isDark ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}>
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        ✓ {uploadedTimetable}
                      </span>
                      <button
                        onClick={removeTimetable}
                        className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900"
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Previous Week Classes */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Previous Week Attendance
                </h4>
                <div className="space-y-2">
                  {previousWeekClasses.map((cls) => (
                    <div
                      key={cls.id}
                      className={`p-3 rounded-lg border ${
                        cls.attended
                          ? isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'
                          : isDark ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${
                              cls.attended ? 'bg-green-500' : 'bg-red-500'
                            }`}></span>
                            <span className="font-medium">{cls.subject}</span>
                          </div>
                          <div className="text-sm opacity-70 mt-1">
                            {cls.day} • {cls.time}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm opacity-70">
                          <MapPin className="w-4 h-4" />
                          {cls.room}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Room Information */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Class Rooms
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {previousWeekClasses.map((cls) => (
                    <div
                      key={`room-${cls.id}`}
                      className={`p-3 rounded-lg ${
                        isDark ? 'bg-gray-800' : 'bg-gray-50'
                      }`}
                    >
                      <div className="font-medium text-sm">{cls.subject}</div>
                      <div className="text-xs opacity-70">{cls.room}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Timetable;