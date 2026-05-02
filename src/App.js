import { Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import HomePage from "./components/HomePage";
import TopicPage from "./components/TopicPage";
import AdminDashboard from "./components/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import AdminTopicPage from "./components/AdminTopicPage";
import SignUp from "./components/SignUp";
import './App.css';
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // redirect after logout
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="logo">📸 GalleryApp |</div>
        <ul className="nav-links">
          <li><Link to="/home">Home</Link></li>
          {!currentUser && <li><Link to="/login">Login</Link></li>}
          {!currentUser && <li><Link to="/signup">Sign Up</Link></li>}
          {currentUser && <li><button onClick={handleLogout}>Logout</button></li>}
          {currentUser && <li><Link to="/admin">Admin</Link></li>}
        </ul>
      </nav>

      <Routes>
        {/* Login first */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* User routes */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/topic/:id" element={<TopicPage />} />

        {/* Admin route (protected) */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/topic/:id"
          element={
            <AdminRoute>
              <AdminTopicPage />
            </AdminRoute>
          }
        />

      </Routes>
    </>
  );
}

export default App;

// Awesome, Now I want to tell you what I want. For this project app, this is exatly what i want, I want when you open it, first thing you meet is log in then you'll see a page which has cards say three for this example, one card says "Street food Around" and inside the card asside from that catchy title, it has ather details like number of people who posted but it wont say that, it'll only show the numbers in a button. when you click that card, it takes you to another page, this page now you'll see image cards. The image card will have details of user profiles, and probably their names or usernames, and the image at the center and at the bottom of the card there will be a drop down when when you click, it exands to show the peoples comments and an input button at the bottom saying, "Type your comments". also This user since we loged in as a user we can add our comment. when we do that ofcourse it'll be submitted to firebase and brought back. The comment card that will pop up will belong to the user, and will have users profile with a round image, and their usernames at top and at the farthest right end there will be a delete button, at center is the message comment. when asked to delete it should just go for now, I'll insert a popup later or we can just integrate it there, a poppup with a blured backdrop. And when a different user enteres the system, and log in they can see the home page with cards remember, the one saying "Street food Around", and they can go make their comment on this same image and their comment should be seen as well. Now that will be possible when deployed to github pages so no worries, and now the admin can be able to meet up with a login page and when it opens, the admin will meet up with an add button where they will enter the title of the cards. remember the Catchy cards "Street food Around", so the admin can add that. and it'll look different because the admin should be able to have extra buttons, one is the delete button, the number of peoples comment button and the people who posted on that particular topic catchy card and the view button. so when admin click view, it should show the page with peoples images and their comments but the difference is that for the admin, they wont be able to add or post images, but they can view each image and click the drop down to view their comments. So I think thats it, so according to where we've reached so far, can this be doable