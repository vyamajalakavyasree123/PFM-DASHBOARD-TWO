import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function BarChartComponent({ data }) {

  const chartData = data
    ? Object.keys(data).map(key => ({
        month: key,
        amount: data[key]
      }))
    : [];

  return (
    <div
      className="bar-chart-container"
      style={{
        width: "100%",
        maxWidth:"400px",
        height: 300,
        marginBottom: "40px"
      }}
    >
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#4CAF50" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChartComponent;