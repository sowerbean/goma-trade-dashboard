// components/cards/card-three.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useOrderData } from '@/hooks/use-order-data';
import { parseDate } from '@/lib/date-parsing-sorting';

function getClientStats(data: any[]) {
  const thisYear = new Date().getFullYear();
  const clientsMap: Record<string, Date[]> = {};

  data.forEach((order) => {
    const phone = order.client_phone_number;
    const dateStr = order.loading_date || order.date_in;
    const date = parseDate(dateStr);
    if (!phone || !date) return;

    if (!clientsMap[phone]) {
      clientsMap[phone] = [];
    }
    clientsMap[phone].push(date);
  });

  let totalClients = 0;
  let newClientsThisYear = 0;

  Object.values(clientsMap).forEach((dates) => {
    totalClients++;
    const years = dates.map((d) => d.getFullYear());
    const isOnlyThisYear = years.every((y) => y === thisYear);
    if (isOnlyThisYear) newClientsThisYear++;
  });

  return { totalClients, newClientsThisYear };
}

export default function CardThree() {
  const { data, isLoading, error } = useOrderData();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading orders</div>;

  const { totalClients, newClientsThisYear } = getClientStats(data);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Unique Clients</CardTitle>
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
        </svg>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalClients}</div>
        <p className="text-xs text-muted-foreground">
          {newClientsThisYear} new this year
        </p>
      </CardContent>
    </Card>
  );
}
