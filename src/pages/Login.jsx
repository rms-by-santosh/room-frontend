import { useState } from "react";
import { FaSignInAlt } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();
  setErr("");
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/users/login`,
      { username, password }
    );
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    window.location.replace("/"); // This refreshes and redirects to "/"
  } catch (error) {
    setErr(
      error?.response?.data?.message ||
        "Login failed. Please try again."
    );
  }
};


  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h1 className="login-title">
          <FaSignInAlt className="title-icon" /> Login
        </h1>
        
        {err && <div className="error-message">{err}</div>}
        
        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            className="form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button className="submit-button" type="submit">
          <FaSignInAlt className="button-icon" /> Login
        </button>
        
        <div className="admin-hint">
          <b>contact developer santosh if any error occurs</b>
        </div>
      </form>
    </div>
  );
}

export default Login;