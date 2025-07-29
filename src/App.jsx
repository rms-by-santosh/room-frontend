import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Sheets from "./pages/Sheets";
import AddUser from "./pages/AddUser";
import CreateSheet from "./pages/CreateSheet";
import Approval from "./pages/Approval";
import ManageSheets from "./pages/ManageSheets";
import RequestEntry from "./pages/RequestEntry";
import RequestStatus from "./pages/RequestStatus";
import Login from "./pages/Login";
import Header from "./components/Header";
import Navbar from "./components/Navbar";

function App() {
  const isAuth = !!localStorage.getItem("token");

  return (
    <Router>
      <Header />
      <Navbar />
      <div className="container ">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={isAuth ? <Home /> : <Navigate to="/login" />} />
          <Route path="/sheets" element={isAuth ? <Sheets /> : <Navigate to="/login" />} />
          <Route path="/add-user" element={isAuth ? <AddUser /> : <Navigate to="/login" />} />
          <Route path="/create-sheet" element={isAuth ? <CreateSheet /> : <Navigate to="/login" />} />
          <Route path="/approval" element={isAuth ? <Approval /> : <Navigate to="/login" />} />
          <Route path="/manage-sheets" element={isAuth ? <ManageSheets /> : <Navigate to="/login" />} />
          <Route path="/request-entry" element={isAuth ? <RequestEntry /> : <Navigate to="/login" />} />
          <Route path="/request-status" element={isAuth ? <RequestStatus /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
