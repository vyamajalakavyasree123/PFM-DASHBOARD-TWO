import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function PieChartComponent({ data }) {
  const chartData = data
    ? Object.keys(data).map(key => ({
        name: key,
        value: data[key]
      }))
    : [];

  return (
    <div
      className="pie-chart-container"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <PieChart width={300} height={300}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
        > 
          {chartData.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
}

export default PieChartComponent;