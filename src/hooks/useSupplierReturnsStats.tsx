import { useMemo } from 'react';

export interface Order {
  client_id?: string;
  date_in?: string;
  supplier_name?: string;
  supplier_phone_number?: string;
  packages?: string | number;
  // ...other fields
}

export interface SupplierRankingStat {
  supplier_name: string | null;
  supplier_phone_number: string;
  total_orders: number;
  total_clients: number;
  return_clients: number;
  return_ratio: string; // e.g., "35.00%"
  total_packages: number;
  volume_metric: 'orders' | 'packages';
  volume_raw: number; // orders or packages depending on the chosen metric
  volume_normalized: number; // 0..1
  score: number; // final ranking score
}

export interface SupplierRankingOptions {
  volumeMetric?: 'orders' | 'packages'; // default: 'orders'
  minDatesForReturn?: number; // default: 2 (client must appear on ≥2 distinct dates)
  weights?: { quality?: number; volume?: number }; // optional exponents; if provided, score = p^wq * v^wv (normalized so wq+wv=1)
}

function toNumber(value: unknown): number {
  if (value == null) return 0;
  if (typeof value === 'number') return isFinite(value) ? value : 0;
  const s = String(value);
  const cleaned = s.replace(/[^0-9.-]/g, '');
  const num = parseFloat(cleaned);
  return isFinite(num) ? num : 0;
}

function computeSupplierRankingStats(
  orders: Order[] = [],
  options: SupplierRankingOptions = {}
): SupplierRankingStat[] {
  const volumeMetric = options.volumeMetric ?? 'orders';
  const minDatesForReturn = Math.max(2, options.minDatesForReturn ?? 2);
  const wqRaw = options.weights?.quality ?? undefined;
  const wvRaw = options.weights?.volume ?? undefined;
  const useWeights =
    typeof wqRaw === 'number' && typeof wvRaw === 'number' && wqRaw + wvRaw > 0;
  const sumW = (wqRaw ?? 0) + (wvRaw ?? 0);
  const wq = useWeights ? wqRaw! / sumW : 1; // default exponents: p^1 * v^1 => p * v
  const wv = useWeights ? wvRaw! / sumW : 1;

  type Agg = {
    supplier_phone_number: string;
    supplier_name: string | null;
    total_orders: number;
    total_packages: number;
    clientDates: Map<string, Set<string>>;
  };

  const suppliers = new Map<string, Agg>();

  for (const o of Array.isArray(orders) ? orders : []) {
    const phone = (o.supplier_phone_number || '').trim();
    if (!phone) continue;

    const name = (o.supplier_name || '').trim() || null;
    let agg = suppliers.get(phone);
    if (!agg) {
      agg = {
        supplier_phone_number: phone,
        supplier_name: name,
        total_orders: 0,
        total_packages: 0,
        clientDates: new Map()
      };
      suppliers.set(phone, agg);
    } else if (!agg.supplier_name && name) {
      agg.supplier_name = name;
    }

    agg.total_orders += 1;
    agg.total_packages += toNumber(o.packages);

    const clientId = (o.client_id || '').trim();
    const dateIn = (o.date_in || '').trim();
    if (clientId) {
      let dates = agg.clientDates.get(clientId);
      if (!dates) {
        dates = new Set<string>();
        agg.clientDates.set(clientId, dates);
      }
      if (dateIn) dates.add(dateIn);
    }
  }

  // Determine max volume for normalization
  let maxVolume = 0;
  for (const agg of suppliers.values()) {
    const volRaw =
      volumeMetric === 'orders' ? agg.total_orders : agg.total_packages;
    if (volRaw > maxVolume) maxVolume = volRaw;
  }

  const result: SupplierRankingStat[] = [];
  for (const agg of suppliers.values()) {
    const totalClients = agg.clientDates.size;
    let returnClients = 0;
    for (const dates of agg.clientDates.values()) {
      if (dates.size >= minDatesForReturn) returnClients += 1;
    }
    const p = totalClients > 0 ? returnClients / totalClients : 0;
    const volRaw =
      volumeMetric === 'orders' ? agg.total_orders : agg.total_packages;
    const v = maxVolume > 0 ? volRaw / maxVolume : 0;
    const score = Math.pow(p, wq) * Math.pow(v, wv);

    result.push({
      supplier_name: agg.supplier_name,
      supplier_phone_number: agg.supplier_phone_number,
      total_orders: agg.total_orders,
      total_clients: totalClients,
      return_clients: returnClients,
      return_ratio: (p * 100).toFixed(2) + '%',
      total_packages: agg.total_packages,
      volume_metric: volumeMetric,
      volume_raw: volRaw,
      volume_normalized: v,
      score
    });
  }

  // Sort: by score desc, then return_clients, total_clients, then volume (orders/packages), then name
  result.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.return_clients !== a.return_clients)
      return b.return_clients - a.return_clients;
    if (b.total_clients !== a.total_clients)
      return b.total_clients - a.total_clients;
    if (b.volume_raw !== a.volume_raw) return b.volume_raw - a.volume_raw;
    return (a.supplier_name || '').localeCompare(b.supplier_name || '');
  });

  return result;
}

export function useSupplierRankingStats(
  orders: Order[] = [],
  options?: SupplierRankingOptions
): SupplierRankingStat[] {
  return useMemo(
    () => computeSupplierRankingStats(orders, options),
    [orders, options]
  );
}
