"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Calendar, ChevronRight, Phone, MessageSquare, Info } from "lucide-react"
import { useCalls, formatDuration, getCallTypeCategory, formatDate, type CallLog } from "@/hooks/use-calls"
import { getCallTypeIcon, getCallTypeColor, getCallTypeBgColor, getCallTypeBadgeColor } from "@/lib/call-utils"
import { useState } from "react"

interface CallLogsViewProps {
  call: CallLog | null
  callTypeFilter: string | null
  onClose: () => void
}

export default function CallLogsView({ call, callTypeFilter, onClose }: CallLogsViewProps) {
  const [page, setPage] = useState(0)
  const { calls, pagination, loading, error } = useCalls({
    callType: callTypeFilter || undefined,
    cellNumber: call?.CELLNUMBER || undefined,
    limit: 50,
    offset: page * 50,
  })

  const getFilterInfo = () => {
    if (call)
      return {
        title: call.contact_name ? `Calls with ${call.contact_name}` : `Calls to ${call.CELLNUMBER}`,
        color: getCallTypeBgColor(getCallTypeCategory(call.CALLTYPE)),
      }

    switch (callTypeFilter) {
      case "Incoming":
        return { title: "Incoming Calls", color: "bg-green-500" }
      case "Outgoing":
        return { title: "Outgoing Calls", color: "bg-blue-500" }
      case "Missed":
        return { title: "Missed Calls", color: "bg-red-500" }
      default:
        return { title: "All Calls", color: "bg-purple-500" }
    }
  }

  const { title, color } = getFilterInfo()

  // Group calls by date
  const callsByDate = calls.reduce((acc, call) => {
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

  return (
    <div className="animate-in slide-in-from-right duration-300">
      {/* Call Logs Header */}
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={onClose} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{title}</h2>
      </div>

      {/* Contact Info - Only show if a specific call is selected */}
      {call && (
        <Card className="border-none shadow-lg mb-6 overflow-hidden">
          <div className={`h-2 ${getCallTypeBgColor(getCallTypeCategory(call.CALLTYPE))}`} />
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-xl mr-4">
                {(call.contact_name || call.CELLNUMBER).charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {call.contact_name || call.CELLNUMBER}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {call.SENTBY} • {formatDuration(call.CALLDURATION)}
                </p>
              </div>
            </div>

            <div className="flex mt-4 gap-2">
              <Button className="flex-1 bg-green-500 hover:bg-green-600">
                <Phone className="h-4 w-4 mr-2" /> Call
              </Button>
              <Button variant="outline" className="flex-1">
                <MessageSquare className="h-4 w-4 mr-2" /> Message
              </Button>
              <Button variant="outline" size="icon">
                <Info className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Call Type Summary - Only show if filtering by call type */}
      {callTypeFilter && !call && (
        <Card className="border-none shadow-lg mb-6 overflow-hidden">
          <div className={`h-2 ${color}`} />
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className={`p-3 rounded-full mr-4 ${getCallTypeColor(getCallTypeCategory(callTypeFilter))}`}>
                {getCallTypeIcon(getCallTypeCategory(callTypeFilter))}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {callTypeFilter === "Incoming"
                    ? "Incoming Calls"
                    : callTypeFilter === "Outgoing"
                      ? "Outgoing Calls"
                      : "Missed Calls"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {pagination?.total || calls.length} {callTypeFilter.toLowerCase()} calls
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Call Logs */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">{call ? "Call History" : "All Calls"}</h3>
        <Button variant="ghost" size="sm" className="text-purple-600 dark:text-purple-400 text-sm">
          <Calendar className="h-4 w-4 mr-1" /> Filter
        </Button>
      </div>

      {loading && page === 0 ? (
        <div className="space-y-4">
          <CallLogSkeleton />
          <CallLogSkeleton />
          <CallLogSkeleton />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">{error}</div>
      ) : calls.length === 0 ? (
        <div className="text-center p-8 text-gray-500 dark:text-gray-400">No call logs found</div>
      ) : (
        <ScrollArea className="h-[calc(100vh-400px)]">
          <div className="space-y-1">
            {Object.keys(callsByDate).map((date) => (
              <div key={date}>
                <div className="sticky top-0 bg-purple-50/80 dark:bg-gray-900/80 backdrop-blur-sm py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  {date}
                </div>
                {callsByDate[date].map((log, index) => (
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
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full">
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </Button>
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
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
      </CardContent>
    </Card>
  )
}
