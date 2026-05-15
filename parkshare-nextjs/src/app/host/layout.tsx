import HostSidebar from "@/components/host/HostSidebar";

export default function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#f7fafc]">
      <HostSidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}