import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

export default async function DriverProfilePage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) redirect("/");

  const [profileRes, bookingsRes, vehiclesRes, licenseRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("vehicles").select("*").eq("user_id", user.id),
    supabase.from("driver_licenses").select("*").eq("user_id", user.id).single(),
  ]);

  let profileData = profileRes.data;
  if (!profileData) {
    const fallbackName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      null;
    const { data: created } = await supabase
      .from("profiles")
      .upsert({ id: user.id, full_name: fallbackName, role: "driver" }, { onConflict: "id" })
      .select()
      .single();
    profileData = created;
  }

  return (
    <ProfileClient
      initialProfile={profileData}
      bookingsCount={bookingsRes.count ?? 0}
      initialVehicles={vehiclesRes.data ?? []}
      initialLicense={licenseRes.data}
    />
  );
}
