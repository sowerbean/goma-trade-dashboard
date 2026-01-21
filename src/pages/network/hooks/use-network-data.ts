import { useMemo } from 'react';
import type { Order } from '@/types';
import { parseDate } from '@/lib/date-parsing-sorting';
import {
  getLastFullYear,
  isDateInYear,
  findMostFrequent,
  supplierWithMostUniqueClients,
  buildMonthlyPackagesForSupplier,
  computeMostSoldGoodsBySupplier
} from '../utils/network-utils';
import { useSupplierRankingStats } from '@/hooks/useSupplierReturnsStats';

export function useNetworkData(allOrders: Order[]) {
  const ordersWithSupplier: Order[] = allOrders.filter(
    (o) => (o.supplier_phone_number?.length ?? 0) > 0
  );
  const championYear = getLastFullYear();

  const ordersLastYear = useMemo(() => {
    return ordersWithSupplier.filter((o) => {
      const d = parseDate(o.loading_date);
      return d ? isDateInYear(d, championYear) : false;
    });
  }, [ordersWithSupplier, championYear]);

  const stats =
    useSupplierRankingStats(ordersLastYear, {
      volumeMetric: 'orders',
      minDatesForReturn: 2,
      weights: { quality: 0.7, volume: 0.3 }
    }) ?? [];

  // Build suppliers list for "most orders" (by count of occurrences)
  const suppliers: string[] = ordersLastYear.reduce<string[]>((acc, o) => {
    if (typeof o.supplier_phone_number === 'string') {
      acc.push(o.supplier_phone_number);
    }
    return acc;
  }, []);

  const bestSupplierPerOrder = findMostFrequent<string>(suppliers);
  const mostOrdersPhone = bestSupplierPerOrder.item ?? null;
  const mostOrdersName = mostOrdersPhone
    ? (ordersWithSupplier.find(
        (o) => o.supplier_phone_number === mostOrdersPhone
      )?.supplier_name ?? 'N/A')
    : 'N/A';

  const bestByClients = supplierWithMostUniqueClients(ordersLastYear);
  const mostClientsPhone = bestByClients.supplierPhone;
  const mostClientsName = mostClientsPhone
    ? (ordersWithSupplier.find(
        (o) => o.supplier_phone_number === mostClientsPhone
      )?.supplier_name ?? 'N/A')
    : 'N/A';

  // Loyalty winner (most returning clients, then by ratio as tiebreaker)
  const loyaltyTop = stats.length
    ? [...stats].sort((a: any, b: any) => {
        const aReturnClients = a?.return_clients ?? 0;
        const bReturnClients = b?.return_clients ?? 0;
        if (bReturnClients !== aReturnClients) {
          return bReturnClients - aReturnClients;
        }
        const aRatio = parseFloat(a?.return_ratio ?? '0');
        const bRatio = parseFloat(b?.return_ratio ?? '0');
        return bRatio - aRatio;
      })[0]
    : null;

  const loyaltyPhone = loyaltyTop?.supplier_phone_number ?? null;
  const loyaltyName = loyaltyPhone
    ? (ordersWithSupplier.find((o) => o.supplier_phone_number === loyaltyPhone)
        ?.supplier_name ??
      loyaltyTop?.supplier_name ??
      'N/A')
    : 'N/A';

  const loyaltyRatio = loyaltyTop?.return_ratio ?? '0%';
  const loyaltyReturnClients = loyaltyTop?.return_clients ?? 0;

  // Overall Champion
  const championPhone = stats.length
    ? (stats[0]?.supplier_phone_number ?? '')
    : '';
  const championName = stats.length
    ? (stats[0]?.supplier_name ?? 'N/A')
    : 'N/A';

  const monthlyPackagesData = useMemo(() => {
    if (!championPhone) return [];
    return buildMonthlyPackagesForSupplier(allOrders, championPhone);
  }, [allOrders, championPhone]);

  // Most sold goods per supplier
  const goodsBySupplier = useMemo(() => {
    return computeMostSoldGoodsBySupplier(allOrders);
  }, [allOrders]);

  // Supplier ranking rows (best to least favorite)
  const rankingRows = useMemo(() => {
    return (stats ?? []).map((s: any, idx: number) => {
      const phone = s?.supplier_phone_number ?? '';
      return {
        rank: idx + 1,
        name: s?.supplier_name ?? 'N/A',
        phone,
        loyaltyRatio: s?.return_ratio ?? '0%',
        returningClients: s?.return_clients ?? 0,
        goodsType: goodsBySupplier.get(phone) ?? 'N/A'
      };
    });
  }, [stats, goodsBySupplier]);

  const summary = useMemo(() => {
    if (!stats.length || !stats[0]?.supplier_phone_number || !allOrders)
      return null;

    const supplierOrders = allOrders.filter(
      (order) => order.supplier_phone_number === stats[0].supplier_phone_number
    );

    if (supplierOrders.length === 0) return null;

    const orderDates = supplierOrders
      .map((o) => parseDate(o.loading_date))
      .filter((d): d is Date => d !== null)
      .sort((a, b) => a.getTime() - b.getTime());

    const oldestDate = orderDates[0];
    const latestDate = orderDates[orderDates.length - 1];

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
  }, [allOrders, stats]);

  return {
    championYear,
    championName,
    championPhone,
    mostOrdersName,
    mostOrdersPhone,
    ordersCount: bestSupplierPerOrder.count,
    mostClientsName,
    mostClientsPhone,
    clientCount: bestByClients.clientCount,
    loyaltyName,
    loyaltyPhone,
    loyaltyRatio,
    loyaltyReturnClients,
    monthlyPackagesData,
    rankingRows,
    ordersWithSupplier,
    summary
  };
}
