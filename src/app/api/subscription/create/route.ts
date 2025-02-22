import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { dbUtils } from "@/app/lib/db";

export async function POST() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscription = await dbUtils.createSubscription(userId);
    
    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
