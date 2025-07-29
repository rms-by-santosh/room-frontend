import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUserPlus,
  FaFileAlt,
  FaCheckCircle,
  FaListUl,
  FaClipboardList,
  FaSyncAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Home() {
  const [user, setUser] = useState(null);
  const [currentSheet, setCurrentSheet] = useState(null);
  const [totals, setTotals] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
    fetchCurrentSheet();
  }, []);

  const fetchCurrentSheet = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/sheets/current`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCurrentSheet(data);
      if (data && data.entries) {
        const userTotals = {};
        data.entries.forEach((row) => {
          userTotals[row.paidBy] = (userTotals[row.paidBy] || 0) + row.amount;
        });
        setTotals(userTotals);
      }
    } catch {
      setCurrentSheet(null);
    }
  };

  if (!user) return null;

  return (
  <div className="dashboard-container">
    {user.role === "admin" && (
      <section className="section admin-tools">
        <h2>Admin Tools</h2>
        <div className="button-group">
          <button onClick={() => navigate("/add-user")} className="button admin-button admin-button-green">
            <FaUserPlus size={18} /> Add User
          </button>
          <button onClick={() => navigate("/create-sheet")} className="button admin-button admin-button-blue">
            <FaFileAlt size={18} /> Create Sheet
          </button>
          <button onClick={() => navigate("/approval")} className="button admin-button admin-button-purple">
            <FaCheckCircle size={18} /> Approval
          </button>
          <button onClick={() => navigate("/manage-sheets")} className="button admin-button admin-button-yellow">
            <FaListUl size={18} /> Manage Sheets
          </button>
        </div>
      </section>
    )}
    <section className="section user-tools">
      <h2>User Tools</h2>
      <div className="button-group">
        <button onClick={() => navigate("/request-entry")} className="button user-button user-button-pink">
          <FaClipboardList size={18} /> Request Entry
        </button>
        <button onClick={() => navigate("/request-status")} className="button user-button user-button-indigo">
          <FaSyncAlt size={18} /> Request Status
        </button>
      </div>
    </section>
    <section className="section current-sheet">
      <h2>Current Sheet</h2>
      {currentSheet && currentSheet.entries && currentSheet.entries.length > 0 ? (
        <>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Sn.</th>
                  <th>Dop</th>
                  <th>Particular</th>
                  <th>Amount</th>
                  <th>Paid By</th>
                </tr>
              </thead>
              <tbody>
                {currentSheet.entries.map((row, idx) => (
                  <tr key={idx} className={idx % 2 ? "even-row" : "odd-row"}>
                    <td>{idx + 1}</td>
                    <td>{row.dop}</td>
                    <td>{row.particulars}</td>
                    <td>{row.amount.toFixed(2)}</td>
                    <td>{row.paidBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="total-summary">
            <b>Total amount:</b>{" "}
            <span className="total-amount">
              {currentSheet.entries.reduce((sum, r) => sum + r.amount, 0).toFixed(2)}
            </span>
          </div>
          <div className="user-totals">
            {Object.keys(totals).map((uname) => (
              <div key={uname}>
                Total of <b>{uname}</b>:{" "}
                <span className="user-total">
                  {totals[uname].toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="no-data">No current sheet or no entries.</div>
      )}
    </section>
  </div>
);
}

export default Home;
