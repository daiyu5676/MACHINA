function MetricCard({ title, value, subtitle, status }) {
  const statusBorder =
    status === "healthy"
      ? "shadow-[inset_0_3px_0_#477A5A]"
      : status === "attention"
      ? "shadow-[inset_0_3px_0_#A87532]"
      : status === "danger"
      ? "shadow-[inset_0_3px_0_#A94B4B]"
      : status === "pending"
      ? "shadow-[inset_0_3px_0_#60727D]"
      : "";

  const statusText =
    status === "healthy"
      ? "text-[#477A5A]"
      : status === "attention"
      ? "text-[#A87532]"
      : status === "danger"
      ? "text-[#A94B4B]"
      : "text-[#596168]";

  return (
    <div className={`metric-card bg-white p-6 sm:p-7 min-h-[155px] flex flex-col justify-between transition-all ${statusBorder}`}>
      <div>
        <p className="text-xs font-semibold tracking-[0.06em] text-[#596168] uppercase mb-2.5 m-0">
          {title}
        </p>
        <p className="font-heading text-[26px] font-bold text-[#17191B] mb-1 tracking-[-0.01em] m-0">
          {value}
        </p>
      </div>
      {subtitle && (
        <p className={`text-[13px] font-medium m-0 pt-2 ${statusText}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default MetricCard;
