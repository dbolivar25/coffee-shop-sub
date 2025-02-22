import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { dbUtils } from "@/app/lib/db";

export async function POST() {
  const { userId } = await auth.protect();

  try {
    // Get current subscription
    const subscription = await dbUtils.getSubscription(userId);

    if (!subscription) {
      return NextResponse.json(
        { error: "No subscription found" },
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
    console.error("Error redeeming drink:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
