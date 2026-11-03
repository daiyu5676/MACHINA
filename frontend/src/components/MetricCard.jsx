function MetricCard({ title, value, subtitle, status }) {
  const statusBorder =
    status === "healthy"
      ? "shadow-[inset_0_2px_0_#477A5A]"
      : status === "attention"
      ? "shadow-[inset_0_2px_0_#A87532]"
      : status === "danger"
      ? "shadow-[inset_0_2px_0_#A94B4B]"
      : "";

  const statusText =
    status === "healthy"
      ? "text-[#477A5A]"
      : status === "attention"
      ? "text-[#A87532]"
      : status === "danger"
      ? "text-[#A94B4B]"
      : "text-[#7B858C]";

  return (
    <div className={`bg-white p-4 sm:p-[16px_18px] transition-colors ${statusBorder}`}>
      <p className="text-[10px] font-semibold tracking-[0.1em] text-[#60727D] uppercase mb-2 m-0">
        {title}
      </p>
      <p className="font-heading text-[22px] font-bold text-[#17191B] mb-[3px] tracking-[-0.01em] m-0">
        {value}
      </p>
      {subtitle && (
        <p className={`text-xs font-medium m-0 ${statusText}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default MetricCard;
