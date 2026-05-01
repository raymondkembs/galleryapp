import { useState } from "react";
import axios from "axios";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const CLOUD_NAME = "dxr77jrix";
const UPLOAD_PRESET = "first_time_gallery_app";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let avatarUrl = "https://via.placeholder.com/50"; // fallback

      // 2. Upload avatar to Cloudinary if file selected
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          formData
        );
        avatarUrl = response.data.secure_url;
      }

      // 3. Save user profile in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "user",
        profilePic: avatarUrl,
        createdAt: new Date(),
      });

      console.log("User signed up with avatar:", avatarUrl);
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}
