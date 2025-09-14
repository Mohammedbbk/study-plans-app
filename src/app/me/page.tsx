"use client";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plan, Subscription } from "../api/_store";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

type SubscriptionData = {
  subscription: Subscription;
  plan: Plan;
};

async function fetchSubscription(): Promise<SubscriptionData | null> {
  const res = await fetch("/api/me");
  if (!res.ok) throw new Error("Failed to fetch subscription.");
  const data = await res.json();
  return data.plan ? data : null;
}

async function updateModuleProgress({
  moduleId,
  completed,
}: {
  moduleId: string;
  completed: boolean;
}) {
  const res = await fetch("/api/progress", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ moduleId, completed }),
  });
  if (!res.ok) throw new Error("Failed to update progress.");
  return res.json();
}

export default function MePage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<SubscriptionData | null>({
    queryKey: ["subscription"],
    queryFn: fetchSubscription,
  });

  const mutation = useMutation({
    mutationFn: updateModuleProgress,
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["subscription"] });
      const previousData = queryClient.getQueryData<SubscriptionData>([
        "subscription",
      ]);

      if (previousData) {
        const newProgress = previousData.subscription.progress.map((p) =>
          p.moduleId === newData.moduleId
            ? { ...p, completed: newData.completed }
            : p,
        );
        queryClient.setQueryData(["subscription"], {
          ...previousData,
          subscription: { ...previousData.subscription, progress: newProgress },
        });
      }
      return { previousData };
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData(["subscription"], context?.previousData);
      toast.error("Update failed", {
        description: "Your progress could not be saved.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription"] });
    },
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (isError) {
    return (
      <div className="text-center py-20">Error loading your subscription.</div>
    );
  }

  if (!data) {
    return (
      <main className="container text-center py-20 px-8">
        <h1 className="text-2xl font-bold mb-4">No Active Subscription</h1>
        <p className="text-muted-foreground mb-6">
          You are not subscribed to any plan yet.
        </p>
        <Button asChild>
          <Link href="/plans">Browse Plans</Link>
        </Button>
      </main>
    );
  }

  const { plan, subscription } = data;

  const getModuleTitle = (moduleId: string) => {
    return (
      plan.modules.find((m) => m.id === moduleId)?.title || "Unknown Module"
    );
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold tracking-tight mb-2">
        My Subscription
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        You are subscribed to:{" "}
        <span className="font-semibold text-primary">{plan.title}</span>
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Track Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscription.progress.map(({ moduleId, completed }) => (
              <div
                key={moduleId}
                className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-md"
              >
                <Checkbox
                  id={moduleId}
                  checked={completed}
                  onCheckedChange={(isChecked) => {
                    mutation.mutate({ moduleId, completed: !!isChecked });
                  }}
                />
                <label
                  htmlFor={moduleId}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {getModuleTitle(moduleId)}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

function LoadingSkeleton() {
  return (
    <main className="container mx-auto px-4 py-12">
      <Skeleton className="h-10 w-1/2 mb-2" />
      <Skeleton className="h-6 w-3/4 mb-8" />
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    </main>
  );
}
