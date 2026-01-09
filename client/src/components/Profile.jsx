import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
// Removed Firebase Storage imports to fix CORS issue
import { 
  User, Mail, Phone, MapPin, Calendar, 
  BookOpen, Award, Target, Users,
  Edit2, Save, X, Camera, Loader2
} from "lucide-react";

export default function Profile({ isDark, userType = 'student' }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [editForm, setEditForm] = useState({});
  const fileInputRef = useRef(null);

  const cardClass = isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const textClass = isDark ? "text-white" : "text-gray-900";
  const mutedTextClass = isDark ? "text-gray-300" : "text-gray-600";
  const inputClass = `w-full px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:ring-2 focus:ring-blue-500 outline-none transition-all`;

  useEffect(() => {
    if (!auth.currentUser) return;

    const userRef = doc(db, "users", auth.currentUser.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setUser(userData);
        setEditForm({
          name: userData.name || "",
          phone: userData.phone || "",
          location: userData.location || "",
          major: userData.major || userData.department || "",
          year: userData.year || userData.position || "",
          gpa: userData.gpa || userData.experience || "",
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      setEditForm({
        name: user.name || "",
        phone: user.phone || "",
        location: user.location || "",
        major: user.major || user.department || "",
        year: user.year || user.position || "",
        gpa: user.gpa || user.experience || "",
      });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      
      const updates = {
        name: editForm.name,
        phone: editForm.phone,
        location: editForm.location,
      };

      if (userType === 'teacher') {
        updates.department = editForm.major;
        updates.position = editForm.year;
        updates.experience = editForm.gpa;
      } else {
        updates.major = editForm.major;
        updates.year = editForm.year;
        updates.gpa = editForm.gpa;
      }

      await updateDoc(userRef, updates);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to save profile changes.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- UPDATED IMAGE UPLOAD FUNCTION (Uses Cloudinary via Backend) ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setUploadingImg(true);
    try {
      // 1. Prepare FormData
      const formData = new FormData();
      formData.append("file", file);

      // 2. Send to your Backend (which handles Cloudinary)
      const API_URL = import.meta.env.VITE_API_URL || "${API_BASE_URL}";
      const response = await fetch(`${API_URL}/api/upload-profile`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed on server");

      const data = await response.json();
      const photoURL = data.url;

      // 3. Update Firestore with new URL
      await updateDoc(doc(db, "users", auth.currentUser.uid), { photoURL });
      
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload profile picture. Check server console.");
    } finally {
      setUploadingImg(false);
      if(fileInputRef.current) fileInputRef.current.value = ""; // Reset input
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse">Loading profile...</div>;
  if (!user) return <div className="p-10 text-center">No profile found. Please update your settings.</div>;

  const displayData = {
    name: user.name || "User",
    email: user.email || auth.currentUser.email,
    phone: user.phone || "Not provided",
    location: user.location || "Not provided",
    joinDate: user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : "Recently",
    major: user.major || user.department || "General Studies",
    year: user.year || user.position || "N/A",
    gpa: user.gpa || user.experience || "N/A",
    students: user.students || 0,
    courses: user.courses || user.subjects || [],
    achievements: user.achievements || [],
    goals: user.goals || [],
    photoURL: user.photoURL || null
  };

  return (
    <div className="space-y-6 min-h-screen pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center overflow-hidden border-4 ${isDark ? 'border-gray-700 bg-blue-500' : 'border-white shadow-lg bg-blue-600'}`}>
              {displayData.photoURL ? (
                <img src={displayData.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
            </div>
            
            {/* Image Upload Overlay */}
            <button 
              onClick={() => fileInputRef.current?.click()}
              className={`absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ${uploadingImg ? 'opacity-100' : ''}`}
            >
              {uploadingImg ? (
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              ) : (
                <Camera className="w-8 h-8 text-white" />
              )}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImg}
            />
          </div>

          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <input 
                  type="text" 
                  name="name"
                  value={editForm.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className={`${inputClass} text-xl font-bold`}
                />
              </div>
            ) : (
              <>
                <h1 className={`text-3xl font-bold ${textClass}`}>{displayData.name}</h1>
                <p className={`text-lg ${mutedTextClass}`}>
                  {userType === 'teacher' ? `${displayData.year} • ${displayData.major}` : `${displayData.major} • ${displayData.year}`}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Edit Actions */}
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button 
                onClick={handleEditToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                disabled={isSaving}
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </>
          ) : (
            <button 
              onClick={handleEditToggle}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
            >
              <Edit2 className="w-4 h-4" /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Personal Information */}
      <div className={`p-6 rounded-xl border ${cardClass}`}>
        <h2 className={`text-xl font-semibold mb-6 ${textClass}`}>Personal Information</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <InfoItem 
            icon={<Mail />} 
            label="Email" 
            value={displayData.email} 
            readOnly={true} 
            {...{mutedTextClass, textClass}} 
          />
          <InfoItem 
            icon={<Phone />} 
            label="Phone" 
            value={isEditing ? editForm.phone : displayData.phone} 
            isEditing={isEditing}
            name="phone"
            onChange={handleInputChange}
            placeholder="+1 234 567 8900"
            inputClass={inputClass}
            {...{mutedTextClass, textClass}} 
          />
          <InfoItem 
            icon={<MapPin />} 
            label="Location" 
            value={isEditing ? editForm.location : displayData.location} 
            isEditing={isEditing}
            name="location"
            onChange={handleInputChange}
            placeholder="City, Country"
            inputClass={inputClass}
            {...{mutedTextClass, textClass}} 
          />
          <InfoItem 
            icon={<Calendar />} 
            label="Joined" 
            value={displayData.joinDate} 
            readOnly={true} 
            {...{mutedTextClass, textClass}} 
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className={`p-6 rounded-xl border ${cardClass}`}>
        <h2 className={`text-xl font-semibold mb-6 ${textClass}`}>
          {userType === 'teacher' ? 'Professional Information' : 'Academic Information'}
        </h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <EditableStatItem 
            label={userType === 'teacher' ? 'Experience' : 'GPA'} 
            value={isEditing ? editForm.gpa : displayData.gpa} 
            isEditing={isEditing}
            name="gpa"
            onChange={handleInputChange}
            placeholder="0.0"
            {...{textClass, mutedTextClass, inputClass}} 
          />
          <EditableStatItem 
            label={userType === 'teacher' ? 'Students' : 'Year'} 
            value={userType === 'teacher' && !isEditing ? displayData.students : (isEditing ? editForm.year : displayData.year)} 
            isEditing={isEditing && userType !== 'teacher'} 
            name="year"
            onChange={handleInputChange}
            placeholder="Year/Position"
            {...{textClass, mutedTextClass, inputClass}} 
          />
          <EditableStatItem 
            label={userType === 'teacher' ? 'Department' : 'Major'} 
            value={isEditing ? editForm.major : displayData.major} 
            isEditing={isEditing}
            name="major"
            onChange={handleInputChange}
            placeholder="Department/Major"
            {...{textClass, mutedTextClass, inputClass}} 
          />
        </div>

        <h3 className={`text-lg font-semibold mb-4 ${textClass}`}>
          {userType === 'teacher' ? 'Current Subjects' : 'Current Courses'}
        </h3>
        <div className="space-y-3">
          {displayData.courses.length > 0 ? displayData.courses.map((item, index) => (
            <div key={index} className={`flex justify-between items-center p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                {userType === 'teacher' ? <Users className="text-blue-500" /> : <BookOpen className="text-blue-500" />}
                <div>
                  <p className={`font-medium ${textClass}`}>{item.code}</p>
                  <p className={`text-sm ${mutedTextClass}`}>{item.name}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-sm font-medium ${userType === 'teacher' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                {userType === 'teacher' ? `${item.students} students` : item.grade}
              </span>
            </div>
          )) : (
            <p className={`text-sm italic ${mutedTextClass}`}>No courses enrolled yet.</p>
          )}
        </div>
      </div>

      {/* Achievements & Goals */}
      <ListSection 
        title="Achievements" 
        icon={<Award className="text-yellow-500" />} 
        items={displayData.achievements} 
        {...{cardClass, textClass, isDark}} 
      />
      <ListSection 
        title={userType === 'teacher' ? 'Professional Goals' : 'Academic Goals'} 
        icon={<Target className="text-green-500" />} 
        items={displayData.goals} 
        {...{cardClass, textClass, isDark}} 
      />
    </div>
  );
}

// Sub-components

function InfoItem({ icon, label, value, mutedTextClass, textClass, isEditing, onChange, name, placeholder, inputClass, readOnly }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1">
        {React.cloneElement(icon, { className: "w-5 h-5 text-blue-500" })}
      </div>
      <div className="flex-1">
        <p className={`text-sm mb-1 ${mutedTextClass}`}>{label}</p>
        {isEditing && !readOnly ? (
          <input 
            type="text" 
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={inputClass}
          />
        ) : (
          <p className={`${textClass} font-medium min-h-[1.5rem]`}>{value}</p>
        )}
      </div>
    </div>
  );
}

function EditableStatItem({ value, label, textClass, mutedTextClass, isEditing, onChange, name, placeholder, inputClass }) {
  return (
    <div className="text-center">
      {isEditing ? (
        <input 
          type="text" 
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${inputClass} text-center font-bold`}
        />
      ) : (
        <p className={`text-2xl font-bold ${textClass}`}>{value}</p>
      )}
      <p className={`text-sm mt-1 ${mutedTextClass}`}>{label}</p>
    </div>
  );
}

function ListSection({ title, icon, items, cardClass, textClass, isDark }) {
  return (
    <div className={`p-6 rounded-xl border ${cardClass}`}>
      <h2 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${textClass}`}>{icon} {title}</h2>
      <div className="space-y-3">
        {items.length > 0 ? items.map((item, index) => (
          <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            {icon}
            <p className={textClass}>{item}</p>
          </div>
        )) : (
          <p className={`text-sm opacity-60 ${textClass}`}>No items listed.</p>
        )}
      </div>
    </div>
  );
}