import crypto from "crypto";

export interface Module {
  id: string;
  title: string;
  lessons: string[];
}

export interface Plan {
  id: string;
  slug: string;
  title: string;
  description: string;
  durationWeeks: number;
  price?: number | null;
  tags: string[];
  modules: Module[];
  isActive: boolean;
  createdAt: string;
}

export interface Subscription {
  id: string;
  planId: string;
  subscribedAt: string;
  progress: {
    moduleId: string;
    completed: boolean;
  }[];
}

export const plans: Plan[] = [
  {
    id: "1",
    title: "React Fundamentals",
    slug: "react-fundamentals",
    description:
      "Learn the core concepts of React including components, state, props, and hooks. Perfect for beginners.",
    durationWeeks: 8,
    price: 299,
    tags: ["React", "JavaScript", "Frontend", "Beginner"],
    isActive: true,
    createdAt: new Date().toISOString(),
    modules: [
      {
        id: "m1-1",
        title: "Getting Started",
        lessons: ["Intro to React", "Setup", "First Component"],
      },
      {
        id: "m1-2",
        title: "State and Props",
        lessons: ["useState Hook", "Passing Props", "Event Handling"],
      },
      {
        id: "m1-3",
        title: "Advanced Hooks",
        lessons: ["useEffect", "useContext", "Custom Hooks"],
      },
    ],
  },
  {
    id: "2",
    title: "Next.js Mastery",
    slug: "nextjs-mastery",
    description:
      "Master Next.js from basics to advanced concepts including App Router, Server Components, and deployment.",
    durationWeeks: 12,
    price: 499,
    tags: ["Next.js", "React", "Full-Stack", "Advanced"],
    isActive: true,
    createdAt: new Date().toISOString(),
    modules: [
      {
        id: "m2-1",
        title: "App Router Basics",
        lessons: ["File-based Routing", "Layouts and Pages"],
      },
      {
        id: "m2-2",
        title: "Server Components",
        lessons: ["Data Fetching", "Server vs Client"],
      },
      {
        id: "m2-3",
        title: "API Route Handlers",
        lessons: ["Creating Endpoints", "Dynamic Routes"],
      },
    ],
  },
  {
    id: "3",
    title: "TypeScript Essentials",
    slug: "typescript-essentials",
    description:
      "Learn TypeScript from scratch and how to integrate it with React applications for a better dev experience.",
    durationWeeks: 6,
    price: 199,
    tags: ["TypeScript", "Types", "Beginner"],
    isActive: false,
    createdAt: new Date().toISOString(),
    modules: [
      {
        id: "m3-1",
        title: "TypeScript Basics",
        lessons: ["Basic Types", "Interfaces", "Functions"],
      },
      {
        id: "m3-2",
        title: "Advanced Types",
        lessons: ["Generics", "Utility Types"],
      },
    ],
  },
];

export let mySubscription: Subscription | null = null;

export function findPlanBySlug(slug: string): Plan | undefined {
  return plans.find((plan) => plan.slug === slug);
}

export function findPlanById(id: string): Plan | undefined {
  return plans.find((plan) => plan.id === id);
}

export function getPlans(options: {
  query?: string;
  tag?: string;
  includeInactive?: boolean;
}): Plan[] {
  let result = options.includeInactive
    ? plans
    : plans.filter((p) => p.isActive);

  if (options.query) {
    const lowerCaseQuery = options.query.toLowerCase();
    result = result.filter((plan) =>
      plan.title.toLowerCase().includes(lowerCaseQuery),
    );
  }

  if (options.tag) {
    result = result.filter((plan) => plan.tags.includes(options.tag!));
  }

  return result;
}

export function getSubscription(): Subscription | null {
  return mySubscription;
}

export function createSubscription(planId: string): Subscription {
  const plan = findPlanById(planId);
  if (!plan) {
    throw new Error("Plan not found");
  }

  const newSubscription: Subscription = {
    id: crypto.randomUUID(),
    planId: plan.id,
    subscribedAt: new Date().toISOString(),
    progress: plan.modules.map((module) => ({
      moduleId: module.id,
      completed: false,
    })),
  };

  mySubscription = newSubscription;
  return mySubscription;
}

export function updateProgress(moduleId: string, completed: boolean): boolean {
  if (!mySubscription) {
    return false;
  }

  const progressIndex = mySubscription.progress.findIndex(
    (p) => p.moduleId === moduleId,
  );
  if (progressIndex === -1) {
    return false;
  }

  const updatedProgress = mySubscription.progress.map((item, index) =>
    index === progressIndex ? { ...item, completed } : item,
  );

  mySubscription = {
    ...mySubscription,
    progress: updatedProgress,
  };

  return true;
}

export function addPlan(planData: Omit<Plan, "id" | "createdAt">): Plan {
  const newPlan: Plan = {
    ...planData,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  plans.push(newPlan);
  return newPlan;
}

export function updatePlan(
  id: string,
  planData: Partial<Omit<Plan, "id" | "createdAt">>,
): Plan | null {
  const index = plans.findIndex((plan) => plan.id === id);
  if (index === -1) {
    return null;
  }
  plans[index] = { ...plans[index], ...planData };
  return plans[index];
}

export function deletePlan(id: string): boolean {
  const index = plans.findIndex((plan) => plan.id === id);
  if (index === -1) {
    return false;
  }
  plans.splice(index, 1);
  return true;
}
