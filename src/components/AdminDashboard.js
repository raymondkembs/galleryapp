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

export default function AdminDashboard() {
  const [topics, setTopics] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [activeTab, setActiveTab] = useState("topics"); // NEW
  const navigate = useNavigate();

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

      {/* Tab Navigation */}
      <div className="admin-tabs">
        <button onClick={() => setActiveTab("topics")}>Topics</button>
        <button onClick={() => setActiveTab("posts")}>Posts</button>
        <button onClick={() => setActiveTab("users")}>Users</button>
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

            <div className="topics-grid">
              {topics.map(topic => (
                <div key={topic.id} className="topic-card">
                  <h3>{topic.title}</h3>
                  <button onClick={() => handleDeleteClick(topic.id)}>Delete</button>
                  <button onClick={() => navigate(`/admin/topic/${topic.id}`)}>View</button>
                  <button>{topic.postCount || 0} Posts</button>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "posts" && <ManagePosts />}

        {activeTab === "users" && <ManageUsers />}
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
