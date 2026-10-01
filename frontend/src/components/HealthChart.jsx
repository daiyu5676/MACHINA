import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

/*
  HealthChart — shows asset health score over time.
  Uses Recharts (the chart library mentioned in PROGRESS.md / Slice 5).
*/

function HealthChart({ data, title }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="health-chart">
      <h3 className="health-chart-title">{title || "Asset Health Trend"}</h3>

      <div className="health-chart-container">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E6E9" />
            <XAxis
              dataKey="time"
              stroke="#7B858C"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#CDD2D6" }}
            />
            <YAxis
              domain={[0, 100]}
              stroke="#7B858C"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#CDD2D6" }}
            />
            <Tooltip
              contentStyle={{
                background: "#FFFFFF",
                border: "1px solid #CDD2D6",
                borderRadius: "4px",
                color: "#25292C",
                fontSize: "12px",
                fontFamily: "'Inter', sans-serif",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
              }}
              labelStyle={{ color: "#596168", fontWeight: 600, fontSize: "11px", letterSpacing: "0.04em" }}
            />
            <Line
              type="monotone"
              dataKey="health"
              stroke="#315D72"
              strokeWidth={2}
              dot={{ fill: "#315D72", r: 2.5, strokeWidth: 0 }}
              activeDot={{ r: 4, fill: "#315D72", strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default HealthChart;
