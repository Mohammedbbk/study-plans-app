import { NextResponse } from "next/server";
import { findPlanBySlug } from "../../_store";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const plan = findPlanBySlug(slug);

    if (!plan) {
      return new NextResponse("Plan not found", { status: 404 });
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error("[API_PLANS_SLUG_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}