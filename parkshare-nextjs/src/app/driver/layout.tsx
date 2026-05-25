import DriverNavbar from "@/components/driver/DriverNavbar";

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-park-bg">
      <DriverNavbar />
      <main>{children}</main>
    </div>
  );
}
