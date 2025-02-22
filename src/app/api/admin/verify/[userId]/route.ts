import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { dbUtils } from "@/app/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { userId: adminId } = auth().protect();
  const { userId } = params;

  try {
    // TODO: Add admin role check here once Clerk roles are set up

    const subscription = await dbUtils.getSubscription(userId);
    if (!subscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Error verifying subscription:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
