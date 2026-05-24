"use server";

import { createClient } from "@/utils/supabase/server";

export async function saveProfile(name: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("profiles")
    .upsert({ id: user.id, full_name: name }, { onConflict: "id" });

  if (error) return { error: error.message };
  return { success: true };
}

export async function addVehicle(makeModel: string, colorPlate: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  if (!user) return { error: "Not authenticated", data: null };

  const { data, error } = await supabase
    .from("vehicles")
    .insert([{ user_id: user.id, make_model: makeModel, color_plate: colorPlate }])
    .select()
    .single();

  if (error) return { error: error.message, data: null };
  return { success: true, data };
}

export async function updateVehicle(id: string, makeModel: string, colorPlate: string) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("vehicles")
    .update({ make_model: makeModel, color_plate: colorPlate })
    .eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}

export async function uploadLicense(formData: FormData, side: "front" | "back") {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  if (!user) return { error: "Not authenticated", url: null };

  const file = formData.get("file") as File;
  if (!file) return { error: "No file", url: null };

  const ext = file.name.split(".").pop();
  const filePath = `${user.id}/${side}-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("licenses")
    .upload(filePath, file, { upsert: true });

  if (uploadError) return { error: uploadError.message, url: null };

  const { data: { publicUrl } } = supabase.storage.from("licenses").getPublicUrl(filePath);

  const col = side === "front" ? "front_url" : "back_url";
  await supabase
    .from("driver_licenses")
    .upsert({ user_id: user.id, [col]: publicUrl }, { onConflict: "user_id" });

  return { success: true, url: publicUrl };
}
