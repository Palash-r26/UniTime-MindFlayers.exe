import React, { useState, useEffect } from "react";
import { db, auth, storage } from "../firebase"; // Ensure storage is exported in firebase.js
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import {
  Calendar,
  Upload,
  Clock,
  MapPin,
  X,
  ChevronDown,
  ChevronUp,
  FileText
} from "lucide-react";

const Timetable = ({ isDark }) => {
  const [uploadedTimetable, setUploadedTimetable] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showTimetable, setShowTimetable] = useState(true);
  const [classes, setClasses] = useState([]);

  // 1. Listen for Real-time Class Data
  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "timetable"),
      where("userId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const classList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setClasses(classList);
    });

    return () => unsubscribe();
  }, []);

  // 2. Handle Actual Firebase Storage Upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !auth.currentUser) return;

    setUploading(true);
    const storageRef = ref(storage, `timetables/${auth.currentUser.uid}/${file.name}`);
    
    try {
      const uploadTask = await uploadBytesResumable(storageRef, file);
      const url = await getDownloadURL(uploadTask.ref);
      
      // Store reference in state (you could also save this URL to Firestore)
      setUploadedTimetable({ name: file.name, url: url });
      alert("Timetable uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload file.");
    } finally {
      setUploading(false);
    }
  };

  const removeTimetable = async () => {
    if (!uploadedTimetable || !auth.currentUser) return;
    
    const storageRef = ref(storage, `timetables/${auth.currentUser.uid}/${uploadedTimetable.name}`);
    try {
      await deleteObject(storageRef);
      setUploadedTimetable(null);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const theme = isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900";
  const card = isDark ? "bg-white/10 border-white/20" : "bg-white border-gray-200";

  return (
    <div className={`min-h-screen transition-colors ${theme}`}>
      <header className={`sticky top-0 z-50 border-b ${isDark ? "bg-gray-900/80 border-white/10" : "bg-white border-gray-200"} backdrop-blur`}>
        <div className="flex justify-between items-center px-6 py-4">
          <div>
            <h1 className="text-xl font-bold">UniTime</h1>
            <p className="text-sm opacity-70">Dynamic Timetable</p>
          </div>
        </div>
      </header>

      <main className="px-6 py-8 max-w-5xl mx-auto">
        <div className={`rounded-xl border ${card}`}>
          <button onClick={() => setShowTimetable(!showTimetable)} className="w-full px-6 py-4 flex justify-between items-center">
            <span className="flex items-center gap-2 font-semibold">
              <Calendar /> Class Schedule
            </span>
            {showTimetable ? <ChevronUp /> : <ChevronDown />}
          </button>

          {showTimetable && (
            <div className="px-6 pb-6 space-y-6">
              {/* Upload Section */}
              <div className={`p-4 rounded-lg border-2 border-dashed ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                <div className="text-center">
                  <Upload className={`mx-auto h-8 w-8 mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <p className="text-sm font-medium mb-2">
                    {uploading ? "Uploading to Firebase..." : "Upload Your Timetable"}
                  </p>
                  
                  {!uploadedTimetable ? (
                    <label className="inline-flex items-center px-4 py-2 rounded-lg cursor-pointer font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                      <input type="file" onChange={handleFileUpload} className="hidden" accept=".pdf,.png,.jpg" />
                    </label>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <a href={uploadedTimetable.url} target="_blank" rel="noreferrer" className="flex items-center text-sm font-medium text-blue-500 hover:underline">
                        <FileText className="w-4 h-4 mr-1" /> {uploadedTimetable.name}
                      </a>
                      <button onClick={removeTimetable} className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900">
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Classes from Firestore */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Weekly Attendance Tracking
                </h4>
                <div className="space-y-2">
                  {classes.length > 0 ? classes.map((cls) => (
                    <div key={cls.id} className={`p-3 rounded-lg border ${
                      cls.attended 
                        ? isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'
                        : isDark ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${cls.attended ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <span className="font-medium">{cls.subject}</span>
                          </div>
                          <div className="text-sm opacity-70 mt-1">{cls.day} • {cls.time}</div>
                        </div>
                        <div className="flex items-center gap-1 text-sm opacity-70">
                          <MapPin className="w-4 h-4" /> {cls.room}
                        </div>
                      </div>
                    </div>
                  )) : (
                    <p className="text-center py-4 opacity-50">No classes scheduled in database.</p>
                  )}
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