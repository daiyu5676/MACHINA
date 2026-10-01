import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <nav className="sidebar">

      <div className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link--active" : ""}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          Dashboard
        </NavLink>

        <NavLink to="/assets" className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link--active" : ""}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          Assets
        </NavLink>

        <NavLink to="/predictions" className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link--active" : ""}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          Predictions
        </NavLink>

        <NavLink to="/insights" className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link--active" : ""}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          Insights
        </NavLink>

        <NavLink to="/history" className={({ isActive }) => `sidebar-link ${isActive ? "sidebar-link--active" : ""}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          History
        </NavLink>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-status">
          <span className="status-dot status-dot--online"></span>
          <div>
            <p className="sidebar-status-label">System Status</p>
            <p className="sidebar-status-value">All Services Online</p>
          </div>
        </div>
      </div>

    </nav>
  );
}

export default Sidebar;
