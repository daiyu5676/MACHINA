/*
  SensorCard — displays one sensor reading.
  Evolved from the <Sensor> component in the original App.jsx.
  Same fields: label, value, unit.
  Added: optional trend indicator (up/down/stable).
*/

function SensorCard({ label, value, unit, change }) {
  let trendSymbol = "─";
  let trendClass = "sensor-trend--stable";

  if (change > 0) {
    trendSymbol = "↑";
    trendClass = "sensor-trend--up";
  } else if (change < 0) {
    trendSymbol = "↓";
    trendClass = "sensor-trend--down";
  }

  return (
    <div className="sensor-card">
      <p className="sensor-card-label">{label}</p>
      <p className="sensor-card-value">
        {value}
        {unit && <span className="sensor-card-unit"> {unit}</span>}
      </p>
      {change !== undefined && (
        <p className={`sensor-card-trend ${trendClass}`}>
          {trendSymbol} {Math.abs(change).toFixed(1)}%
        </p>
      )}
    </div>
  );
}

export default SensorCard;
