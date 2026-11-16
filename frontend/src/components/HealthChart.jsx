import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

function HealthChart({ data, title }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-[#FAF7F2] border-[1.5px] border-[#17191B] p-5 mb-5">
      <h3 className="font-heading text-[13px] font-bold tracking-[0.04em] mb-4 text-[#17191B] m-0">
        {title || "Asset Health Trend"}
      </h3>

      <div className="-ml-2.5">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#DCD6CD" />
            <XAxis
              dataKey="time"
              stroke="#17191B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#17191B" }}
            />
            <YAxis
              domain={[0, 100]}
              stroke="#17191B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#17191B" }}
            />
            <Tooltip
              contentStyle={{
                background: "#FAF7F2",
                border: "1.5px solid #17191B",
                borderRadius: "0px",
                color: "#17191B",
                fontSize: "12px",
                fontFamily: "'Roboto', Arial, sans-serif"
              }}
              labelStyle={{ color: "#17191B", fontWeight: 700, fontSize: "11px", letterSpacing: "0.04em" }}
            />
            <Line
              type="monotone"
              dataKey="health"
              stroke="#17191B"
              strokeWidth={2}
              dot={{ fill: "#17191B", r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#17191B", strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default HealthChart;
