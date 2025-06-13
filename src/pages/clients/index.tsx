import { useState, useEffect } from 'react';
import PageHead from '@/components/shared/page-head';
import Footer from '@/components/shared/footer';
import { useOrderData } from '@/hooks/use-order-data';
import { Order } from '@/types';

import ClientSelector from './components/client-selector';
import ClientProfileCard from './components/client-profile-card';
import ClientSummaryCards from './components/client-summary-cards';
import ClientEvolutionChart from './components/client-evolution-chart';
import ClientSupplierTable from './components/client-supplier-table';

export default function ClientsPage() {
  const { data: orders } = useOrderData();
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId && orders?.length) {
      const uniqueClients = Array.from(
        new Set(orders.map((o: Order) => o.client_id).filter(Boolean))
      ) as string[];
      if (uniqueClients.length > 0) {
        const randomClient =
          uniqueClients[Math.floor(Math.random() * uniqueClients.length)];
        setClientId(randomClient);
      }
    }
  }, [orders, clientId]);

  return (
    <>
      <PageHead title="GRAVITAS | Clients | Goma Trade" />
      <div className="max-h-screen flex-1 space-y-4 overflow-y-auto p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
        </div>

        <ClientSelector value={clientId ?? ''} onChange={setClientId} />
        {clientId && <ClientProfileCard clientId={clientId} />}
        <ClientSummaryCards clientId={clientId} orders={orders ?? []} />
        <ClientEvolutionChart
          key={clientId}
          clientId={clientId ?? ''}
          orders={orders ?? []}
        />
        <ClientSupplierTable clientId={clientId ?? ''} orders={orders ?? []} />

        <Footer />
      </div>
    </>
  );
}
