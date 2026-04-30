import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import ConfirmModal from "./ConfirmModal";
import "../style/CommentSection.css"

export default function CommentSection({ postId, isAdmin = false }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);

  const handleDeleteClick = (commentId, userId) => {
    if (auth.currentUser?.uid === userId) {
      setSelectedComment(commentId);
      setShowModal(true);
    }
  };

  const confirmDelete = async () => {
    await deleteDoc(doc(db, "posts", postId, "comments", selectedComment));
    setComments(comments.filter(c => c.id !== selectedComment));
    setShowModal(false);
  };

  useEffect(() => {
    const fetchComments = async () => {
      const snapshot = await getDocs(collection(db, "posts", postId, "comments"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComments(data);
    };
    if (expanded) fetchComments();
  }, [expanded, postId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    await addDoc(collection(db, "posts", postId, "comments"), {
      text: newComment,
      userId: auth.currentUser ? auth.currentUser.uid : "anonymous",
      username: auth.currentUser ? auth.currentUser.email : "guest",
      profilePic: "https://via.placeholder.com/40", // replace with real avatar later
      createdAt: serverTimestamp(),
    });
    setNewComment("");
    setExpanded(true); // refresh comments
  };

  const handleDeleteComment = async (commentId, userId) => {
    if (auth.currentUser && auth.currentUser.uid === userId) {
      await deleteDoc(doc(db, "posts", postId, "comments", commentId));
      setComments(comments.filter(c => c.id !== commentId));
    }
  }; 

  return (
    <div className="comments-section">
      <button onClick={() => setExpanded(!expanded)}>
        {expanded ? "Hide Comments" : "Show Comments"}
      </button>

      {expanded && (
        <div className="comments-list">
          {comments.map(c => (
            <div key={c.id} className="comment-card">
              <div className="comment-header">
                <img src={c.profilePic} alt="avatar" className="avatar" />
                <span>{c.username}</span>
                {!isAdmin && auth.currentUser?.uid === c.userId && (
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteClick(c.id, c.userId)}
                  >
                    Delete
                  </button>
                )}
              </div>
              <p>{c.text}</p>
            </div>
          ))}

          {!isAdmin && (
            <div className="comment-input">
              <input
                type="text"
                placeholder="Type your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button onClick={handleAddComment}>Submit</button>
            </div>
          )}
        </div>
      )}

      <ConfirmModal
        isOpen={showModal}
        message="Are you sure you want to delete this comment?"
        onConfirm={confirmDelete}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
}
 
