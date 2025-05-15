import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChevronRight } from "lucide-react"
import { settingsCategories } from "@/data/settings-data"

export default function SettingsView() {
  return (
    <div className="animate-in fade-in duration-300">
      {/* User Profile */}
      <Card className="border-none shadow-lg mb-6 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500" />
        <CardContent className="p-4">
          <div className="flex items-center">
            <Avatar className="h-16 w-16 mr-4">
              <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-500 text-white text-xl">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">John Doe</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">+1 (555) 123-4567</p>
            </div>
            <Button variant="outline" size="sm">
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Settings Categories */}
      <div className="space-y-4">
        {settingsCategories.map((category, index) => (
          <SettingsCategoryCard key={index} category={category} />
        ))}
      </div>

      {/* App Info */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">Call Manager v1.0.0</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">© 2025 All Rights Reserved</p>
      </div>
    </div>
  )
}

interface SettingsCategoryCardProps {
  category: {
    name: string
    icon: React.ReactNode
    iconBg: string
    settings: {
      name: string
      description?: string
      type: string
      enabled?: boolean
    }[]
  }
}

function SettingsCategoryCard({ category }: SettingsCategoryCardProps) {
  return (
    <Card className="border-none shadow-md">
      <CardContent className="p-0">
        <div className="py-3 px-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
            <div className={`p-2 rounded-full mr-3 ${category.iconBg}`}>{category.icon}</div>
            {category.name}
          </h3>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {category.settings.map((setting, idx) => (
            <SettingItem key={idx} setting={setting} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface SettingItemProps {
  setting: {
    name: string
    description?: string
    type: string
    enabled?: boolean
  }
}

function SettingItem({ setting }: SettingItemProps) {
  return (
    <div className="py-3 px-4 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{setting.name}</p>
        {setting.description && <p className="text-xs text-gray-500 dark:text-gray-400">{setting.description}</p>}
      </div>
      {setting.type === "toggle" ? (
        <div
          className={`w-11 h-6 rounded-full p-1 ${setting.enabled ? "bg-purple-500" : "bg-gray-300 dark:bg-gray-700"}`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
              setting.enabled ? "translate-x-5" : ""
            }`}
          ></div>
        </div>
      ) : (
        <ChevronRight className="h-5 w-5 text-gray-400" />
      )}
    </div>
  )
}
