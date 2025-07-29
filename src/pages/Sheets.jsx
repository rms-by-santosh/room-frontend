import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEye, FaStar, FaRegStar } from "react-icons/fa";
import "./sheets.css"
function Sheets() {
  const [sheets, setSheets] = useState([]);
  const [currentId, setCurrentId] = useState("");
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSheets();
    fetchCurrent();
  }, []);

  const fetchSheets = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/sheets`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSheets(data);
    } catch {
      setSheets([]);
    }
  };

  const fetchCurrent = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/sheets/current`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCurrentId(data?._id || "");
    } catch {
      setCurrentId("");
    }
  };

  const handleOpen = (sheet) => setPreview(sheet);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this sheet?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/sheets/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Sheet deleted.");
      setPreview(null);
      fetchSheets();
      fetchCurrent();
      setTimeout(() => setMessage(""), 2000);
    } catch {
      setMessage("Delete failed.");
    }
  };

  const handleSetCurrent = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/sheets/current/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Marked as current sheet.");
      setCurrentId(id);
      fetchSheets();
      setTimeout(() => setMessage(""), 2000);
    } catch {
      setMessage("Failed to set current.");
    }
  };

  return (
    <div className="sheets-container">
  <div className="sheets-header">
    <div className="sheets-summary">
      <span className="summary-label">Total sheets:</span> 
      <span className="summary-count">{sheets.length}</span>
    </div>
    
    <div className="sheets-controls">
      <select
        className="sheet-select"
        value={currentId}
        onChange={e => handleSetCurrent(e.target.value)}
      >
        <option value="">Select current sheet</option>
        {sheets.map((sheet) => (
          <option key={sheet._id} value={sheet._id}>
            {sheet.name}
            {sheet.isCurrent ? " (current)" : ""}
          </option>
        ))}
      </select>
      
      {message && (
        <div className="status-message">{message}</div>
      )}
    </div>
  </div>

  <div className="table-wrapper">
    <table className="sheets-table">
      <thead>
        <tr>
          <th>Sheet Name</th>
          <th>Status</th>
          <th>Open</th>
          <th>Delete</th>
          <th>Set Current</th>
        </tr>
      </thead>
      <tbody>
        {sheets.map((sheet) => (
          <tr key={sheet._id} className={sheet.isCurrent ? "current-sheet" : ""}>
            <td>{sheet.name}</td>
            <td>
              {sheet.isCurrent ? (
                <span className="status-current">
                  <FaStar className="status-icon" /> Current
                </span>
              ) : (
                <span className="status-inactive">
                  <FaRegStar className="status-icon" /> Not current
                </span>
              )}
            </td>
            <td>
              <button
                className="action-btn view-btn"
                onClick={() => handleOpen(sheet)}
              >
                <FaEye />
              </button>
            </td>
            <td>
              <button
                className="action-btn delete-btn"
                onClick={() => handleDelete(sheet._id)}
              >
                <FaTrash />
              </button>
            </td>
            <td>
              <button
                disabled={sheet.isCurrent}
                className={`action-btn star-btn ${sheet.isCurrent ? "disabled" : ""}`}
                onClick={() => handleSetCurrent(sheet._id)}
              >
                <FaStar />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {preview && (
    <div className="preview-panel">
      <h2 className="preview-title">
        Sheet Preview: <span>{preview.name}</span>
      </h2>
      
      {preview.entries && preview.entries.length > 0 ? (
        <div className="preview-table-wrapper">
          <table className="preview-table">
            <thead>
              <tr>
                <th>Sn.</th>
                <th>Dop</th>
                <th>Particulars</th>
                <th>Amount</th>
                <th>Paid By</th>
              </tr>
            </thead>
            <tbody>
              {preview.entries.map((row, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{row.dop}</td>
                  <td>{row.particulars}</td>
                  <td>{row.amount}</td>
                  <td>{row.paidBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-preview">No entries in this sheet.</div>
      )}
      
      <button
        className="close-preview-btn"
        onClick={() => setPreview(null)}
      >
        Close Preview
      </button>
    </div>
  )}
</div>


  

  );
}

export default Sheets;
