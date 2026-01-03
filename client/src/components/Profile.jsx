import { User, Mail, Phone, MapPin, Calendar, BookOpen, Award, Target, Users, GraduationCap } from "lucide-react";

export default function Profile({ isDark, userType = 'student' }) {
  const studentUser = {
    name: "Alex Johnson",
    email: "alex.johnson@university.edu",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    joinDate: "September 2023",
    major: "Computer Science",
    year: "Junior",
    gpa: "3.7",
    courses: [
      { code: "CS 301", name: "Operating Systems", grade: "A-" },
      { code: "CS 250", name: "Data Structures", grade: "A" },
      { code: "MATH 201", name: "Discrete Mathematics", grade: "B+" },
      { code: "CS 320", name: "Database Systems", grade: "A-" }
    ],
    achievements: [
      "Dean's List - Fall 2023",
      "Hackathon Winner - CodeFest 2024",
      "Teaching Assistant - CS 101"
    ],
    goals: [
      "Maintain 3.8+ GPA",
      "Complete internship by summer",
      "Master 3 new programming languages"
    ]
  };

  const teacherUser = {
    name: "Dr. Sarah Chen",
    email: "sarah.chen@university.edu",
    phone: "+1 (555) 987-6543",
    location: "San Francisco, CA",
    joinDate: "August 2018",
    department: "Computer Science",
    position: "Associate Professor",
    experience: "6 years",
    students: 180,
    subjects: [
      { code: "CS 301", name: "Operating Systems", students: 45 },
      { code: "CS 250", name: "Data Structures", students: 38 },
      { code: "CS 320", name: "Database Systems", students: 35 },
      { code: "CS 400", name: "Algorithms", students: 42 }
    ],
    achievements: [
      "Excellence in Teaching Award 2023",
      "Published 12 research papers",
      "Department Chair 2022-2023"
    ],
    goals: [
      "Publish 3 more research papers",
      "Improve student satisfaction to 95%",
      "Develop new AI curriculum"
    ]
  };

  const user = userType === 'teacher' ? teacherUser : studentUser;

  const cardClass = isDark
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";

  const textClass = isDark ? "text-white" : "text-gray-900";
  const mutedTextClass = isDark ? "text-gray-300" : "text-gray-600";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
          isDark ? 'bg-blue-500' : 'bg-blue-600'
        }`}>
          <User className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className={`text-3xl font-bold ${textClass}`}>{user.name}</h1>
          <p className={`text-lg ${mutedTextClass}`}>
            {userType === 'teacher' ? `${user.position} • ${user.department}` : `${user.major} • ${user.year}`}
          </p>
        </div>
      </div>

      {/* Personal Information */}
      <div className={`p-6 rounded-xl border ${cardClass}`}>
        <h2 className={`text-xl font-semibold mb-4 ${textClass}`}>Personal Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-blue-500" />
            <div>
              <p className={`text-sm ${mutedTextClass}`}>Email</p>
              <p className={textClass}>{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-blue-500" />
            <div>
              <p className={`text-sm ${mutedTextClass}`}>Phone</p>
              <p className={textClass}>{user.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-blue-500" />
            <div>
              <p className={`text-sm ${mutedTextClass}`}>Location</p>
              <p className={textClass}>{user.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-blue-500" />
            <div>
              <p className={`text-sm ${mutedTextClass}`}>Joined</p>
              <p className={textClass}>{user.joinDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Information */}
      <div className={`p-6 rounded-xl border ${cardClass}`}>
        <h2 className={`text-xl font-semibold mb-4 ${textClass}`}>
          {userType === 'teacher' ? 'Professional Information' : 'Academic Information'}
        </h2>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {userType === 'teacher' ? (
            <>
              <div className="text-center">
                <p className={`text-2xl font-bold ${textClass}`}>{user.experience}</p>
                <p className={`text-sm ${mutedTextClass}`}>Experience</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${textClass}`}>{user.students}</p>
                <p className={`text-sm ${mutedTextClass}`}>Students</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${textClass}`}>{user.position}</p>
                <p className={`text-sm ${mutedTextClass}`}>Position</p>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <p className={`text-2xl font-bold ${textClass}`}>{user.gpa}</p>
                <p className={`text-sm ${mutedTextClass}`}>GPA</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${textClass}`}>{user.year}</p>
                <p className={`text-sm ${mutedTextClass}`}>Year</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${textClass}`}>{user.major}</p>
                <p className={`text-sm ${mutedTextClass}`}>Major</p>
              </div>
            </>
          )}
        </div>

        <h3 className={`text-lg font-semibold mb-3 ${textClass}`}>
          {userType === 'teacher' ? 'Current Subjects' : 'Current Courses'}
        </h3>
        <div className="space-y-3">
          {(userType === 'teacher' ? user.subjects : user.courses).map((item, index) => (
            <div key={index} className={`flex justify-between items-center p-3 rounded-lg ${
              isDark ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-3">
                {userType === 'teacher' ? (
                  <Users className="w-5 h-5 text-blue-500" />
                ) : (
                  <BookOpen className="w-5 h-5 text-blue-500" />
                )}
                <div>
                  <p className={`font-medium ${textClass}`}>{item.code}</p>
                  <p className={`text-sm ${mutedTextClass}`}>{item.name}</p>
                </div>
              </div>
              {userType === 'teacher' ? (
                <span className={`px-2 py-1 rounded text-sm font-medium bg-blue-100 text-blue-800`}>
                  {item.students} students
                </span>
              ) : (
                <span className={`px-2 py-1 rounded text-sm font-medium ${
                  item.grade.startsWith('A') ? 'bg-green-100 text-green-800' :
                  item.grade.startsWith('B') ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {item.grade}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className={`p-6 rounded-xl border ${cardClass}`}>
        <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${textClass}`}>
          <Award className="w-5 h-5 text-yellow-500" />
          Achievements
        </h2>
        <div className="space-y-3">
          {user.achievements.map((achievement, index) => (
            <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${
              isDark ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <Award className="w-5 h-5 text-yellow-500" />
              <p className={textClass}>{achievement}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Goals */}
      <div className={`p-6 rounded-xl border ${cardClass}`}>
        <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${textClass}`}>
          <Target className="w-5 h-5 text-green-500" />
          {userType === 'teacher' ? 'Professional Goals' : 'Academic Goals'}
        </h2>
        <div className="space-y-3">
          {user.goals.map((goal, index) => (
            <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${
              isDark ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <Target className="w-5 h-5 text-green-500" />
              <p className={textClass}>{goal}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}