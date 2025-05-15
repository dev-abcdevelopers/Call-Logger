"use client"

import { useState } from "react"
import ImportCSV from "@/components/import-csv"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ImportPage() {
  const [activeTab, setActiveTab] = useState("url")

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-950 shadow-sm p-4">
        <div className="flex items-center justify-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
            Import Call Logs
          </h1>
        </div>
      </header>

      <main className="flex-1 p-4 overflow-auto">
        <div className="max-w-md mx-auto mt-4">
          <div className="text-center mb-6">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 inline-flex mb-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              No database found. Please import call logs to get started.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              You can import call logs from a URL or upload a CSV file from your device.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="url">Import from URL</TabsTrigger>
              <TabsTrigger value="file">Upload File</TabsTrigger>
            </TabsList>
            <TabsContent value="url" className="mt-0">
              <ImportCSV importType="url" />
            </TabsContent>
            <TabsContent value="file" className="mt-0">
              <ImportCSV importType="file" />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="p-4 text-center text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-950 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] border-t border-gray-100 dark:border-gray-800">
        <p>Call Manager v1.0.0</p>
      </footer>
    </div>
  )
}
