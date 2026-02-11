import { useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    avatarUrl: user?.avatarUrl || "",
    bio: user?.bio || "",
  });
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await api.put("/users/me", form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="grid">
      <div className="card">
        <h3>Profile</h3>
        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            Name
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>
          <label>
            Avatar URL
            <input
              value={form.avatarUrl}
              onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
            />
          </label>
          <label>
            Bio
            <textarea
              rows="3"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </label>
          <button type="submit" className="primary">
            Save profile
          </button>
          {saved && <span className="pill">Saved</span>}
        </form>
      </div>
    </div>
  );
};

export default Profile;
