import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where, updateDoc, increment, doc } from "firebase/firestore";
import { db } from "../firebase";
import UploadForm from "./UploadForm";
import CommentSection from "./CommentSection";
import '../style/TopicPage.css'

export default function TopicPage() {
  const { id } = useParams();
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
    <div className="topic-page">

      {/* background */}
      <div className="bg-decor">
        <div className="blob one"></div>
        <div className="blob two"></div>
      </div>

      <div className="content">

        <h2 className="title">Topic</h2>

        {/* Upload section */}
        <div className="upload-wrapper">
          <UploadForm topicId={id} />
        </div>

        {/* Posts */}
        <div className="posts-grid">
          {posts.map(post => (
            <div className="post-card">

              {/* compact header */}
              <div className="post-header">
              {post.profilePic ? (
                <img
                  src={post.profilePic}
                  className="avatar_img"
                  alt="avatar"
                  onError={(e) => {
                    e.currentTarget.src = "https://www.gravatar.com/avatar/?d=mp";
                  }}
                />
              ) : (
                <div className="avatar_fallback">
                  {post.username?.charAt(0).toUpperCase()}
                </div>
              )}
                <span className="username">{post.username}</span>
              </div>

              {/* hero image */}
              <img src={post.imageUrl} className="post-image" />

              {/* action row */}
              {/* <div className="post-actions">
                <button className="comment-btn">💬 Comments</button>
              </div> */}

              {/* comments hidden in a cleaner container */}
              <div className="comment-wrapper">
                <CommentSection postId={post.id} />
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}