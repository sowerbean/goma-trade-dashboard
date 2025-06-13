'use client';

import { useMemo } from 'react';
import { useOrderData } from '@/hooks/use-order-data';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Order } from '@/types';

export default function ClientProfileCard({ clientId }: { clientId: string }) {
  const { data: orders } = useOrderData();

  const clientOrders = useMemo(
    () => orders?.filter((o: Order) => o.client_id === clientId) || [],
    [orders, clientId]
  );

  const clientName = clientOrders[0]?.client_name || 'Unknown';
  const goodsTypes = useMemo(
    () =>
      Array.from(
        new Set(clientOrders.map((o: Order) => o.goods_type).filter(Boolean))
      ),
    [clientOrders]
  );

  const initials = clientName
    .split(' ')
    .map((n) => n[0]?.toUpperCase())
    .slice(0, 2)
    .join('');

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <Avatar className="h-14 w-14">
          <AvatarFallback>{initials || 'C'}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <p className="text-lg font-semibold">{clientName}</p>
          <p className="text-sm text-muted-foreground">Client ID: {clientId}</p>
          <p className="text-sm text-muted-foreground">
            Goods types: {goodsTypes.length > 0 ? goodsTypes.join(', ') : 'N/A'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
