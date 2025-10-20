import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Github,
  Linkedin,
  FileText,
  Award,
  Code,
  Calendar,
  Edit,
  ExternalLink,
  X,
  Camera,
  Briefcase,
} from "lucide-react";
import { profileService } from "../../services/profile.service";
import { useTheme } from "../../contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  const { isDark } = useTheme();

  useEffect(() => {
    document.body.classList.toggle("modal-open", isOpen);
    return () => document.body.classList.remove("modal-open");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 ${
        isDark ? "bg-black/70" : "bg-black/60"
      } backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn`}
    >
      <div
        className={`rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform animate-slideUp ${
          isDark ? "bg-slate-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        <div
          className={`sticky top-0 border-b ${
            isDark ? "bg-slate-900 border-gray-700" : "bg-white border-gray-100"
          } px-6 py-4 rounded-t-2xl`}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Edit Profile</h3>
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors duration-200 ${
                isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Profile Edit Form Component
const ProfileEditForm = ({ profile, onUpdate, onClose, onOpenDeleteModal }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: profile.name || "",
    bio: profile.bio || "",
    linkedin: profile.linkedin || "",
    github: profile.github || "",
    cv_url: profile.cv_url || "",
  });
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    const updatedData = {
      ...formData,
    };

    // Remove empty or unchanged fields
    const cleanedData = {};
    Object.keys(updatedData).forEach((key) => {
      if (
        updatedData[key] &&
        (Array.isArray(updatedData[key])
          ? updatedData[key].length > 0
          : updatedData[key] !== "")
      ) {
        cleanedData[key] = updatedData[key];
      }
    });

    console.log("CleanedData:", cleanedData);

    try {
      const token = localStorage.getItem("token");
      const response = await profileService.updateProfile(token, cleanedData);
      console.log("Response:", response.data);
      if (response.status >= 200 && response.status < 300) {
        onUpdate(response.data);
      } else {
        setErrors(
          response.data?.details || [
            response.data?.error || "Failed to update profile",
          ]
        );
      }
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      setErrors([
        err.response?.data?.error || err.message || "Failed to update profile",
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field) => (e) =>
    setFormData({ ...formData, [field]: e.target.value });

  const inputFields = [
    { id: "name", label: "Name", type: "text" },
    { id: "bio", label: "Bio", type: "textarea", rows: 3 },
    { id: "linkedin", label: "LinkedIn URL", type: "text" },
    { id: "github", label: "GitHub URL", type: "text" },
    { id: "cv_url", label: "CV URL", type: "text" },
  ];

  return (
    <div className="space-y-6">
      {errors.length > 0 && (
        <div
          className={`border rounded-xl p-4 ${
            isDark ? "bg-red-900/50 border-red-700" : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-center mb-2">
            <X className="w-5 h-5 text-red-500 mr-2" />
            <p
              className={`font-semibold ${
                isDark ? "text-red-300" : "text-red-700"
              }`}
            >
              Please fix the following errors:
            </p>
          </div>
          <ul className="list-disc ml-7 space-y-1">
            {errors.map((error, i) => (
              <li
                key={i}
                className={`text-sm ${
                  isDark ? "text-red-400" : "text-red-600"
                }`}
              >
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-6">
        {inputFields.map(({ id, label, type, rows }) => (
          <div key={id} className="space-y-2">
            <label
              htmlFor={id}
              className={`block text-sm font-semibold ${
                isDark ? "text-gray-300" : "text-gray-700"
              } mb-2`}
            >
              {label}
            </label>
            {type === "textarea" ? (
              <textarea
                id={id}
                value={formData[id]}
                onChange={handleChange(id)}
                rows={rows}
                className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none ${
                  isDark
                    ? "bg-slate-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                placeholder={`Enter your ${label.toLowerCase()}...`}
              />
            ) : (
              <input
                id={id}
                value={formData[id]}
                onChange={handleChange(id)}
                className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                  isDark
                    ? "bg-slate-800 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
                placeholder={`Enter your ${label.toLowerCase()}...`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
        <button
          type="button"
          onClick={onClose}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
            isDark
              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center ${
            isDark
              ? "inline-flex items-center px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-purple-700 hover:to-blue-700"
              : "bg-gradient-to-r from-blue-600 to-pink-600 text-white hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Edit className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>
      {/* Danger Zone */}
      <div className="mt-8 pt-6 border-t border-gray-700">
        <div className="text-center">
          <h3 className={`text-lg font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            Danger Zone
          </h3>
          <p className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button
            type="button"
            onClick={onOpenDeleteModal}
            className={`inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
              isDark
                ? "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800"
                : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
            }`}
          >
            <X className="w-4 h-4 mr-2" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, isDark, isDeleting }) => {
  useEffect(() => {
    document.body.classList.toggle("modal-open", isOpen);
    return () => document.body.classList.remove("modal-open");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 ${
        isDark ? "bg-black/70" : "bg-black/60"
      } backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn`}
    >
      <div
        className={`rounded-2xl max-w-md w-full shadow-2xl transform animate-slideUp ${
          isDark ? "bg-slate-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isDark ? "bg-red-900/30" : "bg-red-100"
            }`}>
              <X className="w-8 h-8 text-red-500" />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-center mb-2">Delete Account?</h3>
          <p className={`text-center mb-6 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}>
            This action cannot be undone. All your data, including your profile, portfolio, and settings will be permanently deleted.
          </p>

          <div className="space-y-3">
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className={`w-full px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center ${
                isDeleting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
              }`}
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Deleting Account...
                </>
              ) : (
                <>
                  <X className="w-5 h-5 mr-2" />
                  Yes, Delete My Account
                </>
              )}
            </button>
            
            <button
              onClick={onClose}
              disabled={isDeleting}
              className={`w-full px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                isDark
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } ${isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileSection = () => {
  const { isDark } = useTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profilePictureError, setProfilePictureError] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [isDeleting, setIsDeleting] = useState(false);
const [deleteError, setDeleteError] = useState(null);
  // Initialize profile image from localStorage
  useEffect(() => {
    const imageUrl = localStorage.getItem("imageURL");
    if (imageUrl) {
      setProfileImage(imageUrl);
    }
  }, []);

  // Fetch profile data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await profileService.getProfile(token);
        setProfile(response.data);
      } catch (err) {
        setError(
          err.response?.data?.error || err.message || "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file); // Debug
    if (!file) return;

    const token = localStorage.getItem("token");
    if (!token) return setProfilePictureError("User not logged in");

    let tempUrl = null;
    try {
      setUploading(true);
      setProfilePictureError(null);

      tempUrl = URL.createObjectURL(file);
      setProfileImage(tempUrl);

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error("Only JPEG, PNG, WebP, and GIF images are allowed");
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size too large. Maximum size is 5MB");
      }

      const formData = new FormData();
      formData.append("profilePicture", file);
      console.log("FormData:", [...formData.entries()]); // Debug

      const response = await profileService.uploadProfilePicture(formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response:", response.data); // Debug
      if (response.data && response.data.profile_picture_url) {
        const newUrl = response.data.profile_picture_url;
        localStorage.setItem("imageURL", newUrl);
        setProfileImage(newUrl);
      } else {
        throw new Error("Failed to get new profile picture URL");
      }
    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
      setProfilePictureError(err.message || "Failed to upload profile picture");
      const oldUrl = localStorage.getItem("imageURL");
      setProfileImage(oldUrl);
    } finally {
      setUploading(false);
      if (tempUrl) URL.revokeObjectURL(tempUrl);
      e.target.value = null;
    }
  };

const handleDeleteAccount = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    setDeleteError("User not logged in");
    return;
  }

  try {
    setIsDeleting(true);
    setDeleteError(null);

    await profileService.deleteProfile(token);

    // Clear all local storage
    localStorage.removeItem("token");
    localStorage.removeItem("imageURL");
    localStorage.clear();

    // Redirect to home page
    navigate("/");
  } catch (err) {
    console.error("Delete account error:", err.response?.data || err.message);
    setDeleteError(
      err.response?.data?.error || err.message || "Failed to delete account"
    );
    setIsDeleting(false);
    setIsDeleteModalOpen(false);
  }
};
  
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div
          className={`border rounded-lg p-4 ${
            isDark ? "bg-red-900/50 border-red-700" : "bg-red-50 border-red-200"
          }`}
        >
          <p
            className={`font-medium ${
              isDark ? "text-red-300" : "text-red-600"
            }`}
          >
            Error loading profile
          </p>
          <p
            className={`text-sm mt-1 ${
              isDark ? "text-red-400" : "text-red-500"
            }`}
          >
            {error}
          </p>
        </div>
      </div>
    );

  if (!profile) return null;

  const portfolioPlaceholders = [
    {
      theme: "space",
      title: "Space themed Portfolio",
      image: "../../../public/images/space.png",
      link: "/space",
      route: "/space",
    },
    {
      theme: "forest",
      title: "Forest themed Portfolio",
      image: "../../../public/images/forest.png",
      link: "/forest",
      route: "/forest",
    },
    {
      theme: "office",
      title: "Office themed Portfolio",
      image: "../../../public/images/office.png",
      link: "/office",
      route: "/office",
    },
    {
      theme: "lab",
      title: "Lab themed Portfolio",
      image: "../../../public/images/lab.png",
      link: "/lab",
      route: "/lab",
    },
    {
      theme: "Cave",
      title: "Cave themed Portfolio",
      image: "../../../public/images/cave.png",
      link: "/cave",
      route: "/cave",
    },
  ];

  const selectedTemplate = portfolioPlaceholders.find(
    (template) => template.theme === profile.selected_template
  );
  
  

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950"
          : "bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100"
      }`}
    >
      <div className="max-w-7xl mx-auto p-6">
        {profilePictureError && (
          <div
            className={`fixed top-4 right-4 rounded-lg shadow-lg z-50 animate-slideIn ${
              isDark ? "bg-red-900/80 text-red-200" : "bg-red-500 text-white"
            } px-6 py-4`}
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <X className="w-5 h-5" />
              </div>
              <span className="font-medium">{profilePictureError}</span>
              <button
                className={`rounded-full p-1 transition-colors ${
                  isDark ? "hover:bg-red-800" : "hover:bg-red-600"
                }`}
                onClick={() => setProfilePictureError(null)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Profile */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Header */}
            <div
              className={`rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300 ${
                isDark ? "bg-slate-800" : "bg-white"
              }`}
            >
              <div className="relative">
                <div
                  className={`h-40 relative ${
                    isDark
                      ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"
                      : "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500"
                  }`}
                >
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute -bottom-20 left-8">
                    <div className="relative group">
                      <div
                        className={`w-40 h-40 rounded-full border-6 border-white shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 ${
                          isDark ? "bg-slate-700" : "bg-gray-100"
                        }`}
                      >
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div
                            className={`w-full h-full rounded-full flex items-center justify-center text-3xl font-bold ${
                              isDark
                                ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
                                : "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                            }`}
                          >
                            {profile.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                        )}
                      </div>
                      <label
                        htmlFor="profile-picture-upload"
                        className={`absolute -bottom-2 -right-2 rounded-full p-3 cursor-pointer hover:scale-110 transition-all duration-200 shadow-lg group-hover:shadow-xl ${
                          isDark
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                        title="Change profile picture"
                      >
                        <Camera className="w-5 h-5 text-white" />
                        <input
                          id="profile-picture-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleProfilePictureUpload}
                          disabled={uploading}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="pt-24 px-8 pb-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    <div className="flex-1">
                      <h1
                        className={`text-4xl font-bold mb-2 ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {profile.name}
                      </h1>
                      {profile.bio && (
                        <p
                          className={`text-xl mb-3 leading-relaxed ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {profile.bio}
                        </p>
                      )}
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          Member since {formatDate(profile.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
  <button
    onClick={() => setIsModalOpen(true)}
    className={`inline-flex items-center px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
      isDark
        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-purple-700 hover:to-blue-700"
        : "bg-gradient-to-r from-blue-600 to-pink-600 text-white hover:from-purple-700 hover:to-blue-700"
    }`}
  >
    <Edit className="w-5 h-5 mr-2" />
    Edit Profile
  </button>
  
  {/* <button
    onClick={() => setIsDeleteModalOpen(true)}
    className={`inline-flex items-center px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
      isDark
        ? "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800"
        : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
    }`}
  >
    <X className="w-5 h-5 mr-2" />
    Delete Account
  </button> */}
</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div
              className={`rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-all duration-300 ${
                isDark ? "bg-slate-800" : "bg-white"
              }`}
            >
              <h2
                className={`text-2xl font-bold mb-6 flex items-center ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                    isDark
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                      : "bg-gradient-to-r from-blue-500 to-purple-500"
                  }`}
                >
                  <Mail className="w-4 h-4 text-white" />
                </div>
                Contact Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    icon: Mail,
                    label: "Email",
                    value: profile.email,
                    href: `mailto:${profile.email}`,
                    text: "Send Email",
                    color: isDark
                      ? "from-blue-600 to-indigo-600"
                      : "from-blue-500 to-blue-600",
                  },
                  {
                    icon: Github,
                    label: "GitHub",
                    value: profile.github,
                    href: profile.github,
                    text: "View Profile",
                    color: isDark
                      ? "from-gray-700 to-gray-800"
                      : "from-gray-700 to-gray-800",
                  },
                  {
                    icon: Linkedin,
                    label: "LinkedIn",
                    value: profile.linkedin,
                    href: profile.linkedin,
                    text: "Connect",
                    color: isDark
                      ? "from-blue-700 to-indigo-700"
                      : "from-blue-600 to-blue-700",
                  },
                  {
                    icon: FileText,
                    label: "Resume/CV",
                    value: profile.cv_url,
                    href: profile.cv_url,
                    text: "Download CV",
                    color: isDark
                      ? "from-green-600 to-teal-600"
                      : "from-green-500 to-green-600",
                  },
                  {
                    icon: ExternalLink,
                    label: "Portfolio Website",
                    value: selectedTemplate ? `${selectedTemplate.theme} Portfolio` : "No portfolio deployed",
                    href: selectedTemplate ? `/${selectedTemplate.theme.toLowerCase()}` : undefined,
                    text: selectedTemplate ? "View Portfolio" : "Deploy Portfolio",
                    color: isDark
                      ? "from-purple-600 to-violet-600"
                      : "from-purple-500 to-purple-600",
                  },
                ]
                  .filter((item) => item.value || item.label === "Portfolio Website")
                  .map(({ icon: Icon, label, value, href, text, color }) => (
                    <div key={label} className="group">
                      <div
                        className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 ${
                          isDark
                            ? "bg-slate-700/50 hover:bg-slate-700"
                            : "bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        <div
                          className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p
                            className={`text-sm font-medium uppercase tracking-wide ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {label}
                          </p>
                          {href ? (
                            <a
                              href={href}
                              target={label !== "Email" && label !== "Portfolio Website" ? "_blank" : undefined}
                              rel={
                                label !== "Email" && label !== "Portfolio Website"
                                  ? "noopener noreferrer"
                                  : undefined
                              }
                              className={`font-medium transition-colors duration-200 flex items-center group ${
                                isDark
                                  ? "text-gray-200 hover:text-blue-400"
                                  : "text-gray-900 hover:text-blue-600"
                              }`}
                            >
                              {text}
                              <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            </a>
                          ) : (
                            <button
                              onClick={() => navigate('/templates')}
                              className={`font-medium transition-colors duration-200 flex items-center group ${
                                isDark
                                  ? "text-gray-200 hover:text-blue-400"
                                  : "text-gray-900 hover:text-blue-600"
                              }`}
                            >
                              {text}
                              <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Right Column - Portfolio */}
          <div className="space-y-8">
            {/* Portfolio Websites */}
            <div
              className={`rounded-2xl shadow-xl p-8 transform hover:scale-[1.02] transition-all duration-300 ${
                isDark ? "bg-slate-800" : "bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-8">
                <h2
                  className={`text-2xl font-bold flex items-center ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Portfolio Website
                </h2>
                <span
                  className={`text-sm rounded-full px-3 py-1 ${
                    isDark
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {selectedTemplate ? "1 Template" : "0 Templates"}
                </span>
              </div>
              <div className="grid gap-6">
                {selectedTemplate ? (
                  <div className="group relative cursor-pointer">
                    <div
                      className={`relative overflow-hidden rounded-xl shadow-lg ${
                        isDark ? "bg-slate-700/50" : "bg-gray-100"
                      }`}
                    >
                      <img
                        src={selectedTemplate.image}
                        alt={selectedTemplate.title}
                        className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div
                        className={`absolute inset-0 transition-all duration-300 group-hover:opacity-100 opacity-0 ${
                          isDark
                            ? "bg-gradient-to-t from-black/70 via-transparent to-transparent"
                            : "bg-gradient-to-t from-black/60 via-transparent to-transparent"
                        }`}
                        onClick={() => navigate(selectedTemplate.route)} style={{ cursor: "pointer" }}
                      >
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center justify-between text-white">
                            <div>
                              <h3 className="font-bold text-lg">
                                {selectedTemplate.title}
                              </h3>
                            </div>
                            <div
                              className={`rounded-full p-2 ${
                                isDark ? "bg-white/20" : "bg-white/20"
                              } backdrop-blur-sm`}
                            >
                              <ExternalLink className="w-5 h-5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 px-2">
                      <h3
                        className={`font-semibold transition-colors duration-200 ${
                          isDark
                            ? "text-gray-200 group-hover:text-blue-400"
                            : "text-gray-900 group-hover:text-blue-600"
                        }`}
                      >
                        {selectedTemplate.title}
                      </h3>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`text-center py-12 rounded-xl ${
                      isDark
                        ? "bg-slate-700/50 text-gray-400"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <p className="text-lg mb-4">
                      No portfolio template selected
                    </p>
                    <button
                      className={`inline-flex items-center px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                        isDark
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                          : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                      }`}
                    >
                      Select Template
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
  <ProfileEditForm
    profile={profile}
    onUpdate={(updatedProfile) => {
      setProfile(updatedProfile);
      setIsModalOpen(false);
    }}
    onClose={() => setIsModalOpen(false)}
    onOpenDeleteModal={() => {
      setIsModalOpen(false);
      setIsDeleteModalOpen(true);
    }}
  />
</Modal>

      {/* Delete Error Alert */}
      {deleteError && (
        <div
          className={`fixed top-4 right-4 rounded-lg shadow-lg z-50 animate-slideIn ${
            isDark ? "bg-red-900/80 text-red-200" : "bg-red-500 text-white"
          } px-6 py-4 max-w-md`}
        >
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <X className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Failed to delete account</p>
              <p className="text-sm mt-1">{deleteError}</p>
            </div>
            <button
              className={`rounded-full p-1 transition-colors ${
                isDark ? "hover:bg-red-800" : "hover:bg-red-600"
              }`}
              onClick={() => setDeleteError(null)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        isDark={isDark}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ProfileSection;
