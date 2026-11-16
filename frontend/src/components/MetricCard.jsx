function MetricCard({ title, value, subtitle, status }) {
  const statusBorder =
    status === "healthy"
      ? "border-t-[3px] border-t-[#477A5A]"
      : status === "attention"
      ? "border-t-[3px] border-t-[#A87532]"
      : status === "danger"
      ? "border-t-[3px] border-t-[#A94B4B]"
      : "border-t-[3px] border-t-[#60727D]";

  const statusText =
    status === "healthy"
      ? "text-[#477A5A]"
      : status === "attention"
      ? "text-[#A87532]"
      : status === "danger"
      ? "text-[#A94B4B]"
      : "text-[#7B858C]";

  return (
    <div className={`bg-[#FAF7F2] p-4 sm:p-[16px_18px] transition-colors border-[1.5px] border-[#17191B] ${statusBorder}`}>
      <p className="text-[10px] font-bold tracking-[0.1em] text-[#60727D] uppercase mb-2 m-0">
        {title}
      </p>
      <p className="font-heading text-[22px] font-bold text-[#17191B] mb-[3px] tracking-[-0.01em] m-0">
        {value}
      </p>
      {subtitle && (
        <p className={`text-xs font-semibold m-0 ${statusText}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default MetricCard;
