import { FaHome, FaFileAlt, FaUser } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink
        to="/"
        className={({ isActive }) => 
          `nav-link ${isActive ? "active" : ""}`
        }
      >
        <FaHome className="nav-icon" />
        <span className="nav-text">Home</span>
      </NavLink>
      <NavLink
        to="/sheets"
        className={({ isActive }) => 
          `nav-link ${isActive ? "active" : ""}`
        }
      >
        <FaFileAlt className="nav-icon" />
        <span className="nav-text">Sheets</span>
      </NavLink>
      <NavLink
        to="/add-user"
        className={({ isActive }) => 
          `nav-link ${isActive ? "active" : ""}`
        }
      >
        <FaUser className="nav-icon" />
        <span className="nav-text">User</span>
      </NavLink>
    </nav>
  );
}

export default Navbar;