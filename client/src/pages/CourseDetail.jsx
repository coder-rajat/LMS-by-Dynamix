import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const emptyLesson = () => ({ title: "", type: "article", content: "", durationMinutes: 10 });

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(0);
  const [lessons, setLessons] = useState([]);
  const [saving, setSaving] = useState(false);

  const canEdit = useMemo(() => user?.role === "teacher" || user?.role === "admin", [user]);

  useEffect(() => {
    api.get(`/courses/${id}`).then((res) => {
      setCourse(res.data);
      setLessons(res.data.lessons || []);
    });
  }, [id]);

  const updateProgress = async () => {
    await api.put(`/courses/${id}/progress`, { progressPercent: Number(progress) });
  };

  const updateLesson = (index, patch) => {
    setLessons((prev) => prev.map((lesson, i) => (i === index ? { ...lesson, ...patch } : lesson)));
  };

  const addLesson = () => {
    setLessons((prev) => [...prev, emptyLesson()]);
  };

  const removeLesson = (index) => {
    setLessons((prev) => prev.filter((_, i) => i !== index));
  };

  const saveLessons = async () => {
    setSaving(true);
    await api.put(`/courses/${id}`, { lessons });
    const { data } = await api.get(`/courses/${id}`);
    setCourse(data);
    setLessons(data.lessons || []);
    setSaving(false);
  };

  if (!course) return <div className="card">Loading...</div>;

  return (
    <div className="grid">
      <div className="card">
        <h2>{course.title}</h2>
        <p>{course.description}</p>
        <div className="chip-row">
          <span className="pill">{course.category}</span>
          <span className="pill">{course.level}</span>
          <span className="pill">{course.isPublished ? "Published" : "Draft"}</span>
        </div>
      </div>
      {user?.role === "student" && (
        <div className="card">
          <h3>Update progress</h3>
          <p>Enter your completion percentage to update progress.</p>
          <div className="split">
            <input
              type="number"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
            />
            <button className="primary" onClick={updateProgress}>
              Update
            </button>
          </div>
        </div>
      )}

      {canEdit && (
        <div className="card">
          <div className="card-header">
            <h3>Lesson editor</h3>
            <button className="ghost" onClick={addLesson}>
              Add lesson
            </button>
          </div>
          <div className="list">
            {lessons.map((lesson, index) => (
              <div key={lesson._id || index} className="lesson-editor">
                <div className="card-header">
                  <h4>Lesson {index + 1}</h4>
                  <button className="ghost" onClick={() => removeLesson(index)}>
                    Remove
                  </button>
                </div>
                <div className="form-grid">
                  <label>
                    Title
                    <input
                      value={lesson.title}
                      onChange={(e) => updateLesson(index, { title: e.target.value })}
                      required
                    />
                  </label>
                  <div className="split">
                    <label>
                      Type
                      <select
                        value={lesson.type}
                        onChange={(e) => updateLesson(index, { type: e.target.value })}
                      >
                        <option value="video">Video</option>
                        <option value="article">Article</option>
                        <option value="quiz">Quiz</option>
                        <option value="assignment">Assignment</option>
                      </select>
                    </label>
                    <label>
                      Duration (min)
                      <input
                        type="number"
                        min="0"
                        value={lesson.durationMinutes}
                        onChange={(e) => updateLesson(index, { durationMinutes: Number(e.target.value) })}
                      />
                    </label>
                  </div>
                  <label>
                    Content
                    <textarea
                      rows="3"
                      value={lesson.content}
                      onChange={(e) => updateLesson(index, { content: e.target.value })}
                    />
                  </label>
                </div>
              </div>
            ))}
            {!lessons.length && <p>No lessons yet. Add one to get started.</p>}
          </div>
          <div className="row-actions">
            <button className="primary" onClick={saveLessons} disabled={saving}>
              {saving ? "Saving..." : "Save lessons"}
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <h3>Lessons</h3>
        {course.lessons?.length ? (
          <div className="list">
            {course.lessons.map((lesson) => (
              <div key={lesson._id} className="list-row">
                <div>
                  <h4>{lesson.title}</h4>
                  <p>{lesson.type}</p>
                </div>
                <span>{lesson.durationMinutes} min</span>
              </div>
            ))}
          </div>
        ) : (
          <p>No lessons yet.</p>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
