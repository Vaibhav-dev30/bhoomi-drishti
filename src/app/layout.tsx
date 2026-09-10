import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { AppProvider } from "@/context/app-context";
import { LayoutShell } from "@/components/layout/layout-shell";

export const metadata: Metadata = {
  title: "BhoomiDrishti — National Land Acquisition & Management System | भूमि दृष्टि",
  description:
    "End-to-End Digital Monitoring, RFCTLARR Act 2013 Statutory Compliance, GIS Spatial Visualizer, and Decision Support Platform.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="min-h-full flex flex-col bg-[#070d1e] text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950">
        <AppProvider>
          <LayoutShell>{children}</LayoutShell>
        </AppProvider>
      </body>
    </html>
  );
}
