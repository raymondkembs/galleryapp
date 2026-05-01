import React, { useState } from "react";
import axios from "axios";
import { db, auth } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import "../style/ProfileForm.css";

const CLOUD_NAME = "dxr77jrix";       
const UPLOAD_PRESET = "first_time_gallery_app"; 

export default function ProfileForm() {
  const [file, setFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");

  const handleAvatarUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
      );
      const secureUrl = response.data.secure_url;
      setAvatarUrl(secureUrl);

      // Save to Firestore user doc
      const userId = auth.currentUser.uid;
      await updateDoc(doc(db, "users", userId), {
        profilePic: secureUrl,
      });

      console.log("Avatar uploaded and saved:", secureUrl);
    } catch (err) {
      console.error("Avatar upload failed:", err);
    }
  };

  return (
    <div>
      <h3>Update Profile</h3>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleAvatarUpload}>Upload Avatar</button>

      {avatarUrl && (
        <div>
          <img src={avatarUrl} alt="Profile preview" className="avatar" />
        </div>
      )}
    </div>
  );
}
