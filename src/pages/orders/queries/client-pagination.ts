// queries/queries.ts
import { useOrderData } from '@/hooks/use-order-data';
import { useMemo } from 'react';

export const useGetOrders = (
  offset: number,
  pageLimit: number,
  searchQuery: string | null
) => {
  const { data, isLoading, error } = useOrderData();

  const filtered = useMemo(() => {
    if (!data) return [];
    if (!searchQuery) return data;

    const query = searchQuery.toLowerCase();
    return data.filter((item: any) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(query)
      )
    );
  }, [data, searchQuery]);

  const paginated = useMemo(() => {
    return filtered.slice(offset, offset + pageLimit);
  }, [filtered, offset, pageLimit]);

  return {
    data: {
      orders: paginated,
      total_orders: filtered.length
    },
    isLoading,
    error
  };
};
