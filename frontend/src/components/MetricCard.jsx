function MetricCard({ title, value, subtitle, status }) {
  // status can be: "healthy", "attention", "danger", or undefined
  const statusClass = status ? `metric-card--${status}` : "";

  return (
    <div className={`metric-card ${statusClass}`}>
      <p className="metric-card-title">{title}</p>
      <p className="metric-card-value">{value}</p>
      {subtitle && (
        <p className={`metric-card-subtitle ${status ? `text-${status}` : ""}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default MetricCard;
