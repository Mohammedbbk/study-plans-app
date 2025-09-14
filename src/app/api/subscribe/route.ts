import { NextResponse } from "next/server";
import { createSubscription } from "../_store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { planId } = body;

    if (!planId) {
      return new NextResponse("Plan ID is required", { status: 400 });
    }

    const subscription = createSubscription(planId);
    return NextResponse.json(subscription);
  } catch (error) {
    console.error("[API_SUBSCRIBE_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
