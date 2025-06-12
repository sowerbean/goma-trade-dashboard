import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrderData } from '@/hooks/use-order-data';
import { useMemo } from 'react';
import { parseDate } from '@/lib/date-parsing-sorting'; //for string dates

interface SupplierSummaryCardsProps {
  supplierPhone: string | null;
}

export default function SupplierSummaryCards({
  supplierPhone
}: SupplierSummaryCardsProps) {
  const { data: orders } = useOrderData();

  const summary = useMemo(() => {
    if (!supplierPhone || !orders) return null;

    const supplierOrders = orders.filter(
      (order) => order.supplier_phone_number === supplierPhone
    );

    if (supplierOrders.length === 0) return null;

    const orderDates = supplierOrders
      .map((o) => parseDate(o.loading_date))
      .filter((d): d is Date => d !== null) // filter out nulls
      .sort((a, b) => a.getTime() - b.getTime());

    const oldestDate = orderDates[0];
    const latestDate = orderDates[orderDates.length - 1];

    // Group by client_id
    const clientsMap: Record<
      string,
      { count: number; lastDate: Date; name?: string }
    > = {};

    supplierOrders.forEach((order) => {
      const id = order.client_id;
      if (!id) return;

      if (!clientsMap[id]) {
        clientsMap[id] = {
          count: 1,
          lastDate: parseDate(order.loading_date) ?? new Date(0),
          name: order.client_name || 'Unknown'
        };
      } else {
        clientsMap[id].count += 1;
        const orderDate = parseDate(order.loading_date);
        if (orderDate && orderDate > clientsMap[id].lastDate) {
          clientsMap[id].lastDate = orderDate;
        }
      }
    });

    const clientCount = Object.keys(clientsMap).length;
    const returningClients = Object.values(clientsMap).filter(
      (c) => c.count > 2
    ).length;

    const topClientEntry = Object.entries(clientsMap).sort(
      (a, b) => b[1].count - a[1].count
    )[0];

    const topClient = topClientEntry
      ? {
          id: topClientEntry[0],
          name: topClientEntry[1].name,
          count: topClientEntry[1].count,
          lastDate: topClientEntry[1].lastDate
        }
      : null;

    return {
      totalOrders: supplierOrders.length,
      oldestDate,
      latestDate,
      clientCount,
      returningClients,
      topClient
    };
  }, [supplierPhone, orders]);

  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Total Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Total Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{summary.totalOrders}</div>
          <div className="text-sm text-muted-foreground">
            Oldest:{' '}
            {summary.oldestDate
              ? summary.oldestDate.toLocaleDateString()
              : 'N/A'}
            <br />
            Latest:{' '}
            {summary.latestDate
              ? summary.oldestDate.toLocaleDateString()
              : 'N/A'}
          </div>
        </CardContent>
      </Card>

      {/* Clients Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Total Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{summary.clientCount}</div>
          <div className="text-sm text-muted-foreground">
            Returning: {summary.returningClients}
          </div>
        </CardContent>
      </Card>

      {/* Top Client */}
      <Card>
        <CardHeader>
          <CardTitle>Top Client</CardTitle>
        </CardHeader>
        <CardContent>
          {summary.topClient ? (
            <>
              <div className="text-lg font-semibold">
                {summary.topClient.name} ({summary.topClient.id})
              </div>
              <div className="text-sm text-muted-foreground">
                Oldest:{' '}
                {summary.oldestDate
                  ? summary.oldestDate.toLocaleDateString()
                  : 'N/A'}
                <br />
                Latest:{' '}
                {summary.latestDate
                  ? summary.latestDate.toLocaleDateString()
                  : 'N/A'}
              </div>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">No data</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
