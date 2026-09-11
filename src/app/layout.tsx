import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { AppProvider } from "@/context/app-context";
import { LayoutShell } from "@/components/layout/layout-shell";
import { JudgeScenarioBar } from "@/components/demo/judge-scenario-bar";

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
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-slate-900 antialiased selection:bg-[#0284C7] selection:text-white">
        <AppProvider>
          <LayoutShell>{children}</LayoutShell>
          <JudgeScenarioBar />
        </AppProvider>
      </body>
    </html>
  );
}
