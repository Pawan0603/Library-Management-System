import { NextResponse } from "next/server"
import { seedDatabase } from "@/lib/seed-data"

export async function GET() {
  try {
    const result = await seedDatabase()

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(result, { status: 400 })
    }
  } catch (error) {
    console.error("Error in seed API:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

