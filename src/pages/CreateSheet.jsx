import { useState } from "react";
import axios from "axios";
import { FaFileAlt, FaPlus } from "react-icons/fa";
import "./createsheet.css";
function CreateSheet() {
  const [name, setName] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);
  const [msg, setMsg] = useState("");
  const token = localStorage.getItem("token");

  const handleCreate = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/sheets`,
        { name, isCurrent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg("Sheet created!");
      setName("");
      setIsCurrent(false);
      setTimeout(() => setMsg(""), 2000);
    } catch (err) {
      setMsg(err?.response?.data?.message || "Creation failed.");
    }
  };

  return (
     <div className="sheet-container">
      <h1 className="sheet-title">
        <FaFileAlt className="title-icon" /> Create Sheet
      </h1>
      <form onSubmit={handleCreate} className="sheet-form">
        <div className="form-group">
          <label className="form-label">Sheet Name</label>
          <input
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter sheet name"
          />
        </div>
        <div className="checkbox-group">
          <input
            id="isCurrent"
            type="checkbox"
            checked={isCurrent}
            onChange={(e) => setIsCurrent(e.target.checked)}
            className="checkbox-input"
          />
          <label htmlFor="isCurrent" className="checkbox-label">
            Mark as current sheet
          </label>
        </div>
        <button type="submit" className="submit-button">
          <FaPlus className="button-icon" /> Create
        </button>
        {msg && <div className="form-message">{msg}</div>}
      </form>
    </div>
  );
}

export default CreateSheet;
