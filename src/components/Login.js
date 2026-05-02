import { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "../style/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const role = userDoc.exists() ? userDoc.data().role : "user";

      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError("Login failed: " + err.message);
    }
  };

  return (
    <div className="login-page">
      
      {/* Background circles */}
      <div className="background">
        {/* Image circles */}
        <div className="circle img1"></div>
        <div className="circle img2"></div>
        <div className="circle img3"></div>
        <div className="circle img4"></div>
        <div className="circle img5"></div>

        {/* Layered flag combos */}
        <div className="circle big green"></div>
        <div className="circle small red overlap1"></div>

        <div className="circle big black"></div>
        <div className="circle small green overlap2"></div>

        <div className="circle medium red"></div>
        <div className="circle tiny black overlap3"></div>

      </div>

      {/* Login form */}
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>

    </div>
  );
}


// import { useState } from "react";
// import { auth, db } from "../firebase";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";
// import "../style/Login.css";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       // Sign in with Firebase Auth
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       // Check role in Firestore
//       const userDoc = await getDoc(doc(db, "users", user.uid));
//       const role = userDoc.exists() ? userDoc.data().role : "user";

//       // Redirect based on role
//       if (role === "admin") {
//         navigate("/admin");
//       } else {
//         navigate("/home");
//       }
//     } catch (err) {
//       setError("Login failed: " + err.message);
//     }
//   };

//   return (
//     <div className="login-form">
//       <h2>Login</h2>
//       <form onSubmit={handleLogin}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e)=>setEmail(e.target.value)}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e)=>setPassword(e.target.value)}
//         />
//         <button type="submit">Login</button>
//       </form>
//       {error && <p className="error">{error}</p>}
//     </div>
//   );
// }
