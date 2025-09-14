import { NextResponse } from "next/server";
import { getSubscription, findPlanById } from "../_store";

export async function GET() {
  try {
    const subscription = getSubscription();

    if (!subscription) {
      return NextResponse.json({});
    }

    const plan = findPlanById(subscription.planId);

    if (!plan) {
      return NextResponse.json(
        { message: "Subscribed plan not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ subscription, plan });
  } catch (error) {
    console.error("[API_ME_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
