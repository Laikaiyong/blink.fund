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
  { name: "Jan", USDC: 4000 },
  { name: "Feb", USDC: 3000 },
  { name: "Mar", USDC: 5000 },
  { name: "Apr", USDC: 4500 },
  { name: "May", USDC: 6000 },
  { name: "Jun", USDC: 5500 },
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
        <Line type="monotone" dataKey="USDC" stroke="#AB9EF2" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}
