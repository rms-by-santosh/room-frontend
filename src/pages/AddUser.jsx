import { useEffect, useState } from "react";
import axios from "axios";
import { FaUserPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import "./pages.css";
function AddUser() {
  const [users, setUsers] = useState([]);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/users`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(data.filter((u) => u.role !== "admin"));
    } catch {
      setUsers([]);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/users/register`,
        { ...form },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg("User added.");
      setForm({ username: "", email: "", password: "" });
      setAdding(false);
      fetchUsers();
      setTimeout(() => setMsg(""), 2000);
    } catch (err) {
      setMsg(err?.response?.data?.message || "Add failed.");
    }
  };

  const handleEdit = (user) => {
    setEditingId(user._id);
    setForm({
      username: user.username,
      email: user.email,
      password: "",
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/users/${id}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg("User updated.");
      setEditingId(null);
      setForm({ username: "", email: "", password: "" });
      fetchUsers();
      setTimeout(() => setMsg(""), 2000);
    } catch (err) {
      setMsg(err?.response?.data?.message || "Update failed.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this user?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/users/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg("User deleted.");
      fetchUsers();
      setTimeout(() => setMsg(""), 2000);
    } catch {
      setMsg("Delete failed.");
    }
  };

  return (
    <div className="user-management-container">
      <h1 className="management-title">Manage Users</h1>
      <div className="action-bar">
        <button
          className="add-user-button"
          onClick={() => setAdding((v) => !v)}
        >
          <FaUserPlus className="button-icon" /> 
          {adding ? "Cancel" : "Add New User"}
        </button>
        {msg && <span className="message-banner">{msg}</span>}
      </div>

      {adding && (
        <form onSubmit={handleAdd} className="user-form">
          <h2 className="form-title">New User</h2>
          <div className="form-inputs">
            <input
              className="form-input"
              placeholder="Username"
              value={form.username}
              required
              onChange={(e) =>
                setForm((f) => ({ ...f, username: e.target.value }))
              }
            />
            <input
              className="form-input"
              placeholder="Email"
              type="email"
              value={form.email}
              required
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
            />
            <input
              className="form-input"
              placeholder="Password"
              type="password"
              value={form.password}
              required
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
            />
            <button className="submit-button" type="submit">
              <FaSave className="button-icon" /> Create
            </button>
          </div>
        </form>
      )}

      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr className="table-header">
              <th>Username</th>
              <th>Email</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) =>
              editingId === user._id ? (
                <tr key={user._id} className="editing-row">
                  <td>
                    <input
                      className="edit-input"
                      value={form.username}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, username: e.target.value }))
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="edit-input"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                    />
                  </td>
                  <td className="action-cells">
                    <button
                      className="save-button"
                      onClick={() => handleSaveEdit(user._id)}
                    >
                      <FaSave className="button-icon" />
                    </button>
                    <button
                      className="cancel-button"
                      onClick={() => setEditingId(null)}
                    >
                      <FaTimes className="button-icon" />
                    </button>
                  </td>
                  <td></td>
                </tr>
              ) : (
                <tr key={user._id} className="user-row">
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td className="action-cells">
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(user)}
                    >
                      <FaEdit className="button-icon" />
                    </button>
                  </td>
                  <td className="action-cells">
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(user._id)}
                    >
                      <FaTrash className="button-icon" />
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AddUser;
