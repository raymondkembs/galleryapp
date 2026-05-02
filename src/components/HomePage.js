import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import "../style/HomePage.css";

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
    <div className="home-page">

      {/* Decorative background */}
      <div className="bg-decor">
        <div className="blob one"></div>
        <div className="blob two"></div>
        <div className="blob three"></div>
      </div>

      <div className="content">
        <h2 className="title">Explore Topics</h2>

        <div className="topics-grid">
          {topics.map(topic => (
            <div key={topic.id} className="topic-card">
              <h3>{topic.title}</h3>
              <Link to={`/topic/${topic.id}`}>
                <button className="button_color">{topic.postCount || 0} Posts</button>
              </Link>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}