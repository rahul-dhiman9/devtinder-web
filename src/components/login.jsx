import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/userSlice";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("anuj@g.com");
  const [password, setPassword] = useState("Strong@22");
  const [error, setError] = useState("");
  const nav = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          emailId,
          password,
        },
        {
          withCredentials: true,
        },
      );
      console.log("LOGIN RESPONSE:", res.data);
      dispatch(addUser(res.data.user));
      if (res.data.user) {
        return nav("/");
      }
    } catch (err) {
      setError(err?.response?.data || "Something went wrong!");
    }
  };

  return (
    <div className="flex justify-center m-10">
      <div className="card bg-base-300 w-96 shadow-sm ">
        <div className="card-body ">
          <h2 className="card-title flex justify-center">LOGIN</h2>
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input"
              value={emailId}
              placeholder="enter your email id"
              onChange={(e) => setEmailId(e.target.value)}
            />
            <label className="label pt-5">Password</label>
            <input
              type="password"
              className="input"
              value={password}
              placeholder="enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <p className="text-red-500">{error}</p>
          <div className="card-actions justify-center mt-5">
            <button className="btn btn-primary" onClick={handleLogin}>
              Login
            </button>
            <Link to="/signup" className="link mx-20 text-blue-400">If new user, click here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
