import PageHead from '@/components/shared/page-head.jsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent
  // TabsList,
  // TabsTrigger
} from '@/components/ui/tabs.js';
import TopSuppliers from './components/top-suppliers';
import GoodsBartChart from './components/goods-bar-chart';
import OrderTable from '../orders/index';
import Footer from '@/components/shared/footer';
import CardOne from './components/card-one';
import CardTwo from './components/card-two';
import CardThree from './components/card-three';
import CardFour from './components/card-four';
import ClientOrdersEvolutionChart from './components/orders-evolution';

export default function DashboardPage() {
  return (
    <>
      <PageHead title="GRAVITAS | Dashboard | Goma Trade" />
      <div className="max-h-screen flex-1 space-y-4 overflow-y-auto p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Hi, Welcome back 👋
          </h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          {/* TAB2 */}
          {/* <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
          </TabsList> */}

          {/* TAB1 */}
          <TabsContent value="overview" className="space-y-4">
            {/* SECTION 1: Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <CardOne />
              <CardTwo />
              <CardThree />
              <CardFour />
            </div>

            {/* SECTION 2: Chart and ranking */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              {/* TOP SUPPLIERS RANKING */}
              <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Top suppliers</CardTitle>
                  <CardDescription>
                    Chose the time frame and the top five will be displayed.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TopSuppliers />
                </CardContent>
              </Card>

              {/* TOP GOODS BART CHART */}
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Most ordered goods</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <GoodsBartChart />
                </CardContent>
              </Card>

              {/* ORDERS EVOLUTION CHART */}
              <Card className="col-span-7">
                <CardHeader>
                  <CardTitle>Orders Evolution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ClientOrdersEvolutionChart />
                </CardContent>
              </Card>

              {/* ORDERS FEED TABLE */}
              <Card className="col-span-7">
                <CardHeader>
                  <CardTitle>All Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <OrderTable />
                </CardContent>
              </Card>
            </div>
            <Footer />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
