import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import "../style/Navbar.css";

function Navbar() {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRole = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        }
      }
    };
    fetchRole();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">📸 GalleryApps</div>
      <ul className="nav-links">
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/signup">Sign Up</Link></li>
        <li className="dropdown">
          <button className="dropbtn">Profile ▾</button>
          <div className="dropdown-content">
            <Link to="/profile">Edit Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </li>
        {role === "admin" && <li><Link to="/admin">Admin</Link></li>}
      </ul>
    </nav>
  );
}

export default Navbar;
