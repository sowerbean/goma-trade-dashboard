'use client';

import { useOrderData } from '@/hooks/use-order-data';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Order } from '@/types';

interface Props {
  supplierPhone: string | null; // normalized (e.g. 13812345678)
}

export default function SupplierProfileCard({ supplierPhone }: Props) {
  const { data, isLoading } = useOrderData();

  if (isLoading || !supplierPhone) {
    return (
      <Card className="w-full md:w-1/3">
        <CardContent className="flex items-center gap-4 p-4">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-48" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const supplierOrders = data?.filter((order: Order) =>
    order.supplier_phone_number?.endsWith(supplierPhone)
  );

  if (!supplierOrders || supplierOrders.length === 0) return null;

  const { supplier_name } = supplierOrders[0];
  const goodsTypes = Array.from(
    new Set(supplierOrders.map((o) => o.goods_type))
  ).join(', ');

  const initials =
    supplier_name?.trim()?.slice(0, 2).toUpperCase() || supplierPhone.slice(-2);

  return (
    <Card className="w-full md:w-1/3">
      <CardContent className="flex items-center gap-4 p-4">
        <Avatar className="h-14 w-14">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-lg font-semibold">{supplier_name}</p>
          <p className="text-sm text-muted-foreground">{supplierPhone}</p>
          <p className="text-sm">Goods: {goodsTypes || 'N/A'}</p>
        </div>
      </CardContent>
    </Card>
  );
}
