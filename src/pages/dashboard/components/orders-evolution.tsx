'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { useDateFilter } from '@/providers/date-filter-provider';
import { useOrderData } from '@/hooks/use-order-data';
import { parseDate } from '@/lib/date-parsing-sorting'; // Ensure this exports your parseDate function
import { Order } from '@/types';

export default function ClientOrdersEvolutionChart() {
  const { startDate, endDate } = useDateFilter();
  const { data, isLoading, error } = useOrderData();

  const monthlyData = useMemo(() => {
    if (!data) return [];

    const monthlyCount: Record<string, number> = {};

    data.forEach((order: Order) => {
      const date = parseDate(order.loading_date);
      if (!date) return;

      if (
        (startDate && date < new Date(startDate)) ||
        (endDate && date > new Date(endDate))
      ) {
        return;
      }

      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        '0'
      )}`; // Format: yyyy-mm

      monthlyCount[key] = (monthlyCount[key] || 0) + 1;
    });

    const result = Object.entries(monthlyCount)
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([month, total]) => ({ month, total }));

    return result;
  }, [data, startDate, endDate]);

  if (isLoading) return <p>Loading chart...</p>;
  if (error) return <p className="text-red-500">Failed to load chart data.</p>;

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={monthlyData}>
        <XAxis
          dataKey="month"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#228292"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
