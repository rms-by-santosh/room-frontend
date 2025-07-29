import { FaSignOutAlt } from "react-icons/fa";
import "./header.css";
function Header() {
  const username = JSON.parse(localStorage.getItem("user"))?.username || "Guest";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <header className="header-container">
      <h1 className="app-title">Room Management and Account System</h1>
      <button
        onClick={handleLogout}
        className="logout-button"
        title="Logout"
      >
        <FaSignOutAlt className="logout-icon" />
        <span className="username">{username}</span>
      </button>
    </header>
  );
}

export default Header;