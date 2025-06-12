import Heading from '@/components/shared/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useRouter } from '@/routes/hooks';
import { ChevronLeftIcon, ShareIcon } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import InterestChannel from './components/interest-channel';
import OrderFeedTable from './components/order-feed-table';
import { useGetOrders } from './queries/client-pagination';

export default function OrderDetailPage() {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const pageLimit = Number(searchParams.get('limit') || 10);
  const searchQuery = searchParams.get('search') || null;
  const offset = (page - 1) * pageLimit;

  const { data, isLoading } = useGetOrders(offset, pageLimit, searchQuery);
  const orders = data?.orders;
  const totalOrders = data?.total_orders || 0;
  const pageCount = Math.ceil(totalOrders / pageLimit);

  const router = useRouter();

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="p-10">
      <div className="flex items-center justify-between">
        <Heading title="Order Details" />
        <div className="flex justify-end gap-3">
          <Button>
            <ShareIcon className="h-4 w-4" />
            Share
          </Button>
          <Button onClick={() => router.back()}>
            <ChevronLeftIcon className="h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 py-6 lg:grid-cols-4">
        {/* Left Column: Order Profile */}
        <div className="col-span-1 flex flex-col gap-6">
          <Card className="bg-secondary shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] drop-shadow-sm">
            <CardHeader className="flex items-center justify-between font-bold">
              <p className="text-xl">Order Summary</p>
              <Badge className="bg-green-600">Active</Badge>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1995/1995621.png"
                className="h-28 w-28 rounded-full"
                alt="Order Icon"
              />
            </CardContent>
          </Card>

          <Card className="bg-secondary shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] drop-shadow-sm">
            <CardHeader className="pb-2 text-center font-bold">
              Description
            </CardHeader>
            <CardContent className="text-sm">
              This order includes multiple items for export, scheduled for
              loading on the selected date. Use this section to summarize key
              info.
            </CardContent>
          </Card>

          <Card className="bg-secondary shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] drop-shadow-sm">
            <CardHeader className="pb-2 text-center font-bold">
              Last Updated
            </CardHeader>
            <CardContent className="text-center text-sm">
              12 June 2025 3:30 PM
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Order Details */}
        <Card className="col-span-1 bg-secondary shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] drop-shadow-sm lg:col-span-3">
          <CardHeader className="text-xl font-bold">
            Order Information
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-y-4">
              <div>
                <p className="font-bold text-black">Client Name</p>
                <p className="text-muted-foreground">John Doe Logistics</p>
              </div>
              <div>
                <p className="font-bold text-black">Order ID</p>
                <p className="text-muted-foreground">ORD-2025-XYZ</p>
              </div>
              <div>
                <p className="font-bold text-black">Goods Type</p>
                <p className="text-muted-foreground">Coltan</p>
              </div>
              <div>
                <p className="font-bold text-black">Packages</p>
                <p className="text-muted-foreground">24</p>
              </div>
              <div>
                <p className="font-bold text-black">Supplier Contact</p>
                <p className="text-muted-foreground">+243 999 888 777</p>
              </div>
              <div>
                <p className="font-bold text-black">Loading Date</p>
                <p className="text-muted-foreground">10 June 2025</p>
              </div>
              <div>
                <p className="font-bold text-black">Entry Date</p>
                <p className="text-muted-foreground">9 June 2025</p>
              </div>
              <div>
                <p className="font-bold text-black">Status</p>
                <p className="text-muted-foreground">Ready for Export</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Channels or Tags */}
      <div className="flex items-center justify-center">
        <InterestChannel title="Export" />
        <InterestChannel title="Traceability" />
        <InterestChannel title="Compliance" />
      </div>

      {/* Feed Table for Orders */}
      <OrderFeedTable
        orders={orders}
        page={page}
        totalOrders={totalOrders}
        pageCount={pageCount}
      />
    </div>
  );
}
