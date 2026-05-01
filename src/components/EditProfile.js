import React, { useState } from "react";
import axios from "axios";
import { db, auth } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import "../style/EditProfile.css";

const CLOUD_NAME = "dxr77jrix";
const UPLOAD_PRESET = "first_time_gallery_app";

export default function EditProfile() {
  const [file, setFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");

  const handleAvatarUpdate = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      // Upload to Cloudinary
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
      );
      const secureUrl = response.data.secure_url;
      setAvatarUrl(secureUrl);

      // Update Firestore user doc
      const userId = auth.currentUser.uid;
      await updateDoc(doc(db, "users", userId), {
        profilePic: secureUrl,
      });

      console.log("Profile avatar updated:", secureUrl);
    } catch (err) {
      console.error("Avatar update failed:", err);
    }
  };

  return (
    <div>
      <h3>Edit Profile</h3>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleAvatarUpdate}>Update Avatar</button>

      {avatarUrl && (
        <div>
          <img src={avatarUrl} alt="Profile preview" className="avatar" />
        </div>
      )}
    </div>
  );
}
