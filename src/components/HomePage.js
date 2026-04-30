import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const fetchTopics = async () => {
      const snapshot = await getDocs(collection(db, "topics"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTopics(data);
    };
    fetchTopics();
  }, []);

  return (
    <div>
      <h2>Explore Topics</h2>
      <div className="topics-grid">
        {topics.map(topic => (
          <div key={topic.id} className="topic-card">
            <h3>{topic.title}</h3>
            <Link to={`/topic/${topic.id}`}>
              <button>{topic.postCount || 0} Posts</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
