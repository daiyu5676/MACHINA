import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

function HealthChart({ data, title }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-white border border-[#CDD2D6] rounded-[6px] p-5 mb-5">
      <h3 className="font-heading text-[13px] font-semibold tracking-[0.04em] mb-4 text-[#25292C] m-0">
        {title || "Asset Health Trend"}
      </h3>

      <div className="-ml-2.5">
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
