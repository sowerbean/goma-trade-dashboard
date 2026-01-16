// pages/suppliers/index.tsx
import { useState } from 'react';
import { useOrderData } from '@/hooks/use-order-data';
import { Tabs } from '@/components/ui/tabs';
import PageHead from '@/components/shared/page-head';
import Footer from '@/components/shared/footer';
import SupplierSelector from './components/supplier-selector';
import SupplierProfileCard from './components/Supplier-profile-card';
import SupplierSummaryCards from './components/supplier-summary-cards';
import SupplierClientFidelityTable from './components/supplier-clients-table';
import SupplierEvolutionChart from './components/supplier-evolution-chart';

export default function SuppliersPage() {
  const { data: orders } = useOrderData();
  const [supplierPhone, setSupplierPhone] = useState<string | null>(null);

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
          {/* Selector */}
          <SupplierSelector onChange={(v) => setSupplierPhone(v)} />

          {/* Only show components when a valid supplier phone is selected */}
          {supplierPhone && (
            <>
              <SupplierProfileCard supplierPhone={supplierPhone} />

              {/* three cards */}
              <SupplierSummaryCards supplierPhone={supplierPhone} />

              {/* Line Chart */}
              <SupplierEvolutionChart
                key={supplierPhone} // <- this forces remount when phone changes
                orders={orders ?? []}
                supplierId={supplierPhone}
              />

              {/* Table */}
              <SupplierClientFidelityTable
                orders={orders ?? []}
                supplierId={supplierPhone}
              />
            </>
          )}
        </Tabs>
        <Footer />
      </div>
    </>
  );
}
