import { Skeleton } from "@/components/ui/skeleton";

export function ScoreCardSkeleton() {
  return (
    <div className="card-premium flex flex-col items-center justify-center py-6">
      <Skeleton className="h-4 w-32 mb-4" />
      <Skeleton className="h-40 w-40 rounded-full" />
      <Skeleton className="h-3 w-24 mt-4" />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="card-reach min-h-[128px]">
      <Skeleton className="h-10 w-10 rounded-xl mb-3" />
      <Skeleton className="h-3 w-24 mb-2" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

export function EngineCardSkeleton() {
  return (
    <div className="engine-card">
      <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-2 w-32" />
      </div>
      <Skeleton className="h-6 w-16 rounded-lg" />
    </div>
  );
}
