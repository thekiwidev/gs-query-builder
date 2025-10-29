"use client";

import React, { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { usePathname } from "next/navigation";

interface LayoutWrapperProps {
  children: ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  // Hide header/footer on home page (which uses QueryBuilder)
  const isHomePage = pathname === "/";

  return (
    <>
      {!isHomePage && <Header />}
      <main>{children}</main>
      {!isHomePage && <Footer />}
    </>
  );
}
