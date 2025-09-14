"use client";

import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Plan } from "../api/_store";
import { PlanCard } from "@/components/PlanCard";
import { SearchAndFilter } from "@/components/SearchAndFilter";
import { Skeleton } from "@/components/ui/skeleton";

async function getAllPlans(): Promise<Plan[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/plans`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch plans");
  return res.json();
}

function PlansPageContent() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ query: "", selectedTags: [] as string[] });
  const searchParams = useSearchParams();

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    plans.forEach(plan => {
      plan.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [plans]);

  const filteredPlans = useMemo(() => {
    return plans.filter(plan => {
      const matchesSearch = !filters.query || plan.title.toLowerCase().includes(filters.query.toLowerCase());
      
      const matchesTags = filters.selectedTags.length === 0 || 
        filters.selectedTags.some(tag => plan.tags.includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [plans, filters]);

  useEffect(() => {
    const query = searchParams.get("q") || "";
    const selectedTags = searchParams.get("tags")?.split(",").filter(Boolean) || [];
    setFilters({ query, selectedTags });
  }, [searchParams]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoading(true);
        const fetchedPlans = await getAllPlans();
        setPlans(fetchedPlans);
        setError(null);
      } catch (err) {
        setError("Failed to load study plans");
        console.error("Error fetching plans:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleFiltersChange = useCallback(({ query, selectedTags }: { query: string; selectedTags: string[] }) => {
    setFilters({ query, selectedTags });
  }, []);

  if (isLoading) {
    return (
      <main className="container py-12 px-4">
        <div className="mb-8 text-center">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        <div className="mb-8">
          <Skeleton className="h-10 w-full mb-4" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-16" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container py-12 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Study Plans</h1>
          <p className="text-lg text-destructive mb-8">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-12 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-center tracking-tight">
          Study Plans
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Browse our curated plans to kickstart your learning journey.
        </p>
      </div>

      <div className="mb-8">
        <SearchAndFilter 
          allTags={allTags} 
          onFiltersChange={handleFiltersChange}
        />
      </div>

      {filteredPlans.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-4">
            {plans.length === 0 
              ? "No study plans available at the moment." 
              : "No plans match your current filters."}
          </p>
          {plans.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Try adjusting your search terms or clearing the filters.
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {filteredPlans.length} of {plans.length} plans
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}

export default function PlansPage() {
  return (
    <Suspense fallback={
      <main className="container py-12 px-4">
        <div className="mb-8 text-center">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        <div className="mb-8">
          <Skeleton className="h-10 w-full mb-4" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-16" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </main>
    }>
      <PlansPageContent />
    </Suspense>
  );
}
