import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { dbUtils } from "@/app/lib/db";

export async function GET() {
  const session = await auth();
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const subscription = await dbUtils.getSubscription(session.userId);
    // Return null subscription instead of erroring
    return NextResponse.json({ subscription });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
