'use client';
import { useOrderData } from '@/hooks/use-order-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Order } from '@/types';
import { useDateFilter } from '@/providers/date-filter-provider';

type SupplierSummary = {
  supplier_name: string;
  supplier_phone_number: string;
  total_packages: number;
  goods_type: string;
};

export default function TopSuppliers() {
  const { data, isLoading, error } = useOrderData();
  const { startDate, endDate, setStartDate, setEndDate } = useDateFilter();

  if (isLoading) return <div>Loading top suppliers...</div>;
  if (error) return <div className="text-red-500">Failed to load data.</div>;

  const supplierMap = new Map<string, SupplierSummary>();

  data.forEach((order: Order) => {
    if (!order.loading_date) return;

    const orderDate = new Date(
      order.loading_date.split('/').reverse().join('-')
    );
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const inRange =
      (!start || orderDate >= start) && (!end || orderDate <= end);

    if (!inRange) return;

    const phone = order.supplier_phone_number;
    const name = order.supplier_name;
    const packages = parseInt(order.packages, 10) || 0;

    if (!supplierMap.has(phone)) {
      supplierMap.set(phone, {
        supplier_name: name,
        supplier_phone_number: phone,
        total_packages: packages,
        goods_type: order.goods_type
      });
    } else {
      const existing = supplierMap.get(phone)!;
      existing.total_packages += packages;
    }
  });

  const topSuppliers = Array.from(supplierMap.values())
    .sort((a, b) => b.total_packages - a.total_packages)
    .slice(0, 5);

  return (
    <div className="space-y-6 overflow-auto">
      <div className="mb-4 flex space-x-4">
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">from:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">to:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
      </div>

      {topSuppliers.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No suppliers in selected range.
        </p>
      ) : (
        topSuppliers.map((supplier) => (
          <div
            key={supplier.supplier_phone_number}
            className="flex items-center"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage
                src="/avatars/placeholder.png"
                alt={supplier.supplier_name}
              />
              <AvatarFallback>
                {supplier.supplier_name?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                {supplier.supplier_name} x {supplier.goods_type}
              </p>
              <p className="text-sm text-muted-foreground">
                {supplier.supplier_phone_number}
              </p>
            </div>
            <div className="ml-auto text-sm font-medium">
              {supplier.total_packages} pkgs
            </div>
          </div>
        ))
      )}
    </div>
  );
}
