import type { Order } from '@/types';
import { parseDate } from '@/lib/date-parsing-sorting';

export function getLastFullYear() {
  return new Date().getFullYear() - 1;
}

export function isDateInYear(date: Date, year: number) {
  return date.getFullYear() === year;
}

export function isWithinLast12Months(date: Date) {
  const now = new Date();
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  return date >= twelveMonthsAgo && date <= now;
}

export function findMostFrequent<T>(arr: T[]): {
  item: T | null;
  count: number;
} {
  const counts = new Map<T, number>();
  let maxCount = 0;
  let mostFrequent: T | null = null;

  for (const item of arr) {
    const next = (counts.get(item) ?? 0) + 1;
    counts.set(item, next);
    if (next > maxCount) {
      maxCount = next;
      mostFrequent = item;
    }
  }

  return { item: mostFrequent, count: maxCount };
}

// Supplier with most unique clients
export function supplierWithMostUniqueClients(orders: Order[]): {
  supplierPhone: string | null;
  clientCount: number;
} {
  const supplierToClients = new Map<string, Set<string>>();

  for (const o of orders) {
    const supplier = o.supplier_phone_number;
    if (!supplier) continue;
    if (!supplierToClients.has(supplier)) {
      supplierToClients.set(supplier, new Set<string>());
    }
    supplierToClients.get(supplier)!.add(o.client_id);
  }

  let bestSupplier: string | null = null;
  let maxClients = 0;

  for (const [supplier, clients] of supplierToClients.entries()) {
    if (clients.size > maxClients) {
      maxClients = clients.size;
      bestSupplier = supplier;
    }
  }

  return { supplierPhone: bestSupplier, clientCount: maxClients };
}

// Helpers for chart and table
export function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function monthLabel(d: Date) {
  return d.toLocaleString('default', { month: 'short', year: 'numeric' });
}

export function buildMonthlyPackagesForSupplier(
  orders: Order[],
  supplierPhone: string
) {
  const perMonth = new Map<
    string,
    { monthDate: Date; totalPackages: number }
  >();

  orders
    .filter((o) => o.supplier_phone_number === supplierPhone)
    .forEach((o) => {
      const date = parseDate(o.loading_date);
      if (!date || !isWithinLast12Months(date)) return;

      const packages = Number(o.packages);
      if (!isFinite(packages)) return;

      const key = monthKey(date);

      if (!perMonth.has(key)) {
        perMonth.set(key, {
          monthDate: new Date(date.getFullYear(), date.getMonth(), 1),
          totalPackages: 0
        });
      }

      perMonth.get(key)!.totalPackages += packages;
    });

  return Array.from(perMonth.values())
    .sort((a, b) => a.monthDate.getTime() - b.monthDate.getTime())
    .map((m) => ({
      label: monthLabel(m.monthDate),
      monthDate: m.monthDate,
      packages: m.totalPackages
    }));
}

export function computeMostSoldGoodsBySupplier(orders: Order[]) {
  const goodsBySupplier = new Map<string, string>();

  const counter = new Map<string, Map<string, number>>();
  for (const o of orders) {
    const phone = o.supplier_phone_number;
    const goods = (o.goods_type ?? '').trim();
    if (!phone || goods.length === 0) continue;
    if (!counter.has(phone)) counter.set(phone, new Map<string, number>());
    const inner = counter.get(phone)!;
    inner.set(goods, (inner.get(goods) ?? 0) + 1);
  }

  for (const [phone, inner] of counter.entries()) {
    let bestGoods: string | null = null;
    let maxCount = 0;
    for (const [g, c] of inner.entries()) {
      if (c > maxCount) {
        maxCount = c;
        bestGoods = g;
      }
    }
    goodsBySupplier.set(phone, bestGoods ?? 'N/A');
  }

  return goodsBySupplier;
}
