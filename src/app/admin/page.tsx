"use client"; 

import { useState } from "react";
import { Plan } from "@/app/api/_store";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlanForm } from "@/components/PlanForm";
import { PlansTable } from "@/components/PlansTable";

export default function AdminPage() {
  const [planToEdit, setPlanToEdit] = useState<Plan | null>(null);

  const handleEdit = (plan: Plan) => {
    setPlanToEdit(plan);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinishEditing = () => {
    setPlanToEdit(null);
  };

  return (
    <main className="container py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Admin Panel</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Manage your study plans from here.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>
                {planToEdit ? "Edit Plan" : "Create New Plan"}
              </CardTitle>
              <CardDescription>
                {planToEdit
                  ? `You are currently editing "${planToEdit.title}".`
                  : "Fill out the form below to add a new study plan."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlanForm
                initialData={planToEdit}
                onFinish={handleFinishEditing}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Existing Plans</CardTitle>
              <CardDescription>View and manage existing plans.</CardDescription>
            </CardHeader>
            <CardContent>
              <PlansTable onEdit={handleEdit} />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
