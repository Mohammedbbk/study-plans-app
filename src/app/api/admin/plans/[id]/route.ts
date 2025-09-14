import { NextResponse, NextRequest } from "next/server";
import { deletePlan } from "../../../_store";

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

// NOTE: A PATCH handler for updating plans would go here as well