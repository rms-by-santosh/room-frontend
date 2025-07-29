import { useState } from "react";
import axios from "axios";
import { FaClipboardList, FaPaperPlane } from "react-icons/fa";
import "./requests.css"
function RequestEntry() {
  const [dop, setDop] = useState("");
  const [particulars, setParticulars] = useState("");
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleRequest = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/requests`,
        { dop, particulars, amount: parseFloat(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg("Request sent for approval.");
      setDop("");
      setParticulars("");
      setAmount("");
      setTimeout(() => setMsg(""), 2000);
    } catch (err) {
      setMsg(err?.response?.data?.message || "Request failed.");
    }
    setLoading(false);
  };

  return (
    <div className="form-container">
  <h1 className="form-title">
    <FaClipboardList className="title-icon" /> Request Entry
  </h1>
  <form onSubmit={handleRequest} className="request-form">
    <div className="form-group">
      <label>Date of Payment (Dop)</label>
      <input
        type="date"
        value={dop}
        onChange={(e) => setDop(e.target.value)}
        required
      />
    </div>
    <div className="form-group">
      <label>Particulars</label>
      <input
        value={particulars}
        onChange={(e) => setParticulars(e.target.value)}
        required
        placeholder="Enter particulars"
      />
    </div>
    <div className="form-group">
      <label>Amount</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        min={0}
        placeholder="00.00"
        step="0.01"
      />
    </div>
    <button
      type="submit"
      disabled={loading}
      className="submit-button"
    >
      <FaPaperPlane className="button-icon" /> 
      {loading ? "Requesting..." : "Request"}
    </button>
    {msg && (
      <div className="message">
        {msg}
      </div>
    )}
  </form>
</div>
  );
}

export default RequestEntry;
