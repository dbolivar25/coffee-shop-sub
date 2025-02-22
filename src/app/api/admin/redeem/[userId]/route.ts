import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { dbUtils } from "@/app/lib/db";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const { userId } = await context.params;
  const {} = await auth.protect();

  try {
    // TODO: Add admin role check here once Clerk roles are set up

    const subscription = await dbUtils.getSubscription(userId);
    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 },
      );
    }

    if (subscription.daily_drinks_remaining <= 0) {
      return NextResponse.json(
        { error: "No drinks remaining today" },
        { status: 400 },
      );
    }

    // Create redemption and update drinks remaining
    await dbUtils.createRedemption(subscription.id);
    const updatedSubscription = await dbUtils.updateDrinksRemaining(
      subscription.id,
      subscription.daily_drinks_remaining - 1,
    );

    return NextResponse.json({ subscription: updatedSubscription });
  } catch (error) {
    console.error("Error processing redemption:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
