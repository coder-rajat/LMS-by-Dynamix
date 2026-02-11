import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/courses", label: "Courses" },
  { to: "/quizzes", label: "Quizzes" },
  { to: "/certificates", label: "Certificates" },
  { to: "/profile", label: "Profile" },
];

const adminItems = [
  { to: "/analytics", label: "Analytics" },
  { to: "/admin/users", label: "Users" },
];

const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="side-panel">
        <div className="brand">
          <div className="brand-mark">DN</div>
          <div>
            <p className="brand-title">Dynamix LMS</p>
            <span className="brand-sub">Learn. Track. Grow.</span>
          </div>
        </div>
        <nav className="nav-list">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className="nav-link">
              {item.label}
            </NavLink>
          ))}
          {user?.role === "admin" &&
            adminItems.map((item) => (
              <NavLink key={item.to} to={item.to} className="nav-link">
                {item.label}
              </NavLink>
            ))}
        </nav>
        <div className="side-footer">
          <div className="user-badge">
            <div className="avatar">{user?.name?.[0] || "U"}</div>
            <div>
              <p>{user?.name}</p>
              <span>{user?.role}</span>
            </div>
          </div>
          <button className="ghost" onClick={logout}>
            Sign out
          </button>
        </div>
      </aside>
      <main className="main-panel">
        <header className="top-bar">
          <div>
            <h1>Welcome back, {user?.name}</h1>
            <p>Here is what is happening with your learning journey.</p>
          </div>
          <div className="top-actions">
            <span className="pill">{user?.role}</span>
          </div>
        </header>
        <section className="content-area">{children}</section>
      </main>
    </div>
  );
};

export default Layout;
