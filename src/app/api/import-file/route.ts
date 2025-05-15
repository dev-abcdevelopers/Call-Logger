import { NextResponse } from "next/server"
import { importCsvData } from "@/lib/db"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import fs from "fs"

export async function POST(request: Request) {
  try {
    // Get the form data from the request
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Check if it's a CSV file
    if (!file.name.toLowerCase().endsWith(".csv")) {
      return NextResponse.json({ error: "File must be a CSV" }, { status: 400 })
    }

    // Create a temporary file path
    const tempDir = path.join(process.cwd(), "tmp")
    const tempFilePath = path.join(tempDir, `${uuidv4()}.csv`)

    // Ensure the temp directory exists
    if (!fs.existsSync(tempDir)) {
      await mkdir(tempDir, { recursive: true })
    }

    // Write the file
    await writeFile(tempFilePath, Buffer.from(await file.arrayBuffer()))

    // Import the CSV data
    const result = await importCsvData(`file://${tempFilePath}`)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Successfully imported ${result.count} call logs`,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in import file API:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to import CSV file: " + (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 },
    )
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
