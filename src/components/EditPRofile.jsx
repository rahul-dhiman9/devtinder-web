import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import UserCard from "./UserCard";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../redux/userSlice";

const EditProfile = ({ user }) => {
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [skills, setSkills] = useState(
    Array.isArray(user.skills) ? user.skills.join(", ") : user.skills || "",
  );
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    type: "",
    message: "",
  });

  // Photo preview
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // Toast
  const showToast = (type, message) => {
    setToast({ show: true, type, message });

    setTimeout(() => {
      setToast({ show: false, type: "", message: "" });
    }, 3000);
  };

  // Save profile
  const saveProfile = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("age", age);
      formData.append("gender", gender);
      formData.append("skills", skills);
      formData.append("about", about);

      if (photo) {
        formData.append("photo", photo);
      }

      const res = await axios.patch(BASE_URL + "/profile/edit", formData, {
        withCredentials: true,
      });

      dispatch(addUser(res.data.data));

      showToast("success", "Profile updated successfully!");

      setPhoto(null);
      setPhotoPreview(null);
    } catch (err) {
      console.error(err);

      const message =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Something went wrong";

      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  const previewUser = {
    ...user,
    firstName,
    lastName,
    age,
    gender,
    about,
    skills,
    photoUrl: photoPreview || user.photoUrl,
  };

  return (
    <div className="flex justify-center max-h-[110vh] my-10 gap-10">
      {/* Toast */}
      {toast.show && (
        <div className="toast toast-top toast-center z-50">
          <div
            className={`alert ${
              toast.type === "success" ? "alert-success" : "alert-error"
            }`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Edit Profile */}
      <div className="card bg-base-300 w-96 shadow-sm">
        <div className="card-body pb-40">
          <h2 className="card-title justify-center">Edit Profile</h2>

          <label className="label" htmlFor="fname">
            First Name
          </label>

          <input
            id="fname"
            type="text"
            className="input w-full"
            value={firstName}
            placeholder="Enter your first name"
            onChange={(e) => setFirstName(e.target.value)}
          />

          <label className="label" htmlFor="lname">
            Last Name
          </label>

          <input
            id="lname"
            type="text"
            className="input w-full"
            value={lastName}
            placeholder="Enter your last name"
            onChange={(e) => setLastName(e.target.value)}
          />

          {/* Photo */}
          <label className="label" htmlFor="photo">
            Profile Photo
          </label>

          <input
            id="photo"
            type="file"
            accept="image/*"
            className="file-input w-full"
            onChange={handlePhotoChange}
          />

          {photo && <p className="text-sm mt-2">Selected: {photo.name}</p>}

          <label className="label" htmlFor="age">
            Age
          </label>

          <input
            id="age"
            type="number"
            className="input w-full"
            value={age}
            placeholder="Enter your age"
            onChange={(e) => setAge(e.target.value)}
          />

          <label className="label" htmlFor="gender">
            Gender
          </label>

          <select
            id="gender"
            className="select w-full"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select gender...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Others</option>
          </select>

          <label className="label" htmlFor="about">
            About
          </label>

          <textarea
            id="about"
            className="textarea w-full"
            value={about}
            placeholder="Tell us about yourself..."
            onChange={(e) => setAbout(e.target.value)}
          />

          <label className="label" htmlFor="skills">
            Skills
          </label>

          <textarea
            id="skills"
            className="textarea w-full"
            value={skills}
            placeholder="React, Node.js, MongoDB..."
            onChange={(e) => setSkills(e.target.value)}
          />

          <div className="card-actions justify-center mt-5">
            <button
              className="btn btn-primary"
              onClick={saveProfile}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <UserCard user={previewUser} />
    </div>
  );
};

export default EditProfile;
