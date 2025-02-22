import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { dbUtils } from "@/app/lib/db";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ subscriptionId: string }> },
) {
  const { subscriptionId } = await context.params;
  const {} = await auth.protect();

  try {
    // TODO: Add admin role check here once Clerk roles are set up
    const subscription = await dbUtils.getSubscriptionById(subscriptionId);
    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error("Error verifying subscription:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
