"use client";

import { ReactNode, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { browserQueryClient } from "@/libs/browser-client";
import { ToastProvider } from "@/components/ui/toast";

export default function ClientProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => browserQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        {children}
      </ToastProvider>
    </QueryClientProvider>
  );
}
