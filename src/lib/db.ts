import type { Database } from "better-sqlite3"
import path from "path"
import fs from "fs"
import { parse } from "csv-parse/sync"
import sqlite from "better-sqlite3"

// This is a server-side only module
let db: Database | null = null

// Define the structure of a call log record from CSV
interface CallLogRecord {
  ID: string
  DATES: string
  TIME: string
  CELLNUMBER: string
  CALLTYPE: string
  LOG: string
  SENTBY: string
  BYSIM?: string | number | null
  LOOKUP?: string | null
  CALLDURATION?: string | number | null
  FLAG?: string | number | null
  [key: string]: string | number | null | undefined // For any other fields in the CSV
}

export function getDb() {
  if (!db) {
    try {
      // Ensure data directory exists
      const dataDir = path.join(process.cwd(), "data")
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true })
      }

      // Adjust the path to where your SQLite file is located
      const dbPath = path.join(dataDir, "call-logs.db")

      // Check if database file exists
      const dbExists = fs.existsSync(dbPath)

      // @ts-expect-error - Type issues with better-sqlite3 import
      db = new sqlite(dbPath, { readonly: false })

      console.log(`SQLite database ${dbExists ? "opened" : "created"} at ${dbPath}`)

      // If database was just created, initialize it
      if (!dbExists) {
        initDb()
      }
    } catch (error) {
      console.error("Failed to connect to SQLite database:", error)
      throw new Error("Database connection failed")
    }
  }
  return db
}

// Initialize the database with the schema if it doesn't exist
export function initDb() {
  const db = getDb()

  // Create tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS call_logs (
      ID TEXT PRIMARY KEY,
      DATES TEXT,
      TIME TEXT,
      CELLNUMBER TEXT,
      CALLTYPE TEXT,
      LOG TEXT,
      SENTBY TEXT,
      BYSIM INTEGER,
      LOOKUP TEXT,
      CALLDURATION INTEGER,
      FLAG INTEGER,
      contact_name TEXT
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL UNIQUE,
      avatar TEXT,
      is_favorite INTEGER DEFAULT 0 CHECK(is_favorite IN (0, 1))
    );
  `)

  return db
}

// Import CSV data into the database
export async function importCsvData(csvUrl: string) {
  try {
    const db = getDb()

    let csvText: string

    // Handle both remote URLs and local file paths
    if (csvUrl.startsWith("file://")) {
      // Local file path
      const filePath = csvUrl.replace("file://", "")
      csvText = fs.readFileSync(filePath, "utf-8")

      // Clean up the temporary file
      try {
        fs.unlinkSync(filePath)
      } catch {
        console.warn("Failed to delete temporary file")
      }
    } else {
      // Remote URL
      const response = await fetch(csvUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch CSV: ${response.statusText}`)
      }
      csvText = await response.text()
    }

    // Parse the CSV data
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
    }) as CallLogRecord[]

    // Begin transaction for faster inserts
    const insertStmt = db.prepare(`
      INSERT OR REPLACE INTO call_logs (
        ID, DATES, TIME, CELLNUMBER, CALLTYPE, LOG, 
        SENTBY, BYSIM, LOOKUP, CALLDURATION, FLAG, contact_name
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const insertMany = db.transaction((records: CallLogRecord[]) => {
      for (const record of records) {
        // Try to find a contact name for this number
        let contactName = null
        try {
          const contact = db.prepare("SELECT name FROM contacts WHERE phone = ?").get(record.CELLNUMBER)
          if (contact) {
            contactName = contact.name
          }
        } catch {
          // If no contact found, leave as null
        }

        insertStmt.run(
          record.ID,
          record.DATES,
          record.TIME,
          record.CELLNUMBER,
          record.CALLTYPE,
          record.LOG,
          record.SENTBY,
          record.BYSIM || null,
          record.LOOKUP || null,
          record.CALLDURATION || 0,
          record.FLAG || 0,
          contactName,
        )
      }
    })

    insertMany(records)

    return { success: true, count: records.length }
  } catch (error) {
    console.error("Error importing CSV data:", error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

// Check if the database file exists
export function checkDatabaseExists() {
  const dbPath = path.join(process.cwd(), "data", "call-logs.db")
  return fs.existsSync(dbPath)
}

// Close the database connection when the server shuts down
if (process.env.NODE_ENV !== "development") {
  process.on("SIGTERM", () => {
    if (db) {
      console.log("Closing database connection")
      db.close()
    }
  })
}
