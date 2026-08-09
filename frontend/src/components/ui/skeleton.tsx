import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('shimmer animate-shimmer rounded-md', className)}
      {...props}
    />
  );
}

export { Skeleton };
