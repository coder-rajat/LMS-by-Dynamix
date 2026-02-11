import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

 const handleSubmit = async (event) => {
  event.preventDefault();
  setError("");
  try {
    await register(form);
    navigate("/dashboard");
  } catch (err) {
    setError(
      err?.response?.data?.message ||
        err?.message ||
        "Registration failed. Please try again."
    );
  }
};


  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1>Create your account</h1>
        <p>Choose your role and start building learning experiences.</p>
        {error && <div className="alert">{error}</div>}
        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            Full name
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </label>
          <label>
            Role
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <button type="submit" className="primary">
            Create account
          </button>
        </form>
        <p className="helper">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
