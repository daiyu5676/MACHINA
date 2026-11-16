import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <nav className="w-[220px] bg-[#FAF7F2] border-r-[2px] border-[#17191B] flex flex-col justify-between shrink-0 max-h-[calc(100vh-60px)] overflow-y-auto hidden md:flex">
      <div className="p-3.5 flex flex-col gap-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center px-3.5 py-2.5 text-[13px] font-semibold transition-colors no-underline ${
              isActive
                ? "bg-[#17191B] text-[#FAF7F2] border-[1.5px] border-[#17191B]"
                : "text-[#17191B] border-[1.5px] border-transparent hover:border-[#17191B] hover:bg-[#F2EDE4]"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/assets"
          className={({ isActive }) =>
            `flex items-center px-3.5 py-2.5 text-[13px] font-semibold transition-colors no-underline ${
              isActive
                ? "bg-[#17191B] text-[#FAF7F2] border-[1.5px] border-[#17191B]"
                : "text-[#17191B] border-[1.5px] border-transparent hover:border-[#17191B] hover:bg-[#F2EDE4]"
            }`
          }
        >
          Assets
        </NavLink>

        <NavLink
          to="/predictions"
          className={({ isActive }) =>
            `flex items-center px-3.5 py-2.5 text-[13px] font-semibold transition-colors no-underline ${
              isActive
                ? "bg-[#17191B] text-[#FAF7F2] border-[1.5px] border-[#17191B]"
                : "text-[#17191B] border-[1.5px] border-transparent hover:border-[#17191B] hover:bg-[#F2EDE4]"
            }`
          }
        >
          Predictions
        </NavLink>

        <NavLink
          to="/insights"
          className={({ isActive }) =>
            `flex items-center px-3.5 py-2.5 text-[13px] font-semibold transition-colors no-underline ${
              isActive
                ? "bg-[#17191B] text-[#FAF7F2] border-[1.5px] border-[#17191B]"
                : "text-[#17191B] border-[1.5px] border-transparent hover:border-[#17191B] hover:bg-[#F2EDE4]"
            }`
          }
        >
          Insights
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            `flex items-center px-3.5 py-2.5 text-[13px] font-semibold transition-colors no-underline ${
              isActive
                ? "bg-[#17191B] text-[#FAF7F2] border-[1.5px] border-[#17191B]"
                : "text-[#17191B] border-[1.5px] border-transparent hover:border-[#17191B] hover:bg-[#F2EDE4]"
            }`
          }
        >
          History
        </NavLink>
      </div>
    </nav>
  );
}

export default Sidebar;
