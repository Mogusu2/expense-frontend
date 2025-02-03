import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", income: 5000, expense: 3000 },
  { month: "Feb", income: 5200, expense: 3100 },
  { month: "Mar", income: 5300, expense: 3200 },
  { month: "Apr", income: 5400, expense: 3300 },
  { month: "May", income: 5500, expense: 3400 },
];

const IncomeExpenseChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="income" stroke="#1ABB9C" strokeWidth={2} />
        <Line type="monotone" dataKey="expense" stroke="#E74C3C" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default IncomeExpenseChart;
