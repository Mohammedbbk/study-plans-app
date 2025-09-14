"use client"; 

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plan } from "@/app/api/_store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanForm } from "@/components/PlanForm";
import { PlansTable } from "@/components/PlansTable";
import { toast } from "sonner";
import { Lock } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState("");
  const [planToEdit, setPlanToEdit] = useState<Plan | null>(null);

  const handleLogin = async () => {
    if (!adminToken.trim()) {
      toast.error("Please enter admin token");
      return;
    }
    
    try {
      // Validate token by making a test request
      const response = await fetch("/api/admin/plans", {
        headers: { "x-admin-token": adminToken },
      });
      
      if (response.ok) {
        setIsAuthenticated(true);
        toast.success("Admin access granted");
      } else {
        toast.error("Invalid admin token");
      }
    } catch {
      toast.error("Failed to validate token");
    }
  };

  const handleEdit = (plan: Plan) => {
    setPlanToEdit(plan);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDuplicate = (plan: Plan) => {
    const duplicatedPlan: Plan = {
      ...plan,
      id: "", 
      slug: `${plan.slug}-copy`,
      title: `${plan.title} (Copy)`,
      isActive: false,
    };
    setPlanToEdit(duplicatedPlan);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinishEditing = () => {
    setPlanToEdit(null);
  };

  if (!isAuthenticated) {
    return (
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Admin Access</CardTitle>
              <CardDescription>
                Enter your admin token to access the management panel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="password"
                placeholder="Enter admin token"
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <Button onClick={handleLogin} className="w-full">
                Access Admin Panel
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Admin Panel</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Manage your study plans from here.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => {setIsAuthenticated(false); router.push("/")}}
        >
          
          Logout
        </Button>
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
                adminToken={adminToken}
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
              <PlansTable onEdit={handleEdit} onDuplicate={handleDuplicate} adminToken={adminToken} />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
