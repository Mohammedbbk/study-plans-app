import { NextResponse, NextRequest } from "next/server";
import { addPlan, getPlans } from "../../_store";
import { z } from "zod";

const planSchema = z.object({
  title: z.string().min(3),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().min(10),
  durationWeeks: z.number().int().positive(),
  price: z.number().nullable().optional(),
  tags: z.array(z.string().min(1)).max(8),
  isActive: z.boolean(),
  modules: z
    .array(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        lessons: z.array(z.string().min(1)).min(1),
      }),
    )
    .min(1),
});

function isAdmin(request: NextRequest) {
  const token = request.headers.get("x-admin-token");
  return token === process.env.ADMIN_TOKEN;
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const allPlans = getPlans({ includeInactive: true });
  return NextResponse.json(allPlans);
}

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsedData = planSchema.parse(body);
    const newPlan = addPlan(parsedData);
    return NextResponse.json(newPlan, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.issues }, { status: 400 });
    }
    console.error("[API_ADMIN_PLANS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
