import { useRouter } from '@/routes/hooks';
import Footer from '@/components/shared/footer';
import { useOrderData } from '@/hooks/use-order-data';
import type { Order } from '@/types';
import { ChampionHeroCard } from './components/champion-hero-card';
import { NetworkStatsGrid } from './components/network-stats-grid';
import { PackagesChart } from './components/packages-chart';
import { SupplierRankingTable } from './components/supplier-ranking-table';
import { useNetworkData } from './hooks/use-network-data';

export default function NetworkPage() {
  const router = useRouter();
  const { data: rawOrders } = useOrderData();
  const allOrders: Order[] = Array.isArray(rawOrders)
    ? (rawOrders as Order[])
    : [];

  const {
    championYear,
    championName,
    championPhone,
    mostOrdersName,
    mostOrdersPhone,
    ordersCount,
    mostClientsName,
    mostClientsPhone,
    clientCount,
    loyaltyName,
    loyaltyPhone,
    loyaltyRatio,
    loyaltyReturnClients,
    monthlyPackagesData,
    rankingRows,
    ordersWithSupplier,
    summary
  } = useNetworkData(allOrders);

  if (!summary) return null;

  return (
    <>
      <div className="container mx-auto max-w-6xl px-4 py-10 md:py-14">
        <ChampionHeroCard
          championYear={championYear}
          championName={championName}
          championPhone={championPhone}
          onViewSupplier={() =>
            router.push(`/suppliers?phone=${championPhone}`)
          }
        />

        <NetworkStatsGrid
          championYear={championYear}
          mostClientsName={mostClientsName}
          mostClientsPhone={mostClientsPhone}
          clientCount={clientCount}
          mostOrdersName={mostOrdersName}
          mostOrdersPhone={mostOrdersPhone}
          ordersCount={ordersCount}
          loyaltyName={loyaltyName}
          loyaltyPhone={loyaltyPhone}
          loyaltyRatio={loyaltyRatio}
          loyaltyReturnClients={loyaltyReturnClients}
        />

        <PackagesChart data={monthlyPackagesData} />

        <SupplierRankingTable rows={rankingRows} />

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
