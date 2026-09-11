"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const AUTH_ROUTES = ["/", "/login", "/signup"];

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_ROUTES.includes(pathname);
  const isMapPage = pathname === "/map";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen w-full bg-[#FAF8F5]">
      {/* Fixed-width anchor rail for the hover-expanding sidebar (prevents content shifting/map resize) */}
      <div className="w-16 shrink-0 hidden md:block" />
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <Header />
        <main
          className={
            isMapPage
              ? "flex-1 overflow-y-auto p-2 sm:p-3 flex flex-col"
              : "flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
          }
        >
          {children}
        </main>
        {!isMapPage && <Footer />}
      </div>
    </div>
  );
}
