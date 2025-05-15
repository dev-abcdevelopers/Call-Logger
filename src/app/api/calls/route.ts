import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const db = getDb()

    // Get query parameters
    const url = new URL(request.url)
    const callType = url.searchParams.get("callType")
    const cellNumber = url.searchParams.get("cellNumber")
    const date = url.searchParams.get("date")
    const limit = Number.parseInt(url.searchParams.get("limit") || "50")
    const offset = Number.parseInt(url.searchParams.get("offset") || "0")

    // Build the query
    let query = "SELECT * FROM call_logs"
    const params: (string | number)[] = []
    const conditions: string[] = []

    if (callType) {
      conditions.push("CALLTYPE LIKE ?")
      // Use parameter binding for the LIKE pattern
      params.push(`%${callType}%`)
    }

    if (cellNumber) {
      conditions.push("CELLNUMBER = ?")
      params.push(cellNumber)
    }

    if (date) {
      conditions.push("DATES = ?")
      params.push(date)
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ")
    }

    query += " ORDER BY DATES DESC, TIME DESC LIMIT ? OFFSET ?"
    params.push(limit, offset)

    const stmt = db.prepare(query)
    const calls = stmt.all(...params)

    // Get total count for pagination
    let countQuery = "SELECT COUNT(*) as total FROM call_logs"
    if (conditions.length > 0) {
      countQuery += " WHERE " + conditions.join(" AND ")
    }

    const countStmt = db.prepare(countQuery)
    const { total } = countStmt.get(...params.slice(0, params.length - 2))

    return NextResponse.json({
      calls,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + calls.length < total,
      },
    })
  } catch (error) {
    console.error("Error fetching calls:", error)
    return NextResponse.json({ error: "Failed to fetch calls" }, { status: 500 })
  }
}
