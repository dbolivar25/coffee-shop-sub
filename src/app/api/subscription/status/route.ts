import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { dbUtils } from "@/app/lib/db";

export async function GET() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscription = await dbUtils.getSubscription(userId);
    
    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
