import { useEffect, useState } from "react";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";
import "./pages.css";
function Approval() {
  const [requests, setRequests] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/requests`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(data.filter((r) => r.status === "pending"));
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

const notifyUser = async (id) => {
  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/notify/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (err) {
    console.error("❌ Email notify failed:", err.message);
  }
};

  const handleApprove = async (id) => {
  try {
    await axios.put(
      `${import.meta.env.VITE_API_URL}/requests/approve/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    await notifyUser(id); // ✅ send email after approval

    setMsg("Request approved and added to current sheet.");
    fetchRequests();
    setTimeout(() => setMsg(""), 2000);
  } catch {
    setMsg("Approval failed.");
  }
};


  const handleReject = async (id) => {
  try {
    await axios.put(
      `${import.meta.env.VITE_API_URL}/requests/reject/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setMsg("Request rejected.");
    fetchRequests();
    setTimeout(() => setMsg(""), 2000);
  } catch {
    setMsg("Rejection failed.");
  }
};


  return (
    <div className="approval-container">
      <h1 className="approval-title">Approval Page</h1>
      {msg && (
        <div className="approval-message">{msg}</div>
      )}
      {loading ? (
        <div className="loading-indicator">
          <FaSpinner className="spinner-icon" /> Loading...
        </div>
      ) : requests.length === 0 ? (
        <div className="empty-state">No pending requests to approve.</div>
      ) : (
        <div className="table-container">
          <table className="requests-table">
            <thead>
              <tr className="table-header">
                <th>SN</th>
                <th>Date of Payment</th>
                <th>Amount</th>
                <th>Particulars</th>
                <th>User</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r, idx) => (
                <tr key={r._id} className={idx % 2 ? "odd-row" : "even-row"}>
                  <td>{idx + 1}</td>
                  <td>{r.dop}</td>
                  <td>{r.amount}</td>
                  <td>{r.particulars}</td>
                  <td>{r.user?.username || "User"}</td>
                  <td className="action-buttons">
                    <button
                      className="approve-btn"
                      title="Approve"
                      onClick={() => handleApprove(r._id)}
                    >
                      <FaCheckCircle />
                    </button>
                    <button
                      className="reject-btn"
                      title="Reject"
                      onClick={() => handleReject(r._id)}
                    >
                      <FaTimesCircle />
                    </button>
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

export default Approval;
