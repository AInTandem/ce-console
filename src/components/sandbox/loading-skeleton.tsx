import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

export function LoadingSkeleton() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex-grow mr-4">
          <div className="h-10 bg-gray-200 rounded-md w-full max-w-sm animate-pulse" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 bg-gray-100 rounded animate-pulse w-20" />
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-100 rounded animate-pulse w-32" />
            </CardContent>
            <CardFooter>
              <div className="flex gap-2 w-full">
                <div className="h-8 bg-gray-200 rounded animate-pulse flex-1" />
                <div className="h-8 bg-gray-200 rounded animate-pulse flex-1" />
                <div className="h-8 bg-gray-200 rounded animate-pulse flex-1" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
