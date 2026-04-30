import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import "../style/Navbar.css"

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
      navigate("/login"); // redirect to login after logout
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">📸 GalleryApp</div>
      <ul className="nav-links">
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/signup">Sign Up</Link></li>
        {role === "admin" && <li><Link to="/admin">Admin</Link></li>}
        <li>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
