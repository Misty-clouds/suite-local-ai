"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Calendar, ChevronDown, BarChart2, Landmark } from "lucide-react";
import { useState, useEffect, useRef } from "react";

// Generate mock data for 3 years
const generateMockData = () => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  
  const data = [];
  
  for (let year = 2024; year <= 2026; year++) {
    for (let month = 0; month < 12; month++) {
      data.push({
        name: `${months[month]} ${year}`,
        month: months[month],
        year: year,
        revenue: Math.floor(Math.random() * 20000) + 10000,
        expenses: Math.floor(Math.random() * 15000) + 8000,
        date: new Date(year, month, 1),
      });
    }
  }
  
  return data;
};

const allData = generateMockData();

export default function RevenueChart({ isEmpty = false }: { isEmpty?: boolean }) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(2026, 0, 1),
    end: new Date(2026, 6, 31),
  });
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Derive filtered data directly from dateRange (no useEffect needed)
  const filteredData = allData.filter(item => {
    const itemDate = new Date(item.year, item.date.getMonth(), 1);
    return itemDate >= dateRange.start && itemDate <= dateRange.end;
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDateRange = () => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', year: 'numeric' };
    return `${dateRange.start.toLocaleDateString('en-US', options)} - ${dateRange.end.toLocaleDateString('en-US', options)}`;
  };

  const handlePresetRange = (preset: '1M' | '3M' | '6M' | '1Y' | '3Y') => {
    const end = new Date();
    const start = new Date();
    
    switch (preset) {
      case '1M':
        start.setMonth(end.getMonth() - 1);
        break;
      case '3M':
        start.setMonth(end.getMonth() - 3);
        break;
      case '6M':
        start.setMonth(end.getMonth() - 6);
        break;
      case '1Y':
        start.setFullYear(end.getFullYear() - 1);
        break;
      case '3Y':
        start.setFullYear(end.getFullYear() - 3);
        break;
    }
    
    setDateRange({ start, end });
    setShowDatePicker(false);
  };

  return (
    <div className="rounded-2xl border border-app-border bg-app-card p-6 shadow-lg mb-6">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-medium text-white">
            Revenue Vs. Expenses
          </h3>
          {!isEmpty && (
            <div className="mt-1 flex items-center gap-2 text-xs text-green-500">
              <span>+</span>
              <span>Your net profit increased by 22% in the last 30 days</span>
            </div>
          )}
        </div>
        <div className="relative" ref={datePickerRef}>
          <button 
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center gap-2 rounded-lg border border-app-border px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
          >
            <Calendar size={14} />
            <span>{formatDateRange()}</span>
            <ChevronDown size={12} className={`transition-transform ${showDatePicker ? 'rotate-180' : ''}`} />
          </button>
          
          {showDatePicker && (
            <div className="absolute top-full right-0 mt-2 w-48 rounded-lg border border-app-border bg-app-card-alt shadow-lg z-10">
              <div className="p-2">
                <div className="text-xs text-zinc-500 mb-2 px-2">Select Range</div>
                <button
                  onClick={() => handlePresetRange('1M')}
                  className="w-full text-left px-3 py-2 text-xs text-zinc-400 hover:text-white hover:bg-app-border rounded transition-colors"
                >
                  Last Month
                </button>
                <button
                  onClick={() => handlePresetRange('3M')}
                  className="w-full text-left px-3 py-2 text-xs text-zinc-400 hover:text-white hover:bg-app-border rounded transition-colors"
                >
                  Last 3 Months
                </button>
                <button
                  onClick={() => handlePresetRange('6M')}
                  className="w-full text-left px-3 py-2 text-xs text-zinc-400 hover:text-white hover:bg-app-border rounded transition-colors"
                >
                  Last 6 Months
                </button>
                <button
                  onClick={() => handlePresetRange('1Y')}
                  className="w-full text-left px-3 py-2 text-xs text-zinc-400 hover:text-white hover:bg-app-border rounded transition-colors"
                >
                  Last Year
                </button>
                <button
                  onClick={() => handlePresetRange('3Y')}
                  className="w-full text-left px-3 py-2 text-xs text-zinc-400 hover:text-white hover:bg-app-border rounded transition-colors"
                >
                  Last 3 Years
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="h-75 w-full">
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#222222] border border-[#272727] text-zinc-400">
               <BarChart2 size={24} />
            </div>
            <h4 className="mb-2 text-sm font-medium text-white">No financial data yet</h4>
            <p className="mb-6 max-w-sm text-xs text-zinc-500">
              Connect a bank account or add transactions<br/>to see your revenue and expenses over time.
            </p>
            <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
               <Landmark size={16} />
               Connect Bank Account
            </button>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
            data={filteredData}
            margin={{
              top: 5,
              right: 10,
              left: -20,
              bottom: 0,
            }}
            barGap={8}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--app-border)"
            />
            <XAxis
              dataKey="name"
              stroke="var(--app-text-dim)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="var(--app-text-dim)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{
                backgroundColor: "var(--app-card-alt)",
                border: "1px solid var(--app-border)",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: "20px", fontSize: "12px" }}
            />
            <Bar
              dataKey="revenue"
              name="Revenue"
              fill="var(--brand-primary)"
              radius={[4, 4, 0, 0]}
              barSize={12}
            />
            <Bar
              dataKey="expenses"
              name="Expenses"
              fill="var(--brand-secondary)"
              radius={[4, 4, 0, 0]}
              barSize={12}
            />
          </BarChart>
        </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
