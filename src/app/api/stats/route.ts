import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"

export async function GET() {
  try {
    const db = getDb()

    // Get call statistics by type - Fix the string literals in LIKE clauses
    const stats = {
      incoming: db.prepare("SELECT COUNT(*) as count FROM call_logs WHERE CALLTYPE LIKE '%Incoming%'").get().count,
      outgoing: db.prepare("SELECT COUNT(*) as count FROM call_logs WHERE CALLTYPE LIKE '%Outgoing%'").get().count,
      missed: db.prepare("SELECT COUNT(*) as count FROM call_logs WHERE CALLTYPE LIKE '%Missed%'").get().count,
      total: db.prepare("SELECT COUNT(*) as count FROM call_logs").get().count,
    }

    // Get recent calls
    const recentCalls = db
      .prepare(`
      SELECT * FROM call_logs 
      ORDER BY DATES DESC, TIME DESC 
      LIMIT 4
    `)
      .all()

    // Get top contacts
    const topContacts = db
      .prepare(`
      SELECT CELLNUMBER, COUNT(*) as count, contact_name
      FROM call_logs
      GROUP BY CELLNUMBER
      ORDER BY count DESC
      LIMIT 5
    `)
      .all()

    // Get call duration stats
    const durationStats = db
      .prepare(`
      SELECT 
        SUM(CALLDURATION) as total_duration,
        AVG(CALLDURATION) as avg_duration,
        MAX(CALLDURATION) as max_duration
      FROM call_logs
      WHERE CALLDURATION > 0
    `)
      .get()

    return NextResponse.json({
      stats,
      recentCalls,
      topContacts,
      durationStats,
    })
  } catch (error) {
    console.error("Error fetching call statistics:", error)
    return NextResponse.json({ error: "Failed to fetch call statistics" }, { status: 500 })
  }
}
