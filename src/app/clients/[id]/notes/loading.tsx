import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Suspense boundary for the page's useParams(), which is runtime-only data.
export default function Loading() {
  return (
    <>
      <Skeleton className="h-8 w-48" />
      <Card>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    </>
  );
}
