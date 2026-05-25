import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ParkShare",
  description: "ParkShare",
  icons: {
    icon: "/ParkShare.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="bg-slate-900">
        <div className="relative mx-auto min-h-screen w-full max-w-[430px] overflow-x-hidden bg-white shadow-[0_0_80px_rgba(0,0,0,0.55)]">
          {children}
        </div>
      </body>
    </html>
  );
}