"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Upload, Link, FileUp, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"

interface ImportCSVProps {
  importType: "url" | "file"
}

export default function ImportCSV({ importType }: ImportCSVProps) {
  const [csvUrl, setCsvUrl] = useState(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CALLLOG-G0BdNj2gDsl2ILQmlv2CJ66sNoFpKy.csv",
  )
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null)
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleImportFromUrl = async () => {
    if (!csvUrl) return

    try {
      setLoading(true)
      setProgress(10)
      setResult(null)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 300)

      const response = await fetch("/api/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ csvUrl }),
      })

      clearInterval(progressInterval)
      setProgress(100)

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: data.message,
        })

        // After successful import, redirect to main page after 2 seconds
        setTimeout(() => {
          router.push("/")
        }, 2000)
      } else {
        setResult({
          success: false,
          error: data.error || "Failed to import CSV data",
        })
      }
    } catch {
      setResult({
        success: false,
        error: "An unexpected error occurred",
      })
      setProgress(0)
    } finally {
      setLoading(false)
    }
  }

  const handleImportFromFile = async () => {
    if (!selectedFile) return

    try {
      setLoading(true)
      setProgress(10)
      setResult(null)

      // Create FormData
      const formData = new FormData()
      formData.append("file", selectedFile)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 300)

      const response = await fetch("/api/import-file", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setProgress(100)

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: data.message,
        })

        // After successful import, redirect to main page after 2 seconds
        setTimeout(() => {
          router.push("/")
        }, 2000)
      } else {
        setResult({
          success: false,
          error: data.error || "Failed to import CSV file",
        })
      }
    } catch {
      setResult({
        success: false,
        error: "An unexpected error occurred",
      })
      setProgress(0)
    } finally {
      setLoading(false)
    }
  }

  const handleImport = () => {
    if (importType === "url") {
      handleImportFromUrl()
    } else {
      handleImportFromFile()
    }
  }

  return (
    <Card className="border-none shadow-lg overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"></div>
      <CardContent className="p-6">
        <div className="space-y-4">
          {importType === "url" ? (
            <div className="space-y-2">
              <label htmlFor="csvUrl" className="text-sm font-medium flex items-center gap-2">
                <Link className="h-4 w-4 text-purple-500" />
                CSV URL
              </label>
              <Input
                id="csvUrl"
                placeholder="Enter CSV URL"
                value={csvUrl}
                onChange={(e) => setCsvUrl(e.target.value)}
                className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
              />
              <p className="text-xs text-gray-500">Enter the URL of a CSV file containing call log data.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <label htmlFor="csvFile" className="text-sm font-medium flex items-center gap-2">
                <FileUp className="h-4 w-4 text-purple-500" />
                CSV File
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  selectedFile
                    ? "border-purple-300 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20"
                    : "border-gray-300 hover:border-purple-300 dark:border-gray-700 dark:hover:border-purple-800"
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  id="csvFile"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {selectedFile ? (
                  <div>
                    <CheckCircle2 className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {(selectedFile.size / 1024).toFixed(2)} KB • Click to change
                    </p>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Click to upload CSV file</p>
                    <p className="text-xs text-gray-500 mt-1">or drag and drop</p>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">Upload a CSV file containing call log data from your device.</p>
            </div>
          )}

          {loading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Importing data...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {result && (
            <Alert
              variant={result.success ? "default" : "destructive"}
              className={result.success ? "bg-green-50 dark:bg-green-900/20" : ""}
            >
              {result.success ? (
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
              <AlertDescription>
                {result.success ? (
                  <>
                    {result.message}
                    <div className="mt-2 text-sm text-gray-500">Redirecting to dashboard...</div>
                  </>
                ) : (
                  result.error
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-900/50 p-6">
        <Button
          onClick={handleImport}
          disabled={loading || (importType === "url" ? !csvUrl : !selectedFile)}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Importing...
            </>
          ) : (
            <>
              Import {importType === "url" ? "from URL" : "File"}
              <Upload className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
