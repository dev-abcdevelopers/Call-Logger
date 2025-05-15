import { Users, VoicemailIcon as VoiceMail, Ban, Settings } from "lucide-react"

export const quickActions = [
  {
    label: "Contacts",
    icon: <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    target: "contacts",
  },
  {
    label: "Voicemail",
    icon: <VoiceMail className="h-6 w-6 text-pink-600 dark:text-pink-400" />,
    bgColor: "bg-pink-100 dark:bg-pink-900/30",
    target: "voicemail",
  },
  {
    label: "Blocked",
    icon: <Ban className="h-6 w-6 text-orange-600 dark:text-orange-400" />,
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    target: "blocked",
  },
  {
    label: "Settings",
    icon: <Settings className="h-6 w-6 text-teal-600 dark:text-teal-400" />,
    bgColor: "bg-teal-100 dark:bg-teal-900/30",
    target: "settings",
  },
]
