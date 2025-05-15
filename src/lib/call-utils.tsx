import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed } from "lucide-react"

export function getCallTypeIcon(type: string) {
  switch (type) {
    case "incoming":
      return <PhoneIncoming className="h-4 w-4 text-green-600 dark:text-green-400" />
    case "outgoing":
      return <PhoneOutgoing className="h-4 w-4 text-blue-600 dark:text-blue-400" />
    case "missed":
      return <PhoneMissed className="h-4 w-4 text-red-600 dark:text-red-400" />
    default:
      return <Phone className="h-4 w-4" />
  }
}

export function getCallTypeColor(type: string) {
  switch (type) {
    case "incoming":
      return "bg-green-100 dark:bg-green-900/30"
    case "outgoing":
      return "bg-blue-100 dark:bg-blue-900/30"
    case "missed":
      return "bg-red-100 dark:bg-red-900/30"
    default:
      return "bg-gray-100 dark:bg-gray-800"
  }
}

export function getCallTypeBgColor(type: string) {
  switch (type) {
    case "incoming":
      return "bg-green-500"
    case "outgoing":
      return "bg-blue-500"
    case "missed":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

export function getCallTypeBadgeColor(type: string) {
  switch (type) {
    case "incoming":
      return "text-green-600 dark:text-green-400 border-green-200 dark:border-green-800"
    case "outgoing":
      return "text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
    case "missed":
      return "text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
    default:
      return "text-gray-600 dark:text-gray-400"
  }
}
