import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Crown } from 'lucide-react';

type ChampionHeroCardProps = {
  championYear: number;
  championName: string;
  championPhone: string;
  onViewSupplier: () => void;
};

export function ChampionHeroCard({
  championYear,
  championName,
  championPhone,
  onViewSupplier
}: ChampionHeroCardProps) {
  return (
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
          <Button onClick={onViewSupplier}>View Supplier</Button>
        </div>
      </CardContent>
    </Card>
  );
}
