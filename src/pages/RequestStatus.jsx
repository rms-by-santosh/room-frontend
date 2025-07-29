import { useEffect, useState } from "react";
import axios from "axios";
import { FaSyncAlt } from "react-icons/fa";
import { FaRotate } from "react-icons/fa6";

import "./requests.css";
function RequestStatus() {
  const [requests, setRequests] = useState([]);
  const [msg, setMsg] = useState("");
  const token = localStorage.getItem("token");

  const fetchRequests = async () => {
    setMsg("");
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/requests`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(data);
    } catch {
      setMsg("Failed to fetch status.");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
   <div className="status-container">
  <div className="status-header">
    <h1 className="status-title">
      <FaSyncAlt className="status-icon" /> Request Status
    </h1>
    <button
      onClick={fetchRequests}
      className="refresh-button"
    >
      Refresh
    </button>
  </div>
  
  {msg && (
    <div className="status-message">{msg}</div>
  )}
  
  {requests.length === 0 ? (
    <div className="empty-state">No requests found.</div>
  ) : (
    <div className="table-container">
      <table className="requests-table">
        <thead>
          <tr>
            <th>SN</th>
            <th>Dop</th>
            <th>Amount</th>
            <th>Particulars</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((r, idx) => (
            <tr key={r._id} className={idx % 2 ? "even-row" : ""}>
              <td>{idx + 1}</td>
              <td>{r.dop}</td>
              <td>{r.amount}</td>
              <td>{r.particulars}</td>
              <td>
                {r.status === "pending" ? (
                  <span className="status-pending">Pending</span>
                ) : r.status === "approved" ? (
                  <span className="status-approved">Approved</span>
                ) : (
                  <span className="status-rejected">Rejected</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>
  );
}

export default RequestStatus;
