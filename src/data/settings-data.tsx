import { Phone, Bell, Palette, Shield, Database, HelpCircle } from "lucide-react"

export const settingsCategories = [
  {
    name: "Call Settings",
    icon: <Phone className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    settings: [
      { name: "Call Forwarding", description: "Forward calls to another number", type: "link" },
      {
        name: "Call Waiting",
        description: "Get notified of incoming calls while on a call",
        type: "toggle",
        enabled: true,
      },
      { name: "Caller ID", description: "Show your number when making calls", type: "toggle", enabled: true },
      { name: "Auto-Reject", description: "Automatically reject specific numbers", type: "link" },
      { name: "Answer Options", description: "Configure how calls are answered", type: "link" },
    ],
  },
  {
    name: "Notifications",
    icon: <Bell className="h-5 w-5 text-pink-600 dark:text-pink-400" />,
    iconBg: "bg-pink-100 dark:bg-pink-900/30",
    settings: [
      { name: "Call Notifications", description: "Get notified for incoming calls", type: "toggle", enabled: true },
      { name: "Missed Call Alerts", description: "Get alerts for missed calls", type: "toggle", enabled: true },
      {
        name: "Voicemail Notifications",
        description: "Get notified for new voicemails",
        type: "toggle",
        enabled: true,
      },
      { name: "Sound & Vibration", description: "Configure notification sounds", type: "link" },
    ],
  },
  {
    name: "Appearance",
    icon: <Palette className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />,
    iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
    settings: [
      { name: "Dark Mode", description: "Toggle between light and dark theme", type: "toggle", enabled: false },
      { name: "Color Theme", description: "Choose app color scheme", type: "link" },
      { name: "Text Size", description: "Adjust the text size", type: "link" },
    ],
  },
  {
    name: "Privacy & Security",
    icon: <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />,
    iconBg: "bg-green-100 dark:bg-green-900/30",
    settings: [
      { name: "Call Recording", description: "Configure call recording settings", type: "link" },
      { name: "Call History Retention", description: "How long to keep call history", type: "link" },
      { name: "App Lock", description: "Require authentication to open app", type: "toggle", enabled: false },
      { name: "Privacy Policy", description: "View our privacy policy", type: "link" },
    ],
  },
  {
    name: "Storage & Data",
    icon: <Database className="h-5 w-5 text-orange-600 dark:text-orange-400" />,
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
    settings: [
      { name: "Storage Usage", description: "Manage app storage", type: "link" },
      { name: "Clear Cache", description: "Free up space by clearing cache", type: "link" },
      { name: "Data Usage", description: "Manage mobile data usage", type: "link" },
    ],
  },
  {
    name: "Help & Support",
    icon: <HelpCircle className="h-5 w-5 text-teal-600 dark:text-teal-400" />,
    iconBg: "bg-teal-100 dark:bg-teal-900/30",
    settings: [
      { name: "FAQ", description: "Frequently asked questions", type: "link" },
      { name: "Contact Support", description: "Get help with the app", type: "link" },
      { name: "Report a Bug", description: "Help us improve", type: "link" },
      { name: "About", description: "App information and credits", type: "link" },
    ],
  },
]
