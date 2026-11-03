function SensorCard({ label, value, unit, change }) {
  let trendSymbol = "─";
  let trendColor = "text-[#7B858C]";

  if (change > 0) {
    trendSymbol = "↑";
    trendColor = "text-[#A87532]";
  } else if (change < 0) {
    trendSymbol = "↓";
    trendColor = "text-[#315D72]";
  }

  return (
    <div className="bg-white p-3.5 sm:p-[14px_16px]">
      <p className="text-[10px] font-semibold tracking-[0.1em] text-[#60727D] uppercase mb-2 m-0">
        {label}
      </p>
      <p className="font-mono text-[22px] font-semibold text-[#17191B] tracking-[-0.02em] m-0">
        {value}
        {unit && <span className="font-sans text-xs font-medium text-[#7B858C]"> {unit}</span>}
      </p>
      {change !== undefined && (
        <p className={`font-mono text-[11px] font-medium mt-1.5 tracking-normal m-0 ${trendColor}`}>
          {trendSymbol} {Math.abs(change).toFixed(1)}%
        </p>
      )}
    </div>
  );
}

export default SensorCard;
