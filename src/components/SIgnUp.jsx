import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [skills, setSkills] = useState("");
  const [about, setAbout] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Image select
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSignup = async () => {
    try {
      setLoading(true);
      setError("");

      const formData = new FormData();

      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("emailId", emailId);
      formData.append("password", password);
      formData.append("age", age);
      formData.append("gender", gender);
      formData.append("skills", skills);
      formData.append("about", about);

      if (photo) {
        formData.append("photo", photo);
      }

      const res = await axios.post(BASE_URL + "/signup", formData, {
        withCredentials: true,
      });

      console.log(res.data);

      navigate("/login");
    } catch (err) {
      console.error(err);

      const message =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Signup failed";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center py-20">
      <div className="card bg-base-300 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl mb-4">
            Create Account
          </h2>

          {error && (
            <div className="alert alert-error mb-3">
              <span>{error}</span>
            </div>
          )}

          <label className="label" htmlFor="firstName">
            First Name
          </label>

          <input
            id="firstName"
            type="text"
            className="input w-full"
            placeholder="Enter first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <label className="label" htmlFor="lastName">
            Last Name
          </label>

          <input
            id="lastName"
            type="text"
            className="input w-full"
            placeholder="Enter last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <label className="label" htmlFor="email">
            Email
          </label>

          <input
            id="email"
            type="email"
            className="input w-full"
            placeholder="Enter email"
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
          />

          <label className="label" htmlFor="password">
            Password
          </label>

          <input
            id="password"
            type="password"
            className="input w-full"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

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

          {photoPreview && (
            <div className="flex justify-center mt-4">
              <img
                src={photoPreview}
                alt="preview"
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
          )}

          <label className="label" htmlFor="age">
            Age
          </label>

          <input
            id="age"
            type="number"
            className="input w-full"
            placeholder="Enter age"
            value={age}
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
            placeholder="Tell us about yourself..."
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />

          <label className="label" htmlFor="skills">
            Skills
          </label>

          <textarea
            id="skills"
            className="textarea w-full"
            placeholder="React, Node.js, MongoDB..."
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />

          <div className="card-actions justify-center mt-5">
            <button
              className="btn btn-primary w-full"
              onClick={handleSignup}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </div>

          <p className="text-center mt-4">
            Already have an account?{" "}
            <button
              className="link link-primary"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
