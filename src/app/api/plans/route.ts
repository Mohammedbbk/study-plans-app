import { NextResponse } from "next/server";
import { getPlans } from "../_store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || undefined;
    const tag = searchParams.get("tag") || undefined;

    const plans = getPlans({ query, tag, includeInactive: false });

    return NextResponse.json(plans);
  } catch (error) {
    console.error("[API_PLANS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
