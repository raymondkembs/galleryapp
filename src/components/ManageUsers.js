import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import ConfirmModal from "./ConfirmModal";
import { FaUser, FaShieldAlt } from "react-icons/fa";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

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

  // 🔧 Filtering logic
  // const filteredUsers = users.filter(user => {
  //   const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesRole = roleFilter ? user.role === roleFilter : true;
  //   return matchesSearch && matchesRole;
  // });

  const filteredUsers = users.filter(user => {
    const email = user.email || ""; // fallback to empty string
    const matchesSearch = email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  return (
    <div>
      {/* Search + Filter Controls */}
      <div className="user-controls">
        <input
          type="text"
          placeholder="Search by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          <option value="admin">Admins</option>
          <option value="user">Users</option>
        </select>
      </div>

      {/* User Cards */}
      <div className="users-grid">
        {filteredUsers.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-header">
              <img
                src={user.profilePic || "https://via.placeholder.com/50"}
                alt="avatar"
                className="avatar"
              />
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
      </div>

      <ConfirmModal
        isOpen={showModal}
        message={`Change this user's role to ${newRole}?`}
        onConfirm={confirmRoleChange}
        onCancel={() => setShowModal(false)}
      />

    </div>
  );
}
