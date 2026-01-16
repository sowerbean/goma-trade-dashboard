import { useRouter } from '@/routes/hooks';
import { Button } from '@/components/ui/button';
import Footer from '@/components/shared/footer';
import { useOrderData } from '@/hooks/use-order-data';
import type { Order } from '@/types';
import { useSupplierRankingStats } from '@/hooks/useSupplierReturnsStats';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, Package, Repeat2, Crown, Loader2 } from 'lucide-react';
import React, { useMemo, useEffect, useRef, useState } from 'react';
import { parseDate } from '@/lib/date-parsing-sorting';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

function getLastFullYear() {
  return new Date().getFullYear() - 1;
}

function isDateInYear(date: Date, year: number) {
  return date.getFullYear() === year;
}

function isWithinLast12Months(date: Date) {
  const now = new Date();
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  return date >= twelveMonthsAgo && date <= now;
}

function findMostFrequent<T>(arr: T[]): { item: T | null; count: number } {
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
function supplierWithMostUniqueClients(orders: Order[]): {
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

type StatCardProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  primary: string;
  secondary?: string;
  meta?: string;
  className?: string;
};

function StatCard({
  icon: Icon,
  title,
  primary,
  secondary,
  meta,
  className
}: StatCardProps) {
  return (
    <Card
      className={`border-muted/40 shadow-sm transition-shadow hover:shadow-md ${className ?? ''}`}
    >
      <Card>
        <CardHeader className="flex flex-row items-center gap-3 space-y-0">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-muted">
            <Icon className="h-5 w-5 text-foreground" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base">{title}</CardTitle>
            {meta ? (
              <CardDescription className="truncate">{meta}</CardDescription>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-2xl font-bold">{primary}</div>
          {secondary ? (
            <div className="mt-1 text-sm text-muted-foreground">
              {secondary}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </Card>
  );
}

// Helpers for chart and table
function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function monthLabel(d: Date) {
  return d.toLocaleString('default', { month: 'short', year: 'numeric' });
}

function buildMonthlyPackagesForSupplier(
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

function computeMostSoldGoodsBySupplier(orders: Order[]) {
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

export default function NetworkPage() {
  const router = useRouter();
  const { data: rawOrders } = useOrderData();
  const allOrders: Order[] = Array.isArray(rawOrders)
    ? (rawOrders as Order[])
    : [];
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
      volumeMetric: 'orders', // change to 'packages' to rank by total packages
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
        // First, compare by number of returning clients (more is better)
        const aReturnClients = a?.return_clients ?? 0;
        const bReturnClients = b?.return_clients ?? 0;
        if (bReturnClients !== aReturnClients) {
          return bReturnClients - aReturnClients;
        }
        // If tied, use loyalty ratio as tiebreaker
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

  // Infinite scroll state
  const [visibleCount, setVisibleCount] = useState(20);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsLoadingMore(true);
          // Simulate async, or directly load more
          setTimeout(() => {
            setVisibleCount((prev) => prev + 20);
            setIsLoadingMore(false);
          }, 200);
        }
      },
      {
        root: listRef.current,
        rootMargin: '0px',
        threshold: 1.0
      }
    );
    observer.observe(sentinelRef.current);
    return () => {
      observer.disconnect();
    };
  }, [sentinelRef.current, listRef.current]);

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

  if (!summary) return null;

  return (
    <>
      <div className="container mx-auto max-w-6xl px-4 py-10 md:py-14">
        {/* Champion Hero */}
        <Card className="relative overflow-hidden border-none bg-gradient-to-br from-amber-50 via-amber-100 to-yellow-50 shadow-lg dark:from-amber-950/40 dark:via-amber-900/20 dark:to-yellow-900/10">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-yellow-300/20 blur-3xl" />
          <CardContent className="flex flex-col items-start gap-6 p-6 md:flex-row md:items-center md:gap-8 md:p-10">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-amber-500 text-white shadow-md ring-4 ring-amber-500/20">
              <Trophy className="h-9 w-9" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-extrabold tracking-tight">
                  Overall Champion
                </h1>
                <Badge className="bg-amber-500 text-white hover:bg-amber-500/90">
                  <Crown className="mr-1 h-3.5 w-3.5" />
                  Champion
                </Badge>
              </div>
              <p className="mt-1 text-muted-foreground">
                Top performing supplier of {championYear}
              </p>
              <div className="mt-4">
                <div className="text-xl font-semibold leading-tight">
                  {championName} <span className="ml-1">🏆</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  ID / Phone: {championPhone}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => router.push(`/suppliers?phone=${championPhone}`)}
              >
                View Supplier
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats grid */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <StatCard
            icon={Users}
            title={`Most Unique Clients (${championYear})`}
            primary={mostClientsName ?? 'N/A'}
            secondary={`Clients: ${bestByClients.clientCount ?? 0}`}
            meta={mostClientsPhone ?? 'N/A'}
            className="bg-background"
          />
          <StatCard
            icon={Package}
            title={`Most Orders (${championYear})`}
            primary={mostOrdersName ?? 'N/A'}
            secondary={`Orders: ${bestSupplierPerOrder.count ?? 0}`}
            meta={mostOrdersPhone ?? 'N/A'}
            className="bg-background"
          />
          <StatCard
            icon={Repeat2}
            title={`Best Loyalty Rate (${championYear})`}
            primary={loyaltyName ?? 'N/A'}
            secondary={`Loyalty: ${loyaltyRatio} • Returning clients: ${loyaltyReturnClients}`}
            meta={loyaltyPhone ?? 'N/A'}
            className="bg-background"
          />
        </div>

        <Card className="mt-8 border-muted/40 shadow-sm">
          <CardHeader>
            <CardTitle>Packages Sold Over Time</CardTitle>
            <CardDescription>
              Monthly total number of packages handled by the top supplier
            </CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyPackagesData.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No package data available.
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyPackagesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [`${value}`, 'Packages']}
                    />
                    <Line
                      type="monotone"
                      dataKey="packages"
                      name="Packages"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Supplier Ranking Table with Infinite Scroll */}
        <Card className="mt-8 border-muted/40 shadow-sm">
          <CardHeader>
            <CardTitle>Supplier Ranking</CardTitle>
            <CardDescription>
              Best to least favorite suppliers in 2025
            </CardDescription>
          </CardHeader>
          <CardContent>
            {rankingRows.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No supplier data available yet.
              </div>
            ) : (
              <div
                ref={listRef}
                className="max-h-[480px] overflow-y-auto rounded-md border border-muted/40"
              >
                <Table>
                  <TableHeader className="sticky top-0 bg-muted/30 backdrop-blur supports-[backdrop-filter]:bg-muted/30">
                    <TableRow>
                      <TableHead className="w-16">Rank</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Loyalty %</TableHead>
                      <TableHead>Returning Clients</TableHead>
                      <TableHead>Most Sold Goods</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rankingRows.slice(0, visibleCount).map((row) => (
                      <TableRow key={`${row.phone}-${row.rank}`}>
                        <TableCell className="font-medium">
                          {row.rank}
                        </TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>+{row.phone}</TableCell>
                        <TableCell className="font-bold">
                          {row.loyaltyRatio}
                        </TableCell>
                        <TableCell>{row.returningClients}</TableCell>
                        <TableCell>{row.goodsType}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={6}>
                        <div
                          ref={sentinelRef}
                          className="flex w-full items-center justify-center py-2"
                        >
                          {isLoadingMore ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Loading more...</span>
                            </div>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Optional: subtle note if no data */}
        {ordersWithSupplier.length === 0 ? (
          <div className="mt-8 text-center text-sm text-muted-foreground">
            No supplier data available yet.
          </div>
        ) : null}
      </div>
      <Footer />
    </>
  );
}
