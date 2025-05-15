"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

function isValidToastType(type: any): type is "foreground" | "background" {
  return type === "foreground" || type === "background";
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, type, action, ...props }) {
        const toastType = type === "default" ? "foreground" : type;
        const toastTypeProp = isValidToastType(toastType) ? { type: toastType } : {};
        return (
          <Toast key={id} {...props} type={isValidToastType(toastType) ? toastType : undefined}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
