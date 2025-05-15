import { Button } from "@/components/ui/button"
import { Search, Settings } from "lucide-react"

interface HeaderProps {
  activeTab: string
}

export default function Header({ activeTab }: HeaderProps) {
  const getTitle = () => {
    switch (activeTab) {
      case "calls":
        return "Call Manager"
      case "contacts":
        return "Contacts"
      case "history":
        return "Call History"
      case "voicemail":
        return "Voicemail"
      case "settings":
        return "Settings"
      case "blocked":
        return "Blocked"
      default:
        return "Call Manager"
    }
  }

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-950 shadow-sm p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
          {getTitle()}
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
