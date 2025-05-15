import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Check if the database file exists
    const dbPath = path.join(process.cwd(), "data", "call-logs.db")
    const exists = fs.existsSync(dbPath)

    // Also check if the data directory exists
    const dataDir = path.join(process.cwd(), "data")
    const dataDirExists = fs.existsSync(dataDir)

    // If data directory doesn't exist, create it
    if (!dataDirExists) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    return NextResponse.json({
      exists,
      message: exists ? "Database file found" : "Database file not found",
    })
  } catch (error) {
    console.error("Error checking database file:", error)
    return NextResponse.json(
      {
        exists: false,
        error: "Failed to check database file",
      },
      { status: 500 },
    )
  }
}
