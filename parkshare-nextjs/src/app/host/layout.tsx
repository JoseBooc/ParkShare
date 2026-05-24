"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import HostSidebar from "@/components/host/HostSidebar";

export default function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const role = profile?.role ?? user.user_metadata?.role;

      if (role !== "host") {
        alert(
          "Access Denied: Your account does not have host privileges. Redirecting you to the driver portal."
        );
        router.replace("/driver");
        return;
      }

      setAuthorized(true);
    }

    checkAuth();
  }, [router]);

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7fafc]">
        <p className="text-sm font-semibold text-gray-400">
          Checking access…
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f7fafc]">
      <HostSidebar />
      <div className="flex-1 pb-16 md:pb-0">{children}</div>
    </div>
  );
}
