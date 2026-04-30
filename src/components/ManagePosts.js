import { useEffect, useState } from "react";
import { db } from "../firebase";
import "../style/ManagePosts.css";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import ConfirmModal from "./ConfirmModal";

export default function ManagePosts() {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const snapshot = await getDocs(collection(db, "posts"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(data);
    };
    fetchPosts();
  }, []);

  const handleDeleteClick = (postId) => {
    setSelectedPost(postId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    await deleteDoc(doc(db, "posts", selectedPost));
    setPosts(posts.filter(p => p.id !== selectedPost));
    setShowModal(false);
  };

  return (
    <div className="posts-grid">
      {posts.map(post => (
        <div key={post.id} className="post-card">
          <div className="user-info">
            <img src={post.profilePic} alt="avatar" className="avatar" />
            <span>{post.username}</span>
          </div>
          <img src={post.imageUrl} alt="Uploaded" style={{ maxWidth: "300px" }} />
          <p>{post.caption}</p>
          <button onClick={() => handleDeleteClick(post.id)}>Delete</button>
        </div>
      ))}

      <ConfirmModal
        isOpen={showModal}
        message="Are you sure you want to delete this post?"
        onConfirm={confirmDelete}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
}
