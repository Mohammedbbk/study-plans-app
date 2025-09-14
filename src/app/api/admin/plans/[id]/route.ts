import { NextResponse, NextRequest } from "next/server";
import { deletePlan, updatePlan } from "../../../_store";
import { z } from "zod";

function isAdmin(request: NextRequest) {
  const token = request.headers.get("x-admin-token");
  return token === process.env.ADMIN_TOKEN;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    
    const success = deletePlan(id);
    if (!success) {
      return NextResponse.json({ message: "Plan not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Plan deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("[API_ADMIN_PLANS_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

const updatePlanSchema = z.object({
  title: z.string().min(3).optional(),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  description: z.string().min(10).optional(),
  durationWeeks: z.number().int().positive().optional(),
  price: z.number().nullable().optional(),
  tags: z.array(z.string().min(1)).max(8).optional(),
  isActive: z.boolean().optional(),
  modules: z
    .array(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        lessons: z.array(z.string().min(1)).min(1),
      }),
    )
    .min(1)
    .optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    
    // Validate the request body
    const validatedData = updatePlanSchema.parse(body);
    
    const updatedPlan = updatePlan(id, validatedData);
    if (!updatedPlan) {
      return NextResponse.json({ message: "Plan not found" }, { status: 404 });
    }
    
    return NextResponse.json(updatedPlan, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid data", errors: error.issues },
        { status: 400 }
      );
    }
    console.error("[API_ADMIN_PLANS_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}