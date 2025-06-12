// components/cards/card-two.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useOrderData } from '@/hooks/use-order-data';
import { parseDate } from '@/lib/date-parsing-sorting';

function getOrderStatsThisYear(data: any[]) {
  const today = new Date();
  const thisYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDate = today.getDate();

  let currentYearOrders = 0;
  let previousYearOrders = 0;

  data.forEach((order) => {
    const dateStr = order.loading_date || order.date_in;
    const parsed = parseDate(dateStr);
    if (!parsed) return;

    if (parsed.getFullYear() === thisYear && parsed <= today) {
      currentYearOrders++;
    } else if (
      parsed.getFullYear() === thisYear - 1 &&
      (parsed.getMonth() < todayMonth ||
        (parsed.getMonth() === todayMonth && parsed.getDate() <= todayDate))
    ) {
      previousYearOrders++;
    }
  });

  const percentageChange =
    previousYearOrders === 0
      ? 100
      : ((currentYearOrders - previousYearOrders) / previousYearOrders) * 100;

  return {
    currentYearOrders,
    percentageChange
  };
}

export default function CardTwo() {
  const { data, isLoading, error } = useOrderData();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading orders</div>;

  const { currentYearOrders, percentageChange } = getOrderStatsThisYear(data);
  const sign = percentageChange >= 0 ? '+' : '';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Orders This Year</CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{currentYearOrders}</div>
        <p className="text-xs text-muted-foreground">
          {sign}
          {percentageChange.toFixed(1)}% form same time last year
        </p>
      </CardContent>
    </Card>
  );
}
