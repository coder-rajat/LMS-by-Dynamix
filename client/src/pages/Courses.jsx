import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Courses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "General",
    level: "beginner",
    isPublished: true,
  });

  const loadCourses = () => {
    const endpoint = user?.role === "student" ? "/courses/public" : "/courses";
    api.get(endpoint).then((res) => setCourses(res.data));
  };

  useEffect(() => {
    if (user) {
      loadCourses();
    }
  }, [user]);

  const handleCreate = async (event) => {
    event.preventDefault();
    await api.post("/courses", form);
    setForm({ title: "", description: "", category: "General", level: "beginner", isPublished: true });
    loadCourses();
  };

  const handleEnroll = async (courseId) => {
    await api.post(`/courses/${courseId}/enroll`);
  };

  return (
    <div className="grid">
      {(user?.role === "teacher" || user?.role === "admin") && (
        <div className="card">
          <h3>Create a course</h3>
          <form onSubmit={handleCreate} className="form-grid">
            <label>
              Title
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </label>
            <label>
              Description
              <textarea
                rows="3"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </label>
            <div className="split">
              <label>
                Category
                <input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
              </label>
              <label>
                Level
                <select
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </label>
            </div>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
              />
              Publish immediately
            </label>
            <button className="primary" type="submit">
              Save course
            </button>
          </form>
        </div>
      )}
      <div className="card">
        <div className="card-header">
          <h3>Courses</h3>
        </div>
        <div className="list">
          {courses.map((course) => (
            <div key={course._id} className="list-row">
              <div>
                <h4>{course.title}</h4>
                <p>{course.description}</p>
                <span className="meta">
                  {course.category} ? {course.level}
                </span>
              </div>
              <div className="row-actions">
                <Link className="ghost" to={`/courses/${course._id}`}>
                  View
                </Link>
                {user?.role === "student" && (
                  <button className="primary" onClick={() => handleEnroll(course._id)}>
                    Enroll
                  </button>
                )}
              </div>
            </div>
          ))}
          {!courses.length && <p>No courses yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default Courses;
