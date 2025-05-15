"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, PhoneIncoming, PhoneOutgoing, PhoneMissed } from "lucide-react"
import CallLogsView from "@/components/views/call-logs-view"
import { quickActions } from "@/data/quick-actions"
import { getCallTypeColor, getCallTypeIcon } from "@/lib/call-utils"
import { useCallStats, getCallTypeCategory, formatDate, type CallLog } from "@/hooks/use-calls"

interface CallsViewProps {
  showCallLogs: boolean
  selectedCall: CallLog | null
  callTypeFilter: string | null
  handleCallClick: (call: CallLog) => void
  handleCallTypeClick: (type: string | null) => void
  closeCallLogs: () => void
  handleTabChange: (tab: string) => void
}

export default function CallsView({
  showCallLogs,
  selectedCall,
  callTypeFilter,
  handleCallClick,
  handleCallTypeClick,
  closeCallLogs,
  handleTabChange,
}: CallsViewProps) {
  const { stats, recentCalls, loading, error } = useCallStats()
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <>
      {!showCallLogs ? (
        <>
          {/* Search Bar */}
          <div className="mb-6 relative">
            <Input
              placeholder="Search calls..."
              className="pl-10 bg-white dark:bg-gray-900 border-none shadow-md rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          {/* Call Stats */}
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Call Activity</h2>

          {loading ? (
            <div className="grid grid-cols-3 gap-3 mb-6">
              <CallActivityCardSkeleton />
              <CallActivityCardSkeleton />
              <CallActivityCardSkeleton />
            </div>
          ) : error ? (
            <div className="p-4 mb-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 mb-6">
              <CallActivityCard
                type="incoming"
                count={stats?.incoming || 0}
                icon={<PhoneIncoming className="h-6 w-6 text-green-600 dark:text-green-400" />}
                color="bg-green-500"
                bgColor="bg-green-100 dark:bg-green-900/30"
                onClick={() => handleCallTypeClick("Incoming")}
              />
              <CallActivityCard
                type="outgoing"
                count={stats?.outgoing || 0}
                icon={<PhoneOutgoing className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
                color="bg-blue-500"
                bgColor="bg-blue-100 dark:bg-blue-900/30"
                onClick={() => handleCallTypeClick("Outgoing")}
              />
              <CallActivityCard
                type="missed"
                count={stats?.missed || 0}
                icon={<PhoneMissed className="h-6 w-6 text-red-600 dark:text-red-400" />}
                color="bg-red-500"
                bgColor="bg-red-100 dark:bg-red-900/30"
                onClick={() => handleCallTypeClick("Missed")}
              />
            </div>
          )}

          {/* Recent Calls */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Recent Calls</h2>
              <Button
                variant="ghost"
                className="text-sm text-purple-600 dark:text-purple-400"
                onClick={() => handleCallTypeClick(null)}
              >
                View All
              </Button>
            </div>

            {loading ? (
              <div className="space-y-3">
                <RecentCallCardSkeleton />
                <RecentCallCardSkeleton />
                <RecentCallCardSkeleton />
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">{error}</div>
            ) : (
              <div className="space-y-3">
                {recentCalls.length > 0 ? (
                  recentCalls.map((call, index) => (
                    <Card
                      key={index}
                      className="border-none shadow-md transition-all hover:shadow-lg active:scale-[0.98] cursor-pointer"
                      onClick={() => handleCallClick(call)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <div
                            className={`p-2 rounded-full mr-3 ${getCallTypeColor(getCallTypeCategory(call.CALLTYPE))}`}
                          >
                            {getCallTypeIcon(getCallTypeCategory(call.CALLTYPE))}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800 dark:text-gray-200">
                              {call.contact_name || call.CELLNUMBER}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(call.DATES)}, {call.TIME}
                            </p>
                          </div>
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <PhoneIncoming className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center p-4 text-gray-500 dark:text-gray-400">No recent calls found</div>
                )}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Quick Actions</h2>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {quickActions.map((action, index) => (
              <div key={index} className="flex flex-col items-center">
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-14 w-14 rounded-xl border-none shadow-md ${action.bgColor}`}
                  onClick={() => handleTabChange(action.target)}
                >
                  {action.icon}
                </Button>
                <span className="text-xs mt-2 text-gray-600 dark:text-gray-400">{action.label}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <CallLogsView call={selectedCall} callTypeFilter={callTypeFilter} onClose={closeCallLogs} />
      )}
    </>
  )
}

interface CallActivityCardProps {
  type: string
  count: number
  icon: React.ReactNode
  color: string
  bgColor: string
  onClick: () => void
}

function CallActivityCard({ type, count, icon, color, bgColor, onClick }: CallActivityCardProps) {
  return (
    <Card
      className="overflow-hidden border-none shadow-lg transition-all hover:shadow-xl active:scale-[0.98] cursor-pointer"
      onClick={onClick}
    >
      <div className={`h-2 ${color}`} />
      <CardContent className="p-4">
        <div className="flex flex-col items-center">
          <div className={`p-3 rounded-full mb-2 ${bgColor}`}>{icon}</div>
          <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">{count}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

function CallActivityCardSkeleton() {
  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <div className="h-2 bg-gray-200 dark:bg-gray-700" />
      <CardContent className="p-4">
        <div className="flex flex-col items-center">
          <div className="p-3 rounded-full mb-2 bg-gray-200 dark:bg-gray-700 h-12 w-12"></div>
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </CardContent>
    </Card>
  )
}

function RecentCallCardSkeleton() {
  return (
    <Card className="border-none shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center">
          <div className="p-2 rounded-full mr-3 bg-gray-200 dark:bg-gray-700 h-10 w-10"></div>
          <div className="flex-1">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          </div>
          <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
      </CardContent>
    </Card>
  )
}
