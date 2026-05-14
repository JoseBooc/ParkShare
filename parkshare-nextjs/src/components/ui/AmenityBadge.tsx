import { Camera, Zap, Umbrella, Shield, Clock } from "lucide-react";
import type { Amenity } from "@/lib/types";

const AMENITY_CONFIG: Record<Amenity, { icon: React.ElementType; label: string }> = {
  CCTV: { icon: Camera, label: "CCTV" },
  "EV Charging": { icon: Zap, label: "EV Charging" },
  Sheltered: { icon: Umbrella, label: "Sheltered" },
  "Security Guard": { icon: Shield, label: "Security Guard" },
  "24/7 Access": { icon: Clock, label: "24/7 Access" },
};

interface AmenityBadgeProps {
  amenity: Amenity;
  size?: "sm" | "md";
}

export default function AmenityBadge({ amenity, size = "md" }: AmenityBadgeProps) {
  const { icon: Icon, label } = AMENITY_CONFIG[amenity];
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5 gap-1" : "text-sm px-3 py-1 gap-1.5";
  return (
    <span
      className={`inline-flex items-center rounded-full bg-park-teal-light text-park-teal font-medium ${sizeClass}`}
    >
      <Icon size={size === "sm" ? 12 : 14} />
      {label}
    </span>
  );
}
