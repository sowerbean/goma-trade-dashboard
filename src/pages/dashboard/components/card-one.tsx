'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrderData } from '@/hooks/use-order-data'; // adjust path

export default function CardOne() {
  const { data: orders, isLoading, isError } = useOrderData();

  const totalOrders = orders?.length ?? 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
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
          <path d="M3 3h18v4H3z" />
          <path d="M3 7v13h18V7" />
          <path d="M16 11h2v2h-2zM12 11h2v2h-2zM8 11h2v2H8z" />
        </svg>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoading ? 'Loading...' : totalOrders}
        </div>
        <p className="text-xs text-muted-foreground">
          {isError
            ? 'Failed to load orders'
            : 'All-time total number of orders'}
        </p>
      </CardContent>
    </Card>
  );
}
