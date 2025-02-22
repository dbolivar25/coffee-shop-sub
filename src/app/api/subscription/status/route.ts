import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { dbUtils } from "@/app/lib/db";

export async function GET() {
  const { userId } = auth().protect();

  try {
    const subscription = await dbUtils.getSubscription(userId);
    
    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
