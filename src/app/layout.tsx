import type { Metadata } from "next";
import "./globals.css";
import SidebarShell from "@/components/SidebarShell";

export const metadata: Metadata = {
  title: "신규매장 지도 (MVP)",
  description: "최근 90일 내 신규 매장만 모아보는 지도 앱 MVP",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <SidebarShell>{children}</SidebarShell>
      </body>
    </html>
  );
}
