"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

async function subscribeToPlan(planId: string) {
  const res = await fetch("/api/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ planId }),
  });

  if (!res.ok) {
    throw new Error("Subscription failed");
  }
  return res.json();
}

type SubscribeButtonProps = {
  planId: string;
  planTitle: string;
};

export function SubscribeButton({ planId, planTitle }: SubscribeButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: subscribeToPlan,
    onSuccess: () => {
      setIsDialogOpen(false);
      toast.success("Success!", {
        description: `You have subscribed to ${planTitle}.`,
      });
      router.push("/me");
    },
    onError: () => {
      toast.error("Error", {
        description: "Something went wrong. Please try again.",
      });
    },
  });

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full mt-6">
          Subscribe Now
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Subscription</DialogTitle>
          <DialogDescription>
            You are about to subscribe to the &ldquo;{planTitle}&rdquo; plan. Are you sure
            you want to continue?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => mutation.mutate(planId)}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Subscribing..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}