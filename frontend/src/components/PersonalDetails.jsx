import React, { useState, useEffect } from "react";

const PersonalDetails = ({ formData, setFormData }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const form = document.querySelector("form");
    const handleFormSubmit = () => setIsSubmitted(true);
    if (form) {
      form.addEventListener("submit", handleFormSubmit);
      return () => form.removeEventListener("submit", handleFormSubmit);
    }
  }, []);

  const errors = {
    name: !formData.name ? "Full Name is required" : "",
    email: !formData.email
      ? "Email is required"
      : !/\S+@\S+\.\S+/.test(formData.email)
      ? "Email is invalid"
      : "",
    headline: !formData.headline ? "Headline is required" : "",
    location: !formData.location ? "Location is required" : "",
    phone: !formData.phone ? "Phone Number is required" : "",
    tagline: !formData.tagline ? "Tagline is required" : "",
    gender: !formData.gender ? "Please select a gender" : "",
    highestQualification: !formData.highestQualification
      ? "Highest Qualification is required"
      : "",
    experience: !formData.experience ? "Please select experience" : "",
    freelanceAvailable:
      formData.freelanceAvailable === null
        ? "Please select freelance availability"
        : "",
  };

  const shouldShowError = (field) => isSubmitted && errors[field];

  const baseInputClass = `w-full p-3 border rounded-lg focus:ring-2 focus:outline-none transition-all duration-200 text-black`;

  // Fallback image in case of broken URL
  const fallbackImage = "https://via.placeholder.com/200/374151/FFFFFF?text=Profile";

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 ease-out hover:-translate-y-1 opacity-95 hover:opacity-100">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-300">
        <span className="text-3xl text-purple-400">👤</span>
        Personal Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-1">
          <label htmlFor="personal-name" className="block text-sm font-semibold text-gray-300">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="personal-name"
            type="text"
            placeholder="e.g., John Doe"
            className={`${baseInputClass} ${
              shouldShowError("name")
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-500 focus:ring-blue-500 focus:border-blue-500"
            } placeholder-gray-400`}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            autoCapitalize="words"
          />
          {shouldShowError("name") && (
            <p className="text-red-500 text-xs mt-1 animate-fadeIn">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label htmlFor="personal-email" className="block text-sm font-semibold text-gray-300">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="personal-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="e.g., john@example.com"
            className={`${baseInputClass} ${
              shouldShowError("email")
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-500 focus:ring-blue-500 focus:border-blue-500"
            } placeholder-gray-400`}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            autoCapitalize="off"
          />
          {shouldShowError("email") && (
            <p className="text-red-500 text-xs mt-1 animate-fadeIn">{errors.email}</p>
          )}
        </div>

        {/* Headline */}
        <div className="space-y-1">
          <label htmlFor="personal-headline" className="block text-sm font-semibold text-gray-300">
            Headline <span className="text-red-500">*</span>
          </label>
          <input
            id="personal-headline"
            type="text"
            placeholder="e.g., Full Stack Developer"
            className={`${baseInputClass} ${
              shouldShowError("headline")
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-500 focus:ring-blue-500 focus:border-blue-500"
            } placeholder-gray-400`}
            value={formData.headline}
            onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
            autoCapitalize="sentences"
          />
          {shouldShowError("headline") && (
            <p className="text-red-500 text-xs mt-1 animate-fadeIn">{errors.headline}</p>
          )}
        </div>

        {/* Location */}
        <div className="space-y-1">
          <label htmlFor="personal-location" className="block text-sm font-semibold text-gray-300">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            id="personal-location"
            type="text"
            placeholder="e.g., San Francisco, CA"
            className={`${baseInputClass} ${
              shouldShowError("location")
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-500 focus:ring-blue-500 focus:border-blue-500"
            } placeholder-gray-400`}
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            autoCapitalize="words"
          />
          {shouldShowError("location") && (
            <p className="text-red-500 text-xs mt-1 animate-fadeIn">{errors.location}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label htmlFor="personal-phone" className="block text-sm font-semibold text-gray-300">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            id="personal-phone"
            type="tel"
            inputMode="tel"
            placeholder="e.g., +1 234 567 890"
            className={`${baseInputClass} ${
              shouldShowError("phone")
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-500 focus:ring-blue-500 focus:border-blue-500"
            } placeholder-gray-400`}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          {shouldShowError("phone") && (
            <p className="text-red-500 text-xs mt-1 animate-fadeIn">{errors.phone}</p>
          )}
        </div>

        {/* Tagline */}
        <div className="space-y-1">
          <label htmlFor="personal-tagline" className="block text-sm font-semibold text-gray-300">
            Tagline <span className="text-red-500">*</span>
          </label>
          <input
            id="personal-tagline"
            type="text"
            placeholder="e.g., Building apps that scale"
            className={`${baseInputClass} ${
              shouldShowError("tagline")
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-500 focus:ring-blue-500 focus:border-blue-500"
            } placeholder-gray-400`}
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            autoCapitalize="sentences"
          />
          {shouldShowError("tagline") && (
            <p className="text-red-500 text-xs mt-1 animate-fadeIn">{errors.tagline}</p>
          )}
        </div>

        {/* Profile Photo */}
        <div className="space-y-1 md:col-span-2 lg:col-span-1">
          <label className="block text-sm font-semibold text-gray-300">
            Profile Photo
          </label>
          <input
            type="url"
            placeholder="e.g., https://via.placeholder.com/200"
            className={`${baseInputClass} border-gray-500 focus:ring-blue-500 placeholder-gray-400`}
            value={formData.profilePhoto || ""}
            onChange={(e) =>
              setFormData({ ...formData, profilePhoto: e.target.value })
            }
            autoCapitalize="off"
          />
          <div className="flex items-center my-2">
            <div className="flex-1 border-t border-gray-500"></div>
            <span className="px-2 text-sm text-gray-500">or upload</span>
            <div className="flex-1 border-t border-gray-500"></div>
          </div>
          <label
            htmlFor="profile-upload"
            className="block text-sm text-gray-300 mb-1">Choose Image</label>
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            className="w-full p-2 border border-gray-500 rounded-lg text-sm text-black"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                  setFormData({ ...formData, profilePhoto: reader.result });
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          {formData.profilePhoto && (
            <div className="mt-3">
              <img
                src={formData.profilePhoto}
                alt="Profile preview"
                onError={(e) => {
                  e.target.src = fallbackImage; // fallback to placeholder
                  e.onerror = null; // prevent infinite loop
                }}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 shadow-sm"
              />
            </div>
          )}
        </div>

        {/* Gender */}
        <div className="space-y-1">
          <label htmlFor="personal-gender" className="block text-sm font-semibold text-gray-300">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            id="personal-gender"
            className={`w-full p-3 text-black border rounded-lg focus:ring-2 focus:outline-none transition-all duration-200 ${
              shouldShowError("gender")
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-500 focus:ring-blue-500 focus:border-blue-500"
            }`}
            value={formData.gender}
            onChange={(e) =>
              setFormData({ ...formData, gender: e.target.value })
            }
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
          {shouldShowError("gender") && (
            <p className="text-red-500 text-xs mt-1 animate-fadeIn">{errors.gender}</p>
          )}
        </div>

        {/* Highest Qualification */}
        <div className="space-y-1">
          <label
            htmlFor="personal-qualification"
            className="block text-sm font-semibold text-gray-300"
          >
            Highest Qualification <span className="text-red-500">*</span>
          </label>
          <input
            id="personal-qualification"
            type="text"
            placeholder="e.g., B.Tech in Computer Science"
            className={`${baseInputClass} ${
              shouldShowError("highestQualification")
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-500 focus:ring-blue-500 focus:border-blue-500"
            } placeholder-gray-400`}
            value={formData.highestQualification}
            onChange={(e) =>
              setFormData({ ...formData, highestQualification: e.target.value })
            }
            autoCapitalize="words"
          />
          {shouldShowError("highestQualification") && (
            <p className="text-red-500 text-xs mt-1 animate-fadeIn">
              {errors.highestQualification}
            </p>
          )}
        </div>

        {/* Experience */}
        <div className="space-y-1">
          <label
            htmlFor="personal-experience"
            className="block text-sm font-semibold text-gray-300"
          >
            Experience <span className="text-red-500">*</span>
          </label>
          <select
            id="personal-experience"
            className={`w-full p-3 text-black border rounded-lg focus:ring-2 focus:outline-none transition-all duration-200 ${
              shouldShowError("experience")
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-500 focus:ring-blue-500 focus:border-blue-500"
            }`}
            value={formData.experience}
            onChange={(e) =>
              setFormData({ ...formData, experience: e.target.value })
            }
          >
            <option value="">Select Experience</option>
            <option value="Fresher">Fresher</option>
            <option value="1 year">1 year</option>
            <option value="2 years">2 years</option>
            <option value="3+ years">3+ years</option>
          </select>
          {shouldShowError("experience") && (
            <p className="text-red-500 text-xs mt-1 animate-fadeIn">
              {errors.experience}
            </p>
          )}
        </div>

        {/* Freelance */}
        <div className="space-y-1">
          <label
            htmlFor="personal-freelance"
            className="block text-sm font-semibold text-gray-300"
          >
            Freelance <span className="text-red-500">*</span>
          </label>
          <select
            id="personal-freelance"
            className={`w-full p-3 text-black border rounded-lg focus:ring-2 focus:outline-none transition-all duration-200 ${
              shouldShowError("freelanceAvailable")
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-500 focus:ring-blue-500 focus:border-blue-500"
            }`}
            value={
              formData.freelanceAvailable === null
                ? ""
                : formData.freelanceAvailable.toString()
            }
            onChange={(e) =>
              setFormData({
                ...formData,
                freelanceAvailable: e.target.value === "true",
              })
            }
          >
            <option value="">Select</option>
            <option value="true">Available</option>
            <option value="false">Not Available</option>
          </select>
          {shouldShowError("freelanceAvailable") && (
            <p className="text-red-500 text-xs mt-1 animate-fadeIn">
              {errors.freelanceAvailable}
            </p>
          )}
        </div>

        {/* Resume Upload */}
        <div className="space-y-1 md:col-span-2">
          <label className="block text-sm font-semibold text-gray-300">
            Upload Resume (PDF or DOCX)
          </label>
          <label
            htmlFor="resume-upload"
            className="block text-sm text-gray-300 mb-1">Choose File</label>
          <input
            id="resume-upload"
            type="file"
            accept=".pdf,.doc,.docx"
            className="w-full p-3 border border-gray-500 rounded-lg text-sm text-black"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const validTypes = [
                "application/pdf",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
                "application/msword", // .doc
              ];

              if (!validTypes.includes(file.type)) {
                alert("Please upload a valid PDF or DOCX file.");
                return;
              }

              const reader = new FileReader();
              reader.onload = () => {
                setFormData({ ...formData, resume: reader.result });
              };
              reader.readAsDataURL(file);
            }}
          />
          {formData.resume && (
            <div className="mt-2">
              <a
                href={formData.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline text-sm flex items-center gap-1"
              >
                📄 View Uploaded Resume
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;