"use client";

import React, { ReactNode } from "react";

interface MainContentAreaProps {
  children: ReactNode;
}

export function MainContentArea({ children }: MainContentAreaProps) {
  return (
    <main className="flex-1 overflow-y-auto bg-white">
      <div className="max-w-6xl mx-auto p-8 space-y-8">{children}</div>
    </main>
  );
}
