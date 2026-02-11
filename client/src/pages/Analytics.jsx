import { useEffect, useMemo, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import api from "../api/client";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Analytics = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/analytics/dashboard").then((res) => setStats(res.data));
  }, []);

  const roleChart = useMemo(() => {
    if (!stats) return null;
    const labels = stats.roleBreakdown.map((item) => item._id);
    const counts = stats.roleBreakdown.map((item) => item.count);
    return {
      labels,
      datasets: [
        {
          label: "Users",
          data: counts,
          backgroundColor: ["#1e88e5", "#43a047", "#fb8c00"],
        },
      ],
    };
  }, [stats]);

  if (!stats) return <div className="card">Loading analytics...</div>;

  return (
    <div className="grid">
      <div className="card">
        <h3>Overview</h3>
        <div className="stats-grid">
          <div>
            <p>Users</p>
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
            <p>Quiz attempts</p>
            <h2>{stats.totalAttempts}</h2>
          </div>
        </div>
      </div>
      <div className="card">
        <h3>Role distribution</h3>
        {roleChart && <Bar data={roleChart} />}
      </div>
      <div className="card">
        <h3>Avg course progress</h3>
        <Doughnut
          data={{
            labels: ["Completed", "Remaining"],
            datasets: [
              {
                data: [stats.avgProgress, 100 - stats.avgProgress],
                backgroundColor: ["#00acc1", "#eceff1"],
              },
            ],
          }}
        />
      </div>
    </div>
  );
};

export default Analytics;
