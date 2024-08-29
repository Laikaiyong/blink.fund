'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const chartData = [
  { name: "Jan", DAI: 4000 },
  { name: "Feb", DAI: 3000 },
  { name: "Mar", DAI: 5000 },
  { name: "Apr", DAI: 4500 },
  { name: "May", DAI: 6000 },
  { name: "Jun", DAI: 5500 },
];

export default function CustomLineChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="name" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1F2937",
            border: "none",
            color: "#fff",
          }}
        />
        <Line type="monotone" dataKey="DAI" stroke="#AB9EF2" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
