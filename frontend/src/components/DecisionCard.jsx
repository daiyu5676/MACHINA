import { decisionDescriptions } from "../data/mockData";

/*
  DecisionCard — displays the maintenance recommendation.
  Evolved from the decision-card section in the original App.jsx.
  Same data: decision field (MONITOR / REPAIR / REPLACE).
*/

function DecisionCard({ decision }) {
  const description = decisionDescriptions[decision] || "";

  let statusClass = "decision--monitor";
  if (decision === "REPAIR") statusClass = "decision--attention";
  if (decision === "REPLACE") statusClass = "decision--danger";

  return (
    <div className={`decision-card ${statusClass}`}>
      <p className="decision-card-label">MAINTENANCE RECOMMENDATION</p>
      <h2 className="decision-card-value">{decision}</h2>
      <p className="decision-card-description">{description}</p>
    </div>
  );
}

export default DecisionCard;
