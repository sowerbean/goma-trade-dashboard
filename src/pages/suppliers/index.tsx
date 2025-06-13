// pages/suppliers/index.tsx
import { useState, useEffect } from 'react';
import { useOrderData } from '@/hooks/use-order-data';
import { Tabs } from '@/components/ui/tabs';
import { Order } from '@/types';
import PageHead from '@/components/shared/page-head';
import Footer from '@/components/shared/footer';
import SupplierSelector from './components/supplier-selector';
import SupplierProfileCard from './components/supplier-profile-card';
import SupplierSummaryCards from './components/supplier-summary-cards';
import SupplierClientFidelityTable from './components/supplier-clients-table';
import SupplierEvolutionChart from './components/supplier-evolution-chart';

export default function SuppliersPage() {
  const { data: orders } = useOrderData();
  const [supplierPhone, setSupplierPhone] = useState<string | null>(null);

  // Pick a random supplier on first load
  useEffect(() => {
    if (!supplierPhone && orders?.length) {
      const uniqueSuppliers = Array.from(
        new Set(
          orders.map((o: Order) => o.supplier_phone_number).filter(Boolean)
        )
      );
      if (uniqueSuppliers.length > 0) {
        const randomPhone = uniqueSuppliers[
          Math.floor(Math.random() * uniqueSuppliers.length)
        ] as string;
        setSupplierPhone(randomPhone);
      }
    }
  }, [orders, supplierPhone]);

  return (
    <>
      <PageHead title="GRAVITAS | Suppliers | Goma Trade" />
      <div className="max-h-screen flex-1 space-y-4 overflow-y-auto p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Suppliers</h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          {/* <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="evolution">Evolution</TabsTrigger>
          </TabsList> */}
          {/* Selector + Profile Card */}
          <SupplierSelector
            // value={supplierPhone ?? ""}
            onChange={(v) => setSupplierPhone(v)}
          />
          <SupplierProfileCard supplierPhone={supplierPhone} />

          {/* three cards */}
          <SupplierSummaryCards supplierPhone={supplierPhone} />

          {/* Line Chart */}
          <SupplierEvolutionChart
            key={supplierPhone} // <- this forces remount when phone changes
            orders={orders ?? []}
            supplierId={supplierPhone ?? ''}
          />

          {/* Table */}
          <SupplierClientFidelityTable
            orders={orders ?? []}
            supplierId={supplierPhone ?? ''}
          />
        </Tabs>
        <Footer />
      </div>
    </>
  );
}
