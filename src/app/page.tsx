"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import Header from "@/components/layout/header"
import BottomNavigation from "@/components/layout/bottom-navigation"
import CallsView from "@/components/views/calls-view"
import ContactsView from "@/components/views/contacts-view"
import HistoryView from "@/components/views/history-view"
import VoicemailView from "@/components/views/voicemail-view"
import BlockedView from "@/components/views/blocked-view"
import SettingsView from "@/components/views/settings-view"
import type { CallLog } from "@/hooks/use-calls"
import { useRouter } from "next/navigation"

export default function CallDashboard() {
  const [activeTab, setActiveTab] = useState("calls")
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null)
  const [showCallLogs, setShowCallLogs] = useState(false)
  const [callTypeFilter, setCallTypeFilter] = useState<string | null>(null)
  const [animateTab, setAnimateTab] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if database exists
    async function checkDatabase() {
      try {
        const response = await fetch("/api/check-database")
        const data = await response.json()

        if (!data.exists) {
          // Redirect to import page if database doesn't exist
          router.push("/import")
        }
      } catch (error) {
        console.error("Error checking database:", error)
        // If there's an error, assume database doesn't exist
        router.push("/import")
      } finally {
        setIsLoading(false)
      }
    }

    checkDatabase()
  }, [router])

  const handleCallClick = (call: CallLog) => {
    setSelectedCall(call)
    setShowCallLogs(true)
  }

  const handleCallTypeClick = (type: string | null) => {
    setCallTypeFilter(type)
    setSelectedCall(null)
    setShowCallLogs(true)
  }

  const closeCallLogs = () => {
    setShowCallLogs(false)
    setCallTypeFilter(null)
  }

  const handleTabChange = (tab: string) => {
    setAnimateTab(tab)
    setTimeout(() => {
      setAnimateTab("")
    }, 500)
    setActiveTab(tab)
    setShowCallLogs(false)
  }

  // Show loading state while checking database
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="w-16 h-16 border-4 border-purple-400 border-t-purple-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading application...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Tabs value={activeTab} className="flex flex-col min-h-screen">
        <Header activeTab={activeTab} />

        <main className="flex-1 p-4 overflow-auto safe-bottom">
          <TabsContent value="calls" className="mt-0 h-full">
            <CallsView
              showCallLogs={showCallLogs}
              selectedCall={selectedCall}
              callTypeFilter={callTypeFilter}
              handleCallClick={handleCallClick}
              handleCallTypeClick={handleCallTypeClick}
              closeCallLogs={closeCallLogs}
              handleTabChange={handleTabChange}
            />
          </TabsContent>

          <TabsContent value="contacts" className="mt-0 h-full">
            <ContactsView />
          </TabsContent>

          <TabsContent value="history" className="mt-0 h-full">
            <HistoryView />
          </TabsContent>

          <TabsContent value="voicemail" className="mt-0 h-full">
            <VoicemailView />
          </TabsContent>

          <TabsContent value="blocked" className="mt-0 h-full">
            <BlockedView />
          </TabsContent>

          <TabsContent value="settings" className="mt-0 h-full">
            <SettingsView />
          </TabsContent>
        </main>

        <BottomNavigation activeTab={activeTab} animateTab={animateTab} handleTabChange={handleTabChange} />
      </Tabs>
    </div>
  )
}
