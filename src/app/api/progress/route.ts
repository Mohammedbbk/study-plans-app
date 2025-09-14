import { NextResponse } from "next/server";
import { updateProgress } from "../_store";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { moduleId, completed } = body;

    if (typeof moduleId !== "string" || typeof completed !== "boolean") {
      return new NextResponse("Invalid request body", { status: 400 });
    }

    const success = updateProgress(moduleId, completed);

    if (!success) {
      return new NextResponse(
        "Failed to update progress. Subscription or module not found.",
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API_PROGRESS_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
