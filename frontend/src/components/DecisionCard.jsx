import { decisionDescriptions } from "../data/mockData";

function DecisionCard({ decision, strategy, reason }) {
  const defaultDescription = decisionDescriptions[decision] || "";
  const effectiveDescription = reason || defaultDescription;

  let borderColor = "border-t-[#477A5A]";
  let textColor = "text-[#477A5A]";

  if (decision === "REPAIR") {
    borderColor = "border-t-[#A87532]";
    textColor = "text-[#A87532]";
  } else if (decision === "REPLACE") {
    borderColor = "border-t-[#A94B4B]";
    textColor = "text-[#A94B4B]";
  }

  return (
    <div className={`bg-[#FAF7F2] border-[1.5px] border-[#17191B] border-t-[4px] p-6 ${borderColor}`}>
      <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
        <p className="text-[10px] font-bold tracking-[0.12em] text-[#60727D] uppercase m-0">
          MAINTENANCE RECOMMENDATION
        </p>
        {strategy && (
          <span className="font-mono text-[10px] font-bold px-2 py-0.5 border border-[#17191B] bg-[#FAF7F2] text-[#17191B] tracking-wider uppercase" title="GoF Pattern: Strategy evaluated by Java Decision Engine">
            Strategy: {strategy}
          </span>
        )}
      </div>

      <h2 className={`font-heading text-[26px] font-black tracking-[0.04em] mb-2.5 m-0 ${textColor}`}>
        {decision}
      </h2>

      <p className="text-[13px] text-[#25292C] font-semibold leading-[1.65] mb-2 m-0">
        {effectiveDescription}
      </p>

      {reason && defaultDescription && (
        <p className="text-[12px] text-[#7B858C] leading-[1.5] m-0 border-t border-[#17191B] pt-2 mt-2">
          {defaultDescription}
        </p>
      )}
    </div>
  );
}

export default DecisionCard;
