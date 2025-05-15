import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Ban, Plus } from "lucide-react"
import { blockedNumbers } from "@/data/blocked-data"

export default function BlockedView() {
  return (
    <div className="animate-in fade-in duration-300">
      {/* Search Bar */}
      <div className="mb-6 relative">
        <Input
          placeholder="Search blocked numbers..."
          className="pl-10 bg-white dark:bg-gray-900 border-none shadow-md rounded-xl"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      {/* Blocked Summary */}
      <Card className="border-none shadow-lg mb-6 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Blocked Numbers</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{blockedNumbers.length} numbers blocked</p>
            </div>
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
              <Plus className="h-4 w-4 mr-2" /> Block New
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Blocked List */}
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Blocked Numbers</h2>

      <div className="space-y-3">
        {blockedNumbers.map((blocked, index) => (
          <BlockedNumberCard key={index} blocked={blocked} />
        ))}
      </div>
    </div>
  )
}

interface BlockedNumberCardProps {
  blocked: {
    name: string | null
    number: string
    reason: string | null
  }
}

function BlockedNumberCard({ blocked }: BlockedNumberCardProps) {
  return (
    <Card className="border-none shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center">
          <div className="p-3 rounded-full mr-3 bg-red-100 dark:bg-red-900/30">
            <Ban className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-800 dark:text-gray-200">{blocked.name || "Unknown"}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{blocked.number}</p>
            {blocked.reason && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Reason: {blocked.reason}</p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
          >
            Unblock
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
