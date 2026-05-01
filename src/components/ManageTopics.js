import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function ManageTopics() {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const fetchTopics = async () => {
      const snapshot = await getDocs(collection(db, "topics"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTopics(data);
    };
    fetchTopics();
  }, []);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "topics", id));
    setTopics(topics.filter(t => t.id !== id));
  };

  return (
    <div>
      <h2>Manage Topics</h2>
      <div className="topics-grid">
        {topics.map(topic => (
          <div key={topic.id} className="topic-card">
            <h3>{topic.title}</h3>
            <button onClick={() => handleDelete(topic.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
