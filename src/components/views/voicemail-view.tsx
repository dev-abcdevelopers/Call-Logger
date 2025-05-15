import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, VoicemailIcon as VoiceMail, Play, MoreVertical, Phone, Save, Trash } from "lucide-react"
import { voicemails } from "@/data/voicemail-data"

export default function VoicemailView() {
  return (
    <div className="animate-in fade-in duration-300">
      {/* Search Bar */}
      <div className="mb-6 relative">
        <Input
          placeholder="Search voicemails..."
          className="pl-10 bg-white dark:bg-gray-900 border-none shadow-md rounded-xl"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      {/* Voicemail Stats */}
      <Card className="border-none shadow-lg mb-6 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Voicemail Box</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">7 new messages</p>
            </div>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <VoiceMail className="h-4 w-4 mr-2" /> Play All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Voicemail List */}
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Messages</h2>

      <div className="space-y-3">
        {voicemails.map((voicemail, index) => (
          <VoicemailCard key={index} voicemail={voicemail} />
        ))}
      </div>
    </div>
  )
}

interface VoicemailCardProps {
  voicemail: {
    from: string
    date: string
    duration: string
    isNew: boolean
    transcription: string | null
  }
}

function VoicemailCard({ voicemail }: VoicemailCardProps) {
  return (
    <Card
      className={`border-none shadow-md ${
        voicemail.isNew ? "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10" : ""
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-500 text-white">
              {voicemail.from.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center">
              <p className="font-medium text-gray-800 dark:text-gray-200">{voicemail.from}</p>
              {voicemail.isNew && <Badge className="ml-2 bg-pink-500 text-white">New</Badge>}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {voicemail.date} • {voicemail.duration}
            </p>
          </div>
          <div className="flex">
            <Button variant="ghost" size="icon" className="rounded-full text-purple-600 dark:text-purple-400">
              <Play className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreVertical className="h-5 w-5 text-gray-400" />
            </Button>
          </div>
        </div>

        {voicemail.transcription && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-900/50 p-3 rounded-lg">
            &ldquo;{voicemail.transcription}&rdquo;
          </div>
        )}

        <div className="flex mt-3 gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Phone className="h-4 w-4 mr-2" /> Call Back
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Save className="h-4 w-4 mr-2" /> Save
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Trash className="h-4 w-4 mr-2" /> Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
