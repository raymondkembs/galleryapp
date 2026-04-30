import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import ConfirmModal from "./ConfirmModal";
import { FaUser, FaShieldAlt } from "react-icons/fa"; // icons

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleRoleChangeClick = (userId, role) => {
    setSelectedUser(userId);
    setNewRole(role === "admin" ? "user" : "admin");
    setShowModal(true);
  };

  const confirmRoleChange = async () => {
    await updateDoc(doc(db, "users", selectedUser), { role: newRole });
    setUsers(users.map(u => u.id === selectedUser ? { ...u, role: newRole } : u));
    setShowModal(false);
  };

  return (
    <div className="users-grid">
      {users.map(user => (
        <div key={user.id} className="user-card">
          <div className="user-header">
            {user.role === "admin" ? <FaShieldAlt /> : <FaUser />}
            <h3>{user.email}</h3>
          </div>
          <p className="role-label">
            Role: <span className={user.role}>{user.role}</span>
          </p>
          <button
            disabled={auth.currentUser?.uid === user.id}
            onClick={() => handleRoleChangeClick(user.id, user.role)}
            className="role-toggle"
          >
            {user.role === "admin" ? "Switch to User" : "Switch to Admin"}
          </button>
        </div>
      ))}

      <ConfirmModal
        isOpen={showModal}
        message={`Change this user's role to ${newRole}?`}
        onConfirm={confirmRoleChange}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { auth, db } from "../firebase";
// import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
// import ConfirmModal from "./ConfirmModal";
// import "../style/ManageUsers.css";

// export default function ManageUsers() {
//   const [users, setUsers] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [newRole, setNewRole] = useState("");

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const snapshot = await getDocs(collection(db, "users"));
//       const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//       setUsers(data);
//     };
//     fetchUsers();
//   }, []);

//   const handleRoleChangeClick = (userId, role) => {
//     setSelectedUser(userId);
//     setNewRole(role === "admin" ? "user" : "admin"); // toggle role
//     setShowModal(true);
//   };

//   const confirmRoleChange = async () => {
//     await updateDoc(doc(db, "users", selectedUser), { role: newRole });
//     setUsers(users.map(u => u.id === selectedUser ? { ...u, role: newRole } : u));
//     setShowModal(false);
//   };

//   return (
//     <div className="users-grid">
//       {users.map(user => (
//         <div key={user.id} className="user-card">
//           <h3>{user.email}</h3>
//           <p>Role: {user.role}</p>
//           <button 
//             disabled={auth.currentUser?.uid === user.id}
//             onClick={() => handleRoleChangeClick(user.id, user.role)}
//           >
//             {user.role === "admin" ? "Demote to User" : "Promote to Admin"}
//           </button>
//         </div>
//       ))}

//       <ConfirmModal
//         isOpen={showModal}
//         message={`Are you sure you want to change this user's role to ${newRole}?`}
//         onConfirm={confirmRoleChange}
//         onCancel={() => setShowModal(false)}
//       />
//     </div>
//   );
// }
