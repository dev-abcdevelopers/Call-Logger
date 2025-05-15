"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Calendar, PhoneIncoming, PhoneOutgoing, PhoneMissed, Phone, Info } from "lucide-react"
import { useCalls, formatDuration, getCallTypeCategory, formatDate } from "@/hooks/use-calls"
import { getCallTypeIcon, getCallTypeColor, getCallTypeBadgeColor } from "@/lib/call-utils"
import { useCallStats } from "@/hooks/use-calls"

export default function HistoryView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(0)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Get overall call statistics
  const { stats, loading: statsLoading } = useCallStats()

  // Use the useCalls hook to fetch call data
  const { calls, pagination, loading, error } = useCalls({
    limit: 50,
    offset: page * 50,
    date: selectedDate || undefined,
  })

  // State for filtered call counts
  const [filteredStats, setFilteredStats] = useState({
    incoming: 0,
    outgoing: 0,
    missed: 0,
  })

  // Group calls by date
  // Remove or comment out this block:
  // const callsByDate = calls.reduce((acc, call) => {
  //   const formattedDate = formatDate(call.DATES)
  //   if (!acc[formattedDate]) {
  //     acc[formattedDate] = []
  //   }
  //   acc[formattedDate].push(call)
  //   return acc
  // }, {})

  // Filter calls by search query
  const filteredCalls = searchQuery
    ? calls.filter(
        (call) =>
          (call.contact_name && call.contact_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          call.CELLNUMBER.includes(searchQuery) ||
          call.CALLTYPE.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : calls

  // Update filtered stats when calls or search query changes
  useEffect(() => {
    // Calculate call statistics for filtered calls
    const incoming = filteredCalls.filter((call) => getCallTypeCategory(call.CALLTYPE) === "incoming").length

    const outgoing = filteredCalls.filter((call) => getCallTypeCategory(call.CALLTYPE) === "outgoing").length

    const missed = filteredCalls.filter((call) => getCallTypeCategory(call.CALLTYPE) === "missed").length

    setFilteredStats({
      incoming,
      outgoing,
      missed,
    })
  }, [filteredCalls])

  // Group filtered calls by date
  const filteredCallsByDate = filteredCalls.reduce((acc, call) => {
    const formattedDate = formatDate(call.DATES)
    if (!acc[formattedDate]) {
      acc[formattedDate] = []
    }
    acc[formattedDate].push(call)
    return acc
  }, {})

  const loadMore = () => {
    if (pagination?.hasMore) {
      setPage(page + 1)
    }
  }

  const handleDateFilter = () => {
    // This would typically open a date picker
    // For now, we'll just toggle between today and all dates
    if (selectedDate) {
      setSelectedDate(null)
    } else {
      const today = new Date().toISOString().split("T")[0]
      setSelectedDate(today)
    }
    setPage(0) // Reset pagination when filter changes
  }

  // Determine which stats to show - if we're filtering, show filtered stats, otherwise show overall stats
  const displayStats = searchQuery || selectedDate ? filteredStats : stats || { incoming: 0, outgoing: 0, missed: 0 }

  return (
    <div className="animate-in fade-in duration-300">
      {/* Search and Filter */}
      <div className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Search call history..."
            className="pl-10 bg-white dark:bg-gray-900 border-none shadow-md rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <Button
          variant="outline"
          className={`bg-white dark:bg-gray-900 border-none shadow-md rounded-xl ${selectedDate ? "text-purple-600 dark:text-purple-400" : ""}`}
          onClick={handleDateFilter}
        >
          <Calendar className="h-5 w-5 mr-2" />
          {selectedDate ? "Clear Filter" : "Filter"}
        </Button>
      </div>

      {/* Call Stats Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {statsLoading && !searchQuery && !selectedDate ? (
          <>
            <CallStatCardSkeleton />
            <CallStatCardSkeleton />
            <CallStatCardSkeleton />
          </>
        ) : (
          <>
            <CallStatCard
              type="incoming"
              count={displayStats.incoming}
              icon={<PhoneIncoming className="h-4 w-4 text-green-600 dark:text-green-400" />}
              color="green"
            />
            <CallStatCard
              type="outgoing"
              count={displayStats.outgoing}
              icon={<PhoneOutgoing className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
              color="blue"
            />
            <CallStatCard
              type="missed"
              count={displayStats.missed}
              icon={<PhoneMissed className="h-4 w-4 text-red-600 dark:text-red-400" />}
              color="red"
            />
          </>
        )}
      </div>

      {/* Call History */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Call History</h2>
        {selectedDate && (
          <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
            Filtered by date: {formatDate(selectedDate)}
          </Badge>
        )}
      </div>

      {loading && page === 0 ? (
        <div className="space-y-4">
          <CallLogSkeleton />
          <CallLogSkeleton />
          <CallLogSkeleton />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">{error}</div>
      ) : filteredCalls.length === 0 ? (
        <div className="text-center p-8 text-gray-500 dark:text-gray-400">
          {searchQuery ? "No matching calls found" : "No call history found"}
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-340px)]">
          <div className="space-y-1">
            {Object.keys(filteredCallsByDate).map((date) => (
              <div key={date}>
                <div className="sticky top-0 bg-purple-50/80 dark:bg-gray-900/80 backdrop-blur-sm py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  {date}
                </div>
                {filteredCallsByDate[date].map((log, index) => (
                  <Card key={index} className="border-none shadow-sm mb-2">
                    <CardContent className="p-3">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full mr-3 ${getCallTypeColor(getCallTypeCategory(log.CALLTYPE))}`}>
                          {getCallTypeIcon(getCallTypeCategory(log.CALLTYPE))}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                              {log.contact_name || log.CELLNUMBER}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{log.TIME}</p>
                          </div>
                          <div className="flex items-center mt-1">
                            <Badge
                              variant="outline"
                              className={`text-xs ${getCallTypeBadgeColor(getCallTypeCategory(log.CALLTYPE))}`}
                            >
                              {log.CALLTYPE}
                            </Badge>
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                              {formatDuration(log.CALLDURATION)}
                            </span>
                            {log.SENTBY && (
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{log.SENTBY}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex">
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </Button>
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <Info className="h-5 w-5 text-gray-400" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}

            {pagination?.hasMore && (
              <div className="flex justify-center my-4">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={loading}
                  className="text-purple-600 dark:text-purple-400"
                >
                  {loading ? "Loading..." : "Load More"}
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}

interface CallStatCardProps {
  type: string
  count: number
  icon: React.ReactNode
  color: string
}

function CallStatCard({ type, count, icon, color }: CallStatCardProps) {
  return (
    <Card
      className={`border-none shadow-md bg-gradient-to-br from-${color}-50 to-${color}-100 dark:from-${color}-900/20 dark:to-${color}-800/20`}
    >
      <CardContent className="p-3">
        <div className="flex items-center">
          <div className={`bg-${color}-100 dark:bg-${color}-900/30 p-2 rounded-full mr-2`}>{icon}</div>
          <div>
            <p className={`text-xs text-${color}-700 dark:text-${color}-300`}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </p>
            <p className={`text-lg font-bold text-${color}-800 dark:text-${color}-200`}>{count}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CallStatCardSkeleton() {
  return (
    <Card className="border-none shadow-md">
      <CardContent className="p-3">
        <div className="flex items-center">
          <div className="p-2 rounded-full mr-2 bg-gray-200 dark:bg-gray-700 h-8 w-8"></div>
          <div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-1"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CallLogSkeleton() {
  return (
    <Card className="border-none shadow-sm mb-2">
      <CardContent className="p-3">
        <div className="flex items-center">
          <div className="p-2 rounded-full mr-3 bg-gray-200 dark:bg-gray-700 h-8 w-8"></div>
          <div className="flex-1">
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </div>
            <div className="flex items-center mt-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mr-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
            </div>
          </div>
          <div className="flex">
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full mr-1"></div>
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
