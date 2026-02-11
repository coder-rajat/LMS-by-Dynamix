import { useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (user?.role === "admin") {
      api.get("/analytics/dashboard").then((res) => setStats(res.data));
    }
    if (user?.role === "student") {
      api.get("/courses/mine").then((res) => setEnrollments(res.data));
    }
    if (user?.role === "teacher") {
      api.get("/courses").then((res) => setCourses(res.data));
    }
  }, [user]);

  return (
    <div className="grid">
      <div className="card">
        <h3>At a glance</h3>
        {user?.role === "admin" && stats && (
          <div className="stats-grid">
            <div>
              <p>Total users</p>
              <h2>{stats.totalUsers}</h2>
            </div>
            <div>
              <p>Courses</p>
              <h2>{stats.totalCourses}</h2>
            </div>
            <div>
              <p>Enrollments</p>
              <h2>{stats.totalEnrollments}</h2>
            </div>
            <div>
              <p>Avg progress</p>
              <h2>{stats.avgProgress}%</h2>
            </div>
          </div>
        )}
        {user?.role === "student" && (
          <div className="stats-grid">
            <div>
              <p>Enrolled courses</p>
              <h2>{enrollments.length}</h2>
            </div>
            <div>
              <p>Average progress</p>
              <h2>
                {enrollments.length
                  ? Math.round(
                      enrollments.reduce((sum, item) => sum + item.progressPercent, 0) /
                        enrollments.length
                    )
                  : 0}
                %
              </h2>
            </div>
          </div>
        )}
        {user?.role === "teacher" && (
          <div className="stats-grid">
            <div>
              <p>Your courses</p>
              <h2>{courses.length}</h2>
            </div>
          </div>
        )}
      </div>
      {user?.role === "student" && (
        <div className="card">
          <h3>Current progress</h3>
          <div className="list">
            {enrollments.map((item) => (
              <div key={item._id} className="list-row">
                <div>
                  <h4>{item.course?.title}</h4>
                  <p>{item.course?.description}</p>
                </div>
                <div className="progress">
                  <span>{item.progressPercent}%</span>
                  <div className="progress-bar">
                    <div style={{ width: `${item.progressPercent}%` }} />
                  </div>
                </div>
              </div>
            ))}
            {!enrollments.length && <p>No enrollments yet.</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

