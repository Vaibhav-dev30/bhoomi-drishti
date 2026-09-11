"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useApp } from "@/context/app-context";

const PUBLIC_ROUTES = ["/", "/login", "/signup", "/public"];

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser } = useApp();
  const [mounted, setMounted] = useState(false);

  const isPublicPage = PUBLIC_ROUTES.includes(pathname);
  const isMapPage = pathname === "/map";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isPublicPage && currentUser === null) {
      router.push("/login");
    }
  }, [mounted, isPublicPage, currentUser, router]);

  if (isPublicPage) {
    return <>{children}</>;
  }

  if (!mounted || !currentUser) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#FAF8F5]" suppressHydrationWarning>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#15803D] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-500">Checking authorization...</span>
        </div>
      </div>
    );
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
