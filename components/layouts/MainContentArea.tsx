"use client";

import React, { ReactNode } from "react";

interface MainContentAreaProps {
  children: ReactNode;
}

export function MainContentArea({ children }: MainContentAreaProps) {
  return <main className="p-8 space-y-8 bg-white">{children}</main>;
}
