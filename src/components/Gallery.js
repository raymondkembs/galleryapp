import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";

export default function Gallery() {
  const [cards, setCards] = useState([]); // <-- define state

  useEffect(() => {
    const fetchCards = async () => {
      const snapshot = await getDocs(collection(db, "cards"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCards(data);
    };
    fetchCards();
  }, []);

  return (
    <div>
      <h2>Gallery</h2>
      <div className="gallery-grid">
        {cards.map(card => (
          <div key={card.id} className="gallery-card">
            <img src={card.imageUrl} alt="Uploaded" style={{ maxWidth: "200px" }} />
            <p>Uploaded by: {card.userId}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
