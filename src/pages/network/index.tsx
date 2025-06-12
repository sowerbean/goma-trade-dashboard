// import { useState, useEffect } from 'react';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import FilterBar from "./components/filter-bar";
// import { FilterProvider } from "@/providers/supplier-network-filter";
// import GroupedSupplierOrdersTable from "./components/orders-table-expandable";
// import OrdersTreemap from './components/orders-treemap';
// import OrdersSankey from './components/orders-sankey';

// const MAX_MONTHS_RANGE = 6;
// const MIN_CLIENT_THRESHOLD = 5;

// export default function NetworkDashboardPage() {
//   const [startDate, setStartDate] = useState<Date>(() => {
//     const date = new Date();
//     date.setMonth(date.getMonth() - 1);
//     return date;
//   });

//   const [endDate, setEndDate] = useState<Date>(new Date());
//   const [minClientCount, setMinClientCount] = useState<number>(MIN_CLIENT_THRESHOLD);

//   useEffect(() => {
//     // Clamp startDate if time range > 6 months
//     const maxRangeDate = new Date(endDate);
//     maxRangeDate.setMonth(maxRangeDate.getMonth() - MAX_MONTHS_RANGE);
//     if (startDate < maxRangeDate) {
//       setStartDate(maxRangeDate);
//     }

//     // Clamp client count
//     if (minClientCount < MIN_CLIENT_THRESHOLD) {
//       setMinClientCount(MIN_CLIENT_THRESHOLD);
//     }
//   }, [startDate, endDate, minClientCount]);

//   return (
//     <FilterProvider>
//       <div className="p-4 space-y-4">
//         <h2 className="text-xl font-semibold">This is a visualization of the TRADE Network</h2>

//         <FilterBar
//           startDate={startDate}
//           setStartDate={setStartDate}
//           endDate={endDate}
//           setEndDate={setEndDate}
//           minClientCount={minClientCount}
//           setMinClientCount={setMinClientCount}
//           minLimit={MIN_CLIENT_THRESHOLD}
//           maxMonths={MAX_MONTHS_RANGE}
//         />

//         <Tabs defaultValue="table">
//           <TabsList>
//             <TabsTrigger value="table">Table</TabsTrigger>
//             <TabsTrigger value="treemap">Treemap</TabsTrigger>
//             <TabsTrigger value="sankey">Sankey</TabsTrigger>
//           </TabsList>
//           <TabsContent value="table">
//             <GroupedSupplierOrdersTable
//               startDate={startDate}
//               endDate={endDate}
//               minClients={minClientCount}
//             />
//           </TabsContent>
//           <TabsContent value="treemap">
//             <OrdersTreemap
//               startDate={startDate}
//               endDate={endDate}
//               minClientCount={minClientCount}
//             />
//           </TabsContent>
//           <TabsContent value="sankey">
//             <OrdersSankey
//               startDate={startDate}
//               endDate={endDate}
//               minClientCount={minClientCount}
//             />
//           </TabsContent>
//         </Tabs>
//       </div>
//     </FilterProvider>
//   );
// }

import { useRouter } from '@/routes/hooks';
import { Button } from '@/components/ui/button';
import Footer from '@/components/shared/footer';

export default function NetworkPage() {
  const router = useRouter();

  return (
    <>
      <div className="absolute left-1/2 top-1/2 mb-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center">
        <span className="bg-gradient-to-b from-foreground to-transparent bg-clip-text text-[10rem] font-extrabold leading-none text-transparent">
          Coming soon!
        </span>
        <h2 className="font-heading my-2 text-2xl font-bold">
          This tools was developped to help businesses based in Goma to make
          more informed decisions.
        </h2>
        <div className="mt-8 flex justify-center gap-2">
          <Button onClick={() => router.back()} variant="default" size="lg">
            Go back
          </Button>
          <Button onClick={() => router.push('/')} variant="ghost" size="lg">
            Back to Home
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
}
