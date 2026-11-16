function SensorCard({ label, value, unit, change }) {
  let trendSymbol = "─";
  let trendColor = "text-[#596168]";

  if (change > 0) {
    trendSymbol = "↑";
    trendColor = "text-[#A87532]";
  } else if (change < 0) {
    trendSymbol = "↓";
    trendColor = "text-[#17191B]";
  }

  return (
    <div className="bg-[#FAF7F2] p-5 sm:p-6 flex flex-col justify-between min-h-[125px] border-[1.5px] border-[#17191B]">
      <div>
        <p className="text-[12px] sm:text-[13px] font-bold tracking-[0.14em] text-[#596168] uppercase mb-2.5 m-0">
          {label}
        </p>
        <p className="font-mono text-[30px] sm:text-[34px] font-black text-[#17191B] tracking-tight leading-none m-0">
          {value}
          {unit && <span className="font-sans text-[15px] sm:text-[16px] font-bold text-[#596168]"> {unit}</span>}
        </p>
      </div>
      {change !== undefined && (
        <p className={`font-mono text-[13px] font-bold mt-2.5 tracking-normal m-0 ${trendColor}`}>
          {trendSymbol} {Math.abs(change).toFixed(1)}%
        </p>
      )}
    </div>
  );
}

export default SensorCard;
