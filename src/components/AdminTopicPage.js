import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import CommentSection from "./CommentSection";

export default function AdminTopicPage() {
  const { id } = useParams(); // topicId
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, "posts"), where("topicId", "==", id));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(data);
    };
    fetchPosts();
  }, [id]);

  return (
    <div>
      <h2>Admin View: Topic</h2>
      <div className="posts-grid">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <div className="user-info">
              <img src={post.profilePic} alt="avatar" className="avatar" />
              <span>{post.username}</span>
            </div>
            <img src={post.imageUrl} alt="Uploaded" style={{ maxWidth: "300px" }} />

            {/* Comments dropdown (read-only) */}
            <CommentSection postId={post.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
