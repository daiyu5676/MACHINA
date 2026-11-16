function MetricCard({ title, value, subtitle, status }) {
  const statusBorder =
    status === "healthy"
      ? "border-t-[4px] border-t-[#477A5A]"
      : status === "attention"
      ? "border-t-[4px] border-t-[#A87532]"
      : status === "danger"
      ? "border-t-[4px] border-t-[#A94B4B]"
      : "border-t-[4px] border-t-[#60727D]";

  const statusText =
    status === "healthy"
      ? "text-[#477A5A]"
      : status === "attention"
      ? "text-[#A87532]"
      : status === "danger"
      ? "text-[#A94B4B]"
      : "text-[#596168]";

  return (
    <div className={`bg-[#FAF7F2] p-5 sm:p-6 flex flex-col justify-between min-h-[135px] transition-colors border-[1.5px] border-[#17191B] ${statusBorder}`}>
      <div>
        <p className="text-[12px] sm:text-[13px] font-bold tracking-[0.14em] text-[#596168] uppercase mb-2.5 m-0">
          {title}
        </p>
        <p className="font-heading text-[30px] sm:text-[34px] font-black text-[#17191B] tracking-tight leading-none mb-2.5 m-0">
          {value}
        </p>
      </div>
      {subtitle && (
        <p className={`text-[13px] sm:text-[14px] font-bold m-0 ${statusText}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default MetricCard;
