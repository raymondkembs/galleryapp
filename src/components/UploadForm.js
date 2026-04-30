import React, { useState } from "react";
import axios from "axios";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp, updateDoc, doc, increment } from "firebase/firestore";
 
const CLOUD_NAME = "dxr77jrix";       // replace with your Cloudinary cloud name
const UPLOAD_PRESET = "first_time_gallery_app"; // replace with your unsigned preset


export default function UploadForm({ topicId }) {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");

  const handleUpload = async () => {
  try {
    // Save post in Firestore
    const postRef = await addDoc(collection(db, "posts"), {
      topicId,
      imageUrl: url,   // use your existing state
      createdBy: auth.currentUser ? auth.currentUser.uid : "anonymous",
      createdAt: new Date()
    });

    // Increment postCount in the topic doc
    await updateDoc(doc(db, "topics", topicId), {
      postCount: increment(1)
    });

    console.log("Post added:", postRef.id);
  } catch (err) {
    console.error("Upload failed:", err);
  }
};

  const handleSubmit = async (e) => {
  e.preventDefault();
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
    setUrl(secureUrl);

    // Save metadata to Firestore
    await addDoc(collection(db, "posts"), {
      topicId, // link to the topic
      imageUrl: secureUrl,
      userId: auth.currentUser ? auth.currentUser.uid : "anonymous",
      username: auth.currentUser ? auth.currentUser.email : "guest",
      profilePic: "https://via.placeholder.com/50",
      createdAt: serverTimestamp(),
    });

    // 🔧 Increment postCount in the topic doc
    await updateDoc(doc(db, "topics", topicId), {
      postCount: increment(1),
    });

    console.log("Saved to Firestore and incremented postCount:", secureUrl);
  } catch (err) {
    console.error("Upload error:", err);
  }
};


  return (
    <div>
      <h3>Post an Image</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">Upload</button>
      </form>

      {url && (
        <div>
          <p>Uploaded Image URL:</p>
          <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
          <br />
          <img src={url} alt="Uploaded preview" style={{ maxWidth: "300px" }} />
        </div>
      )}
    </div>
  );
}
