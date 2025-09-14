"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plan } from "@/app/api/_store";
import { toast } from "sonner";
import { MoreHorizontal, Trash2, Pencil, Copy } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

async function fetchAdminPlans(token: string): Promise<Plan[]> {
  if (!token) return [];
  const res = await fetch("/api/admin/plans", {
    headers: { "x-admin-token": token },
  });
  if (!res.ok) throw new Error("Failed to fetch plans");
  return res.json();
}

async function deletePlanAction({
  planId,
  token,
}: {
  planId: string;
  token: string;
}) {
  const res = await fetch(`/api/admin/plans/${planId}`, {
    method: "DELETE",
    headers: { "x-admin-token": token },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to delete plan");
  }
  return res.json();
}

type PlansTableProps = {
  onEdit: (plan: Plan) => void;
  onDuplicate: (plan: Plan) => void;
  adminToken: string;
};

export function PlansTable({ onEdit, onDuplicate, adminToken }: PlansTableProps) {
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);

  const {
    data: plans,
    isLoading,
    isError,
  } = useQuery<Plan[]>({
    queryKey: ["admin-plans"],
    queryFn: () => fetchAdminPlans(adminToken),
    enabled: !!adminToken,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePlanAction,
    onSuccess: () => {
      toast.success("Plan deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-plans"] });
    },
    onError: (error) => {
      toast.error("Deletion Failed", { description: error.message });
    },
    onSettled: () => {
      setIsDeleteDialogOpen(false);
      setPlanToDelete(null);
    },
  });


  const handleDeleteClick = (plan: Plan) => {
    setPlanToDelete(plan);
    setIsDeleteDialogOpen(true);
  };


  return (
    <div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-8 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-destructive">
                  Failed to load plans.
                </TableCell>
              </TableRow>
            ) : !plans || plans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No plans found. Fetch plans to see them here.
                </TableCell>
              </TableRow>
            ) : (
              plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.title}</TableCell>
                  <TableCell>
                    <Badge variant={plan.isActive ? "default" : "outline"}>
                      {plan.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>${plan.price || "Free"}</TableCell>
                  <TableCell>{plan.durationWeeks} weeks</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(plan)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDuplicate(plan)}>
                          <Copy className="mr-2 h-4 w-4" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(plan)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              <span className="font-semibold"> {planToDelete?.title}</span>{" "}
              plan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteMutation.mutate({
                  planId: planToDelete!.id,
                  token: adminToken,
                })
              }
              disabled={deleteMutation.isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Yes, delete it"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
