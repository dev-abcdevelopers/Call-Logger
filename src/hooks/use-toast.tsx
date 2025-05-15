"use client"

import { useState } from "react"
import type * as React from "react"

type ToastType = "default" | "success" | "error" | "warning" | "info"

interface Toast {
  id: string
  title: string
  description?: string
  type: ToastType
  duration?: number
  action?: React.ReactNode
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { ...toast, id }])
    return id
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const updateToast = (id: string, toast: Partial<Omit<Toast, "id">>) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, ...toast } : t)))
  }

  return {
    toasts,
    addToast,
    removeToast,
    updateToast,
  }
}
