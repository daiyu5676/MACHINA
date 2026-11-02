function ExplainabilityPanel({ explanation }) {
  if (!explanation) return null;

  const features = Object.entries(explanation)
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: value
    }))
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

  const maxValue = Math.max(...features.map(f => Math.abs(f.value)));
  const totalContribution = features.reduce((sum, f) => sum + Math.abs(f.value), 0);

  return (
    <div className="bg-white border border-[#CDD2D6] rounded-[6px] p-6">
      <h3 className="font-heading text-[13px] font-semibold tracking-[0.04em] mb-1 text-[#25292C] m-0">
        Model Contributions
      </h3>
      <p className="text-xs text-[#7B858C] mb-5 m-0">
        Feature importance for the current prediction
      </p>

      <div className="flex flex-col gap-4">
        {features.map(feature => {
          const barWidth = maxValue > 0
            ? (Math.abs(feature.value) / maxValue) * 100
            : 0;

          const percentage = totalContribution > 0
            ? Math.round((Math.abs(feature.value) / totalContribution) * 100)
            : 0;

          return (
            <div key={feature.name}>
              <div className="flex justify-between mb-[5px]">
                <span className="text-xs font-semibold text-[#596168] uppercase tracking-[0.06em]">
                  {feature.name}
                </span>
                <span className="font-mono text-xs font-semibold text-[#25292C]">
                  {percentage}%
                </span>
              </div>
              <div className="w-full h-[5px] bg-[#ECEFF1] rounded-sm overflow-hidden">
                <div
                  className="h-full bg-[#60727D] rounded-sm transition-[width] duration-400 ease-out"
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
