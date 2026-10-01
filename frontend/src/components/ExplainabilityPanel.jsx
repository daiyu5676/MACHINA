/*
  ExplainabilityPanel — shows SHAP feature contributions.
  Evolved from the <Explanation> component in the original App.jsx.
  Displays horizontal bars sized by each feature's SHAP value.
*/

function ExplainabilityPanel({ explanation }) {
  if (!explanation) return null;

  // Convert explanation object to sorted array
  const features = Object.entries(explanation)
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: value
    }))
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

  // Find max value for scaling bars
  const maxValue = Math.max(...features.map(f => Math.abs(f.value)));

  // Calculate percentage contribution for each feature
  const totalContribution = features.reduce((sum, f) => sum + Math.abs(f.value), 0);

  return (
    <div className="explainability-panel">
      <h3 className="explainability-title">Model Contributions</h3>
      <p className="explainability-subtitle">
        Feature importance for the current prediction
      </p>

      <div className="explainability-features">
        {features.map(feature => {
          const barWidth = maxValue > 0
            ? (Math.abs(feature.value) / maxValue) * 100
            : 0;

          const percentage = totalContribution > 0
            ? Math.round((Math.abs(feature.value) / totalContribution) * 100)
            : 0;

          return (
            <div key={feature.name} className="explainability-row">
              <div className="explainability-row-header">
                <span className="explainability-feature-name">{feature.name}</span>
                <span className="explainability-feature-pct">{percentage}%</span>
              </div>
              <div className="explainability-bar">
                <div
                  className="explainability-bar-fill"
                  style={{ width: `${barWidth}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ExplainabilityPanel;
