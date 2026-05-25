import DriverNavbar from "@/components/driver/DriverNavbar";

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-park-bg">
      <DriverNavbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
