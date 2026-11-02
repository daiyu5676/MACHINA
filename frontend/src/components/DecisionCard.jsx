import { decisionDescriptions } from "../data/mockData";

function DecisionCard({ decision }) {
  const description = decisionDescriptions[decision] || "";

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
    <div className={`bg-white border border-[#CDD2D6] border-t-2 rounded-[6px] p-6 ${borderColor}`}>
      <p className="text-[10px] font-semibold tracking-[0.12em] text-[#60727D] uppercase mb-2.5 m-0">
        MAINTENANCE RECOMMENDATION
      </p>
      <h2 className={`font-heading text-[26px] font-bold tracking-[0.04em] mb-2.5 m-0 ${textColor}`}>
        {decision}
      </h2>
      <p className="text-[13px] text-[#596168] leading-[1.65] m-0">
        {description}
      </p>
    </div>
  );
}

export default DecisionCard;
