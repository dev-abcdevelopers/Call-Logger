"use client"

import { useState, useEffect } from "react"

export interface CallLog {
  ID: string
  DATES: string
  TIME: string
  CELLNUMBER: string
  CALLTYPE: string
  LOG: string
  SENTBY: string
  BYSIM: number
  LOOKUP: string | null
  CALLDURATION: number
  FLAG: number
  contact_name: string | null
}

interface CallStats {
  incoming: number
  outgoing: number
  missed: number
  total: number
}

interface DurationStats {
  total_duration: number
  avg_duration: number
  max_duration: number
}

interface TopContact {
  CELLNUMBER: string
  count: number
  contact_name: string | null
}

interface Pagination {
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

export function useCallStats() {
  const [stats, setStats] = useState<CallStats | null>(null)
  const [recentCalls, setRecentCalls] = useState<CallLog[]>([])
  const [topContacts, setTopContacts] = useState<TopContact[]>([])
  const [durationStats, setDurationStats] = useState<DurationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)
        const response = await fetch("/api/stats")

        if (!response.ok) {
          throw new Error("Failed to fetch call statistics")
        }

        const data = await response.json()
        setStats(data.stats)
        setRecentCalls(data.recentCalls)
        setTopContacts(data.topContacts)
        setDurationStats(data.durationStats)
      } catch (err) {
        console.error("Error fetching call statistics:", err)
        setError("Failed to load call statistics")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, recentCalls, topContacts, durationStats, loading, error }
}

export function useCalls(
  options: {
    callType?: string
    cellNumber?: string
    date?: string
    limit?: number
    offset?: number
  } = {},
) {
  const [calls, setCalls] = useState<CallLog[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { callType, cellNumber, date, limit = 50, offset = 0 } = options

  useEffect(() => {
    async function fetchCalls() {
      try {
        setLoading(true)
        let url = "/api/calls"
        const params = new URLSearchParams()

        if (callType) params.append("callType", callType)
        if (cellNumber) params.append("cellNumber", cellNumber)
        if (date) params.append("date", date)
        params.append("limit", limit.toString())
        params.append("offset", offset.toString())

        if (params.toString()) {
          url += `?${params.toString()}`
        }

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error("Failed to fetch calls")
        }

        const data = await response.json()
        setCalls(data.calls)
        setPagination(data.pagination)
      } catch (err) {
        console.error("Error fetching calls:", err)
        setError("Failed to load calls")
      } finally {
        setLoading(false)
      }
    }

    fetchCalls()
  }, [callType, cellNumber, date, limit, offset])

  return { calls, pagination, loading, error }
}

// Helper function to format call duration
export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return "0:00"

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

// Helper function to get call type category
export function getCallTypeCategory(callType: string): "incoming" | "outgoing" | "missed" {
  const lowerType = callType.toLowerCase()

  if (lowerType.includes("incoming")) {
    return "incoming"
  } else if (lowerType.includes("outgoing")) {
    return "outgoing"
  } else if (lowerType.includes("missed")) {
    return "missed"
  }

  // Default to outgoing if can't determine
  return "outgoing"
}

// Helper function to format date
export function formatDate(dateStr: string): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const date = new Date(dateStr)
  date.setHours(0, 0, 0, 0)

  if (date.getTime() === today.getTime()) {
    return "Today"
  } else if (date.getTime() === yesterday.getTime()) {
    return "Yesterday"
  } else {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: today.getFullYear() !== date.getFullYear() ? "numeric" : undefined,
    })
  }
}
