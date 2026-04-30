import { Navigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

export default function AdminRoute({ children }) {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    const checkRole = async () => {
      if (!auth.currentUser) {
        setAllowed(false);
        return;
      }
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      const role = userDoc.exists() ? userDoc.data().role : "user";
      setAllowed(role === "admin");
    };
    checkRole();
  }, []);

  if (allowed === null) return <p>Loading...</p>;
  return allowed ? children : <Navigate to="/login" />;
}