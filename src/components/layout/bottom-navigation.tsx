"use client"

import type React from "react"
import { Phone, Users, Clock, Settings } from "lucide-react"

interface BottomNavigationProps {
  activeTab: string
  animateTab: string
  handleTabChange: (tab: string) => void
}

export default function BottomNavigation({ activeTab, animateTab, handleTabChange }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] p-2 z-50 border-t border-gray-100 dark:border-gray-800 nav-height">
      <div className="flex justify-around max-w-lg mx-auto">
        <NavButton
          icon={<Phone className="h-5 w-5" />}
          label="Calls"
          isActive={activeTab === "calls"}
          isAnimating={animateTab === "calls"}
          onClick={() => handleTabChange("calls")}
        />
        <NavButton
          icon={<Users className="h-5 w-5" />}
          label="Contacts"
          isActive={activeTab === "contacts"}
          isAnimating={animateTab === "contacts"}
          onClick={() => handleTabChange("contacts")}
        />
        <NavButton
          icon={<Clock className="h-5 w-5" />}
          label="History"
          isActive={activeTab === "history"}
          isAnimating={animateTab === "history"}
          onClick={() => handleTabChange("history")}
        />
        <NavButton
          icon={<Settings className="h-5 w-5" />}
          label="Settings"
          isActive={activeTab === "settings"}
          isAnimating={animateTab === "settings"}
          onClick={() => handleTabChange("settings")}
        />
      </div>
    </div>
  )
}

interface NavButtonProps {
  icon: React.ReactNode
  label: string
  isActive: boolean
  isAnimating: boolean
  onClick: () => void
}

// Completely revised button to ensure text is visible
function NavButton({ icon, label, isActive, isAnimating, onClick }: NavButtonProps) {
  return (
    <button
      className={`flex flex-col items-center justify-center rounded-lg px-2 sm:px-4 py-2 transition-all ${
        isActive
          ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
      } ${isAnimating ? "animate-bounce-small" : ""}`}
      onClick={onClick}
    >
      <div className={`transition-transform ${isAnimating ? "scale-110" : ""}`}>{icon}</div>
      <div className="text-xs mt-1 font-medium">{label}</div>
    </button>
  )
}
