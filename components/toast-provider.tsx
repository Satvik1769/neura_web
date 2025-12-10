"use client";

import { Toaster } from "sonner";

/**
 * Toast provider component
 * Wrap your app with this to enable toast notifications
 * Place it in your root layout
 */
export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      theme="dark"
      expand={true}
    />
  );
}
