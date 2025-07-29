import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaPrint, FaStar, FaRegStar } from "react-icons/fa";
import "./pages.css";
function ManageSheets() {
  const [sheets, setSheets] = useState([]);
  const [msg, setMsg] = useState("");
  const [preview, setPreview] = useState(null);
  const printRef = useRef();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSheets();
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

  const handleSetCurrent = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/sheets/current/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg("Marked as current sheet.");
      fetchSheets();
      setTimeout(() => setMsg(""), 2000);
    } catch {
      setMsg("Failed to set current.");
    }
  };

  const handlePrint = () => {
    if (!preview) return;
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Sheet</title>
          <style>
            body { font-family: sans-serif; background: #fff; color: #000; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #222; padding: 6px 10px; }
            th { background: #f0f0f0; }
            h2 { margin-bottom: 14px; }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
     <div className="sheets-container">
      <h1 className="sheets-title">Manage Sheets</h1>
      {msg && <div className="status-message">{msg}</div>}
      
      <div className="sheets-table-container">
        <table className="sheets-table">
          <thead>
            <tr className="table-header">
              <th>Sheet Name</th>
              <th>Status</th>
              <th>Print</th>
              <th>Mark as Current</th>
              <th>Preview</th>
            </tr>
          </thead>
          <tbody>
            {sheets.map((sheet) => (
              <tr key={sheet._id} className={sheet.isCurrent ? "current-sheet" : ""}>
                <td>{sheet.name}</td>
                <td>
                  {sheet.isCurrent ? (
                    <span className="current-status">
                      <FaStar className="status-icon" /> Current
                    </span>
                  ) : (
                    <span className="inactive-status">
                      <FaRegStar className="status-icon" /> Not current
                    </span>
                  )}
                </td>
                <td>
                  <button
                    className="print-button"
                    onClick={() => {
                      setPreview(sheet);
                      setTimeout(handlePrint, 300);
                    }}
                    title="Print"
                  >
                    <FaPrint className="action-icon" />
                  </button>
                </td>
                <td>
                  <button
                    disabled={sheet.isCurrent}
                    className={`set-current-button ${sheet.isCurrent ? "disabled" : ""}`}
                    onClick={() => handleSetCurrent(sheet._id)}
                  >
                    <FaStar className="action-icon" />
                  </button>
                </td>
                <td>
                  <button
                    className="preview-button"
                    onClick={() => setPreview(sheet)}
                  >
                    Preview
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {preview && (
        <div className="sheet-preview" ref={printRef}>
          <h2 className="preview-title">
            Sheet: <span className="sheet-name">{preview.name}</span>
          </h2>
          {preview.entries && preview.entries.length > 0 ? (
            <table className="entries-table">
              <thead>
                <tr className="entries-header">
                  <th>Sn.</th>
                  <th>Date of Payment</th>
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
          ) : (
            <div className="empty-entries">No entries in this sheet.</div>
          )}
          <button
            className="close-preview"
            onClick={() => setPreview(null)}
          >
            Close Preview
          </button>
        </div>
      )}
    </div>
  );
}

export default ManageSheets;
