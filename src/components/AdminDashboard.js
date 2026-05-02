import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import ConfirmModal from "./ConfirmModal";
import "../style/AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import ManagePosts from "./ManagePosts";
import ManageUsers from "./ManageUsers";
import ManageTopics from "./ManageTopics";
import EditProfile from "./EditProfile";


export default function AdminDashboard() {
  const [topics, setTopics] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [activeTab, setActiveTab] = useState("topics"); 
  const [stats, setStats] = useState({ topics: 0, posts: 0, users: 0 });
  const navigate = useNavigate();


  useEffect(() => {
    const fetchStats = async () => {
      const topicsSnap = await getDocs(collection(db, "topics"));
      const postsSnap = await getDocs(collection(db, "posts"));
      const usersSnap = await getDocs(collection(db, "users"));

      setStats({
        topics: topicsSnap.size,
        posts: postsSnap.size,
        users: usersSnap.size,
      });
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchTopics = async () => {
      const snapshot = await getDocs(collection(db, "topics"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTopics(data);
    };
    fetchTopics();
  }, []);

  const handleAddTopic = async () => {
    if (!newTitle.trim()) return;
    await addDoc(collection(db, "topics"), {
      title: newTitle,
      createdBy: auth.currentUser ? auth.currentUser.uid : "admin",
      createdAt: serverTimestamp(),
      postCount: 0,
    });
    setNewTitle("");
    const snapshot = await getDocs(collection(db, "topics"));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTopics(data);
  };

  const handleDeleteClick = (topicId) => {
    setSelectedTopic(topicId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    await deleteDoc(doc(db, "topics", selectedTopic));
    setTopics(topics.filter(t => t.id !== selectedTopic));
    setShowModal(false);
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <div className="stats-bar">

        <div className="stat-item topics">
          <span className="stat-icon">📂</span>
          <span className="stat-text">Topics: {stats.topics}</span>
        </div>

        <div className="stat-item posts">
          <span className="stat-icon">🖼️</span>
          <span className="stat-text">Posts: {stats.posts}</span>
        </div>

        <div className="stat-item users">
          <span className="stat-icon">👥</span>
          <span className="stat-text">Users: {stats.users}</span>
        </div>

      </div>


      {/* Tab Navigation */}
      <div className="admin-tabs">
        <button onClick={() => setActiveTab("topics")}>Topics</button>
        <button onClick={() => setActiveTab("posts")}>Posts</button>
        <button onClick={() => setActiveTab("users")}>Users</button>
        <button onClick={() => setActiveTab("profile")}>Profile</button>
      </div>

      {/* Tab Content */}
      <div className="admin-content">
        {activeTab === "topics" && (
          <>
            <div className="add-topic-form">
              <input
                type="text"
                placeholder="Enter topic title..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <button onClick={handleAddTopic}>Add Topic</button>
            </div>

            {/* <div className="topics-grid">
              {topics.map(topic => (
                <div key={topic.id} className="topic-card">
                  <h3>{topic.title}</h3>
                  <button onClick={() => handleDeleteClick(topic.id)}>Delete</button>
                  <button onClick={() => navigate(`/admin/topic/${topic.id}`)}>View</button>
                  <button>{topic.postCount || 0} Posts</button>
                </div>
              ))}
            </div> */}
            <div className="topics-grid">
              {topics.map(topic => (
                <div key={topic.id} className="topic-card">

                  <div className="topic-header">
                    <h3>{topic.title}</h3>
                    <span className="post-count">{topic.postCount || 0} posts</span>
                  </div>

                  <div className="topic-actions">
                    <button
                      className="view-btn"
                      onClick={() => navigate(`/admin/topic/${topic.id}`)}
                    >
                      View
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteClick(topic.id)}
                    >
                      Delete
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </>
        )}
        <div className="tab-content">
          {activeTab === "topics" && <ManageTopics />}
          {activeTab === "posts" && <ManagePosts />}
          {activeTab === "users" && <ManageUsers />}
          {activeTab === "profile" && <EditProfile />}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showModal}
        message="Are you sure you want to delete this topic?"
        onConfirm={confirmDelete}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
}
