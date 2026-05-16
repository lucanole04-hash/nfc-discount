"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#111827",
          color: "#fff",
          borderRadius: "12px",
          fontSize: "14px",
          padding: "12px 16px",
        },
        success: {
          iconTheme: { primary: "#10b981", secondary: "#fff" },
        },
        error: {
          iconTheme: { primary: "#ef4444", secondary: "#fff" },
        },
      }}
    />
  );
}
