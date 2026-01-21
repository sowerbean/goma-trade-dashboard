'use client';

import { useDateFilter } from '@/providers/date-filter-provider';
import { useOrderData } from '@/hooks/use-order-data';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { useMemo } from 'react';
import { Order } from '@/types';

export default function GoodsBartChart() {
  const { startDate, endDate } = useDateFilter();
  const { data, isLoading, error } = useOrderData();

  const wordFrequencyData = useMemo(() => {
    if (!data) return [];

    const frequencyMap: Record<string, number> = {};

    data.forEach((order: Order) => {
      if (!order.loading_date || !order.goods_type) return;

      const orderDate = new Date(
        order.loading_date.split('/').reverse().join('-')
      );
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      const inRange =
        (!start || orderDate >= start) && (!end || orderDate <= end);

      if (!inRange) return;

      // Clean and split goods_type into words
      const words = order.goods_type
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/);

      words.forEach((word) => {
        if (word.length > 1) {
          frequencyMap[word] = (frequencyMap[word] || 0) + 1;
        }
      });
    });

    const sortedWords = Object.entries(frequencyMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 15)
      .map(([name, total]) => ({ name, total }));

    return sortedWords;
  }, [data, startDate, endDate]);

  if (isLoading) return <p>Loading chart...</p>;
  if (error) return <p className="text-red-500">Failed to load chart data.</p>;

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={wordFrequencyData}>
        <XAxis
          dataKey="name"
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
        />
        <Tooltip labelStyle={{ color: '#808080' }} />
        <Bar dataKey="total" fill="#228292" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
