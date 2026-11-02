function Header() {
  return (
    <header className="flex justify-between items-center h-[52px] px-4 sm:px-6 bg-white border-b border-[#CDD2D6] shrink-0">
      <div className="flex items-baseline gap-3.5">
        <h1 className="font-heading text-[15px] font-bold tracking-[0.08em] text-[#17191B] m-0">
          MACHINA
        </h1>
        <span className="text-xs text-[#60727D] tracking-[0.02em] font-normal hidden sm:inline">
          Predictive Maintenance
        </span>
      </div>

      <div className="flex items-center">
        <span className="flex items-center gap-[7px] text-[11px] font-semibold text-[#60727D] tracking-[0.06em] uppercase">
          <span className="w-[7px] h-[7px] rounded-full shrink-0 bg-[#477A5A]"></span>
          SYSTEM OPERATIONAL
        </span>
      </div>
    </header>
  );
}

export default Header;
