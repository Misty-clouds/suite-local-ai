"use client";

import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const gaugeData = [
  { value: 70, color: "#A6DDB0" },
  { value: 20, color: "#FB9999" },
  { value: 10, color: "#B0F5FF" },
];

export function GaugeChart({ total }: { total: string }) {
  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-full" style={{ height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={gaugeData}
              cx="50%"
              cy="90%"
              startAngle={180}
              endAngle={0}
              innerRadius="60%"
              outerRadius="85%"
              dataKey="value"
              stroke="none"
              paddingAngle={2}
            >
              {gaugeData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-end pb-3 pointer-events-none">
          <span className="text-2xl font-bold text-white">{total}</span>
          <span className="text-xs text-zinc-500 mt-0.5">Total expenses</span>
        </div>
      </div>
    </div>
  );
}
