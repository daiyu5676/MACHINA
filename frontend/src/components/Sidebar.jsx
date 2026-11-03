import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <nav className="w-[220px] bg-white border-r border-[#CDD2D6] flex flex-col justify-between shrink-0 max-h-[calc(100vh-52px)] overflow-y-auto hidden md:flex">
      <div className="p-[14px_10px] flex flex-col gap-[1px]">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-[9px] rounded text-[13px] font-medium transition-colors no-underline ${
              isActive
                ? "bg-[#315D72]/10 text-[#315D72] font-semibold [&>svg]:opacity-90"
                : "text-[#596168] hover:bg-[#ECEFF1] hover:text-[#25292C] [&>svg]:opacity-55"
            }`
          }
        >
          <svg className="shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          Dashboard
        </NavLink>

        <NavLink
          to="/assets"
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-[9px] rounded text-[13px] font-medium transition-colors no-underline ${
              isActive
                ? "bg-[#315D72]/10 text-[#315D72] font-semibold [&>svg]:opacity-90"
                : "text-[#596168] hover:bg-[#ECEFF1] hover:text-[#25292C] [&>svg]:opacity-55"
            }`
          }
        >
          <svg className="shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          Assets
        </NavLink>

        <NavLink
          to="/predictions"
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-[9px] rounded text-[13px] font-medium transition-colors no-underline ${
              isActive
                ? "bg-[#315D72]/10 text-[#315D72] font-semibold [&>svg]:opacity-90"
                : "text-[#596168] hover:bg-[#ECEFF1] hover:text-[#25292C] [&>svg]:opacity-55"
            }`
          }
        >
          <svg className="shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          Predictions
        </NavLink>

        <NavLink
          to="/insights"
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-[9px] rounded text-[13px] font-medium transition-colors no-underline ${
              isActive
                ? "bg-[#315D72]/10 text-[#315D72] font-semibold [&>svg]:opacity-90"
                : "text-[#596168] hover:bg-[#ECEFF1] hover:text-[#25292C] [&>svg]:opacity-55"
            }`
          }
        >
          <svg className="shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          Insights
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-3 py-[9px] rounded text-[13px] font-medium transition-colors no-underline ${
              isActive
                ? "bg-[#315D72]/10 text-[#315D72] font-semibold [&>svg]:opacity-90"
                : "text-[#596168] hover:bg-[#ECEFF1] hover:text-[#25292C] [&>svg]:opacity-55"
            }`
          }
        >
          <svg className="shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          History
        </NavLink>
      </div>

      <div className="p-[14px_10px] border-t border-[#E2E6E9]">
        <div className="flex items-center gap-2.5 px-3 py-2">
          <span className="w-[7px] h-[7px] rounded-full shrink-0 bg-[#477A5A]"></span>
          <div>
            <p className="text-[10px] text-[#7B858C] tracking-[0.08em] uppercase font-semibold m-0">System Status</p>
            <p className="text-xs text-[#477A5A] font-medium mt-[1px] m-0">All Services Online</p>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Sidebar;
