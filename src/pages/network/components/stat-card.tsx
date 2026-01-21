import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';

type StatCardProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  primary: string;
  secondary?: string;
  meta?: string;
  className?: string;
};

export function StatCard({
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
