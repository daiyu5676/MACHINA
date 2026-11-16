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
    <div className="sensor-card bg-white p-6 sm:p-7 min-h-[140px] flex flex-col justify-between transition-all">
      <div>
        <p className="text-xs font-semibold tracking-[0.06em] text-[#596168] uppercase mb-2.5 m-0">
          {label}
        </p>
        <p className="font-mono text-[26px] font-semibold text-[#17191B] tracking-[-0.02em] m-0 flex items-baseline gap-1.5">
          {value}
          {unit && <span className="font-sans text-[14px] font-medium text-[#596168]">{unit}</span>}
        </p>
      </div>
      {change !== undefined && (
        <p className={`font-mono text-[12px] font-medium pt-2 tracking-normal m-0 ${trendColor}`}>
          {trendSymbol} {Math.abs(change).toFixed(1)}%
        </p>
      )}
    </div>
  );
}

export default SensorCard;
