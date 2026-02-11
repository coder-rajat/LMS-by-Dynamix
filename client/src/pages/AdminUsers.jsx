import { useEffect, useState } from "react";
import api from "../api/client";

const roles = ["student", "teacher", "admin"];

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const loadUsers = () => {
    api.get("/admin/users").then((res) => setUsers(res.data));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateRole = async (id, role) => {
    await api.put(`/admin/users/${id}/role`, { role });
    loadUsers();
  };

  const updateStatus = async (id, isActive) => {
    await api.put(`/admin/users/${id}/status`, { isActive });
    loadUsers();
  };

  return (
    <div className="grid">
      <div className="card">
        <div className="card-header">
          <h3>User management</h3>
          <button className="ghost" onClick={loadUsers}>
            Refresh
          </button>
        </div>
        <div className="table">
          <div className="table-row table-head">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {users.map((user) => (
            <div key={user._id} className="table-row">
              <span>{user.name}</span>
              <span>{user.email}</span>
              <span>
                <select value={user.role} onChange={(e) => updateRole(user._id, e.target.value)}>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </span>
              <span>
                <span className={user.isActive ? "pill" : "pill muted"}>
                  {user.isActive ? "Active" : "Disabled"}
                </span>
              </span>
              <span>
                <button
                  className="ghost"
                  onClick={() => updateStatus(user._id, !user.isActive)}
                >
                  {user.isActive ? "Disable" : "Enable"}
                </button>
              </span>
            </div>
          ))}
          {!users.length && <p>No users found.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
