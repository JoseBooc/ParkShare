import HostSidebar from "@/components/host/HostSidebar";

export default function HostLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-park-bg">
      <HostSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
