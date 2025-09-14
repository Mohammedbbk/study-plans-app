import { Plan } from "../api/_store";
import { PlanCard } from "@/components/PlanCard"; 

async function getPlans(): Promise<Plan[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/plans`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch plans");
  return res.json();
}

export default async function PlansPage() {
  const plans = await getPlans();

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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </main>
  );
}
