import { NextResponse } from "next/server";
import { importCsvData } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { csvUrl } = body;

    if (!csvUrl) {
      return NextResponse.json(
        { error: "CSV URL is required" },
        { status: 400 }
      );
    }

    const result = await importCsvData(csvUrl);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Successfully imported ${result.count} call logs`,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in import API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to import CSV data",
      },
      { status: 500 }
    );
  }
}
