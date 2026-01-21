import React, { useEffect, useRef, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';

type RankingRow = {
  rank: number;
  name: string;
  phone: string;
  loyaltyRatio: string;
  returningClients: number;
  goodsType: string;
};

type SupplierRankingTableProps = {
  rows: RankingRow[];
};

export function SupplierRankingTable({ rows }: SupplierRankingTableProps) {
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

  return (
    <Card className="mt-8 border-muted/40 shadow-sm">
      <CardHeader>
        <CardTitle>Supplier Ranking</CardTitle>
        <CardDescription>
          Best to least favorite suppliers in 2025
        </CardDescription>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
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
                {rows.slice(0, visibleCount).map((row) => (
                  <TableRow key={`${row.phone}-${row.rank}`}>
                    <TableCell className="font-medium">{row.rank}</TableCell>
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
  );
}
