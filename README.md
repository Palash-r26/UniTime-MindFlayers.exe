# UniTime - AI-Powered Student Timetable Management

UniTime is a comprehensive full-stack web application designed to help students manage their academic schedules efficiently. Leveraging Google's Gemini AI, it analyzes uploaded timetables (PDFs or images) to provide personalized study plans, optimize time usage, and integrate seamlessly with Google Calendar.

## 🚀 Features

### Core Features
- **AI-Powered Schedule Analysis**: Upload PDF or image timetables for intelligent analysis using Gemini AI
- **Academic Manager**: Upload and manage timetables, syllabus, and marking schemes with AI-powered parsing
- **AI Study Advisor**: Get personalized, adaptive study plans based on your uploaded academic documents
- **Google Calendar Integration**: Sync your schedule with Google Calendar for real-time updates
- **User Authentication**: Secure login/signup system with Firebase
- **Responsive Dashboard**: Modern UI built with React and Tailwind CSS
- **Role-Based Access**: Separate dashboards for students and teachers

### Productivity & Time Management
- **Focus Timer**: Pomodoro-style timer with subject tracking and study session logging
- **Free Time Detection**: Automatically identifies gaps in your schedule for optimal study planning
- **Smart Notifications**: Context-aware notifications for class cancellations, upcoming classes, and study reminders
- **Learning Continuity Dashboard**: Track productivity metrics, daily/weekly streaks, and gap closure progress
- **Academic Gap Analyzer**: Identifies weak subjects and suggests targeted study sessions

### Collaboration & Social Features
- **Peer Collaboration**: AI-powered matching system to find study partners with similar schedules
- **Peer Chat**: Real-time messaging with matched study partners
- **Classroom Sync**: Integration with Google Classroom for course management
- **Real-time Presence**: See which peers are online and available for collaboration

### Analytics & Tracking
- **Advanced Analytics**: Comprehensive tracking of academic progress and time management
- **Quiz Score Tracking**: Monitor your performance across different subjects
- **Weekly Progress Reports**: Visual insights into your study habits and improvements
- **Subject-wise Performance**: Detailed breakdown of time spent and progress per subject

### AI-Powered Assistance
- **Chatbot Support**: Intelligent academic assistant for instant help and guidance
- **Automated Study Plans**: AI generates optimal study schedules based on your free time and academic gaps
  
  ## 📸 Project Screenshots
  
| **1. Landing Page** | **2. User Login** |
|:---:|:---:|
| ![Landing Page](client/src/assets/Screenshot%202026-01-10%20215249.png) | ![Login](client/src/assets/Screenshot%202026-01-17%20144111.png) |

| **3. Create Account (Sign Up)** | **4. Student Dashboard** |
|:---:|:---:|
| ![Signup](client/src/assets/Screenshot%202026-01-10%20220051.png) | ![Student Dashboard](client/src/assets/Screenshot%202026-01-17%20144041.png) |

| **5. Analytics & Progress** | **6. Timetable Management** |
|:---:|:---:|
| ![Analytics](client/src/assets/Screenshot%202026-01-17%20144925.png) | ![Timetable](client/src/assets/Screenshot%202026-01-17%20134108.png) |

| **7. AI Chatbot Assistant** |
|:---:|
| ![Chatbot](client/src/assets/Screenshot%202026-01-10%20220311.png) |

## 🛠 Tech Stack

### Frontend
- **React 19** - Modern JavaScript library for building user interfaces
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Declarative routing for React
- **Lucide React** - Beautiful icon library
- **Firebase** - Authentication and real-time database
- **Firestore** - Real-time NoSQL database for storing user data, schedules, and chat messages

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Google Generative AI (Gemini)** - AI analysis, chatbot functionality, and study plan generation
- **Multer** - Middleware for handling file uploads
- **PDF-parse** - PDF text extraction
- **Firebase Admin** - Server-side Firebase operations
- **CORS** - Cross-origin resource sharing

### AI & Utilities
- **Academic Gap Analyzer** - Identifies weak subjects based on quiz scores and assignments
- **Free Time Detector** - Automatically finds gaps in your timetable for study scheduling
- **Peer Collaboration Matcher** - AI-powered algorithm to match students with similar schedules
- **Subject Utils** - Helper functions for subject code parsing and management

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** or **yarn**
- **Git**

## 🔧 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Palash-r26/UniTime-MindFlayers.exe.git
   cd UniTime-MindFlayers.exe-main
   ```

2. **Install server dependencies:**
   ```bash
   cd server
   npm install @google/generative-ai axios cloudinary cors dotenv express firebase-admin multer nodemon pdf-parse
   ```

3. **Install client dependencies:**
   ```bash
   cd ../client
   npm install @google/generative-ai @tailwindcss/vite firebase gapi-script lucide-react react react-dom react-router-dom tailwindcss
   ```

4. **Set up environment variables:**

   Create a `.env` file in the `server` directory with the following variables:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=5000
   FIREBASE_PROJECT_ID=your_firebase_project_id
   ```

   For the client, create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

5. **Firebase Configuration:**

   - Set up a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable **Authentication** (Email/Password provider)
   - Enable **Firestore Database** and create the following collections:
     - `users` - User profiles and academic data
     - `timetable` - Class schedules
     - `study_sessions` - Focus timer logs
     - `assignments` - Assignment tracking
     - `quiz_scores` - Quiz performance data
     - `collaboration_requests` - Peer collaboration requests
     - `peer_chats` - Real-time chat messages
   - Add your Firebase config to `client/src/firebase.js`
   - Download the service account key for Firebase Admin and place it in `server/` directory
   - Update the Firebase Admin initialization in your server files with the correct path to your service account key

## 🚀 Running the Application

1. **Start the backend server:**
   ```bash
   cd server
   node index.js
   # or for development with auto-reload:
   npx nodemon index.js
   ```

2. **Start the frontend development server:**
   ```bash
   cd client
   npm run dev
   ```

3. **Open your browser and navigate to:**
   ```
   http://localhost:5173
   ```

## 📡 API Endpoints

### AI Analysis
- `POST /api/analyze` - Analyze uploaded timetable files (PDF/Image) and generate study plans
- AI-powered parsing of timetables, syllabus, and marking schemes

### Chatbot
- `POST /api/chat` - Interact with the AI chatbot for academic assistance and personalized advice

### Authentication & User Data
- Handled through Firebase Authentication on the frontend
- Firestore real-time sync for user profiles, timetables, and academic data

### Real-time Features
- **Study Sessions** - Track and store focus timer sessions
- **Assignments & Quiz Scores** - Manage academic performance data
- **Peer Collaboration Requests** - Send, receive, and manage study partner requests
- **Chat Messages** - Real-time messaging between matched peers
- **Notifications** - Context-aware smart notifications for classes and study reminders

## 📁 Project Structure

```
UniTime-MindFlayers.exe/
├── .github/
│   └── workflows/          # CI/CD & Code quality workflows
├── client/                 # React frontend
│   ├── public/             # Public assets
│   ├── src/
│   │   ├── assets/         # Images, icons, and screenshots
│   │   ├── components/     # React components
│   │   │   ├── AcademicManager.jsx       # Upload & manage academic documents
│   │   │   ├── AIStudyAdvisor.jsx        # Personalized AI study recommendations
│   │   │   ├── Analytics.jsx             # Academic progress tracking
│   │   │   ├── Chatbot.jsx               # AI assistant
│   │   │   ├── ClassroomConnect.jsx      # Google Classroom integration UI
│   │   │   ├── ClassroomSync.jsx         # Sync courses from Classroom
│   │   │   ├── FocusTimer.jsx            # Pomodoro timer with tracking
│   │   │   ├── GoogleCalendar.jsx        # Calendar integration
│   │   │   ├── LandingPage.jsx           # Homepage
│   │   │   ├── LearningContinuityDashboard.jsx  # Productivity metrics
│   │   │   ├── PeerChat.jsx              # Real-time messaging
│   │   │   ├── PeerCollaboration.jsx     # Study partner matching
│   │   │   ├── Profile.jsx               # User profile management
│   │   │   ├── Settings.jsx              # App settings
│   │   │   ├── Sidebar.jsx               # Navigation sidebar
│   │   │   ├── Signup.jsx                # User registration
│   │   │   ├── SmartNotifications.jsx    # Context-aware notifications
│   │   │   ├── StudentLogin.jsx          # Student authentication
│   │   │   ├── TeacherDashBoard.jsx      # Teacher interface
│   │   │   ├── TeacherLogin.jsx          # Teacher authentication
│   │   │   ├── Timetable.jsx             # Schedule display
│   │   │   └── UnifiedDashboard.jsx      # Main dashboard
│   │   ├── utils/          # Utility functions
│   │   │   ├── academicGapAnalyzer.js    # Identify weak subjects
│   │   │   ├── freeTimeDetector.js       # Find schedule gaps
│   │   │   ├── peerCollaborationMatcher.js  # Match study partners
│   │   │   └── subjectUtils.js           # Subject code helpers
│   │   ├── config.js       # App configuration
│   │   ├── firebase.js     # Firebase configuration
│   │   └── main.jsx        # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   │   └── aiControllers.js  # AI analysis endpoints
│   ├── check_models.js     # Model verification script
│   ├── index.js            # Main server file
│   └── package.json
├── .gitignore
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🎯 Key Features Explained

### 1. Academic Manager
Upload your timetable, syllabus, and marking schemes. The AI automatically parses these documents and extracts structured data to power personalized recommendations.

### 2. AI Study Advisor
Based on your uploaded academic documents, get adaptive study plans that evolve with your progress. The AI considers your schedule, weak subjects, and upcoming deadlines.

### 3. Focus Timer with Smart Tracking
Track study sessions with a Pomodoro-style timer. Sessions are automatically logged and analyzed to show productivity patterns and subject-wise time allocation.

### 4. Peer Collaboration
Find study partners based on:
- Shared subjects and classes
- Similar free time slots
- Complementary strengths and weaknesses
- Real-time availability

### 5. Learning Continuity Dashboard
Monitor your academic journey with:
- Daily and weekly streaks
- Percentage of free time utilized productively
- Gaps closed vs. remaining gaps
- Weekly improvement trends
- Subject-wise performance metrics

### 6. Smart Notifications
Receive intelligent, context-aware notifications:
- Upcoming classes (15 minutes before)
- Class cancellation alerts with study suggestions
- Academic gap reminders during free time
- Peer collaboration opportunities
- Assignment deadline warnings

## 🙏 Acknowledgments

- Google Gemini AI for powering the intelligent analysis
- Firebase for authentication and database services
- The open-source community for the amazing tools and libraries

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainers.
