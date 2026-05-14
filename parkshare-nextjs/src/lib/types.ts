export type VehicleType = "Sedan" | "SUV" | "Pickup Truck" | "Motorcycle" | "Van" | "PUV";
export type Amenity = "CCTV" | "EV Charging" | "Sheltered" | "Security Guard" | "24/7 Access";
export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export interface DayAvailability {
  day: DayOfWeek;
  open: boolean;
  from: string;
  to: string;
}

export interface ParkingSlot {
  id: string;
  name: string;
  address: string;
  city: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  amenities: Amenity[];
  vehicleTypes: VehicleType[];
  images: string[];
  availability: DayAvailability[];
  hostId: string;
  hostName: string;
  hostSince: number;
  hostBookings: number;
  isRecommended: boolean;
  totalBookings: number;
  totalEarned: number;
}

export interface Review {
  id: string;
  slotId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Booking {
  id: string;
  slotId: string;
  slotName: string;
  slotAddress: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  pricePerHour: number;
  serviceFee: number;
  total: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

export interface Notification {
  id: string;
  type: "booking" | "review" | "message" | "system";
  title: string;
  message: string;
  read: boolean;
  date: string;
  link?: string;
}

export interface CalendarEvent {
  id: string;
  slotId: string;
  slotName: string;
  driverName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "confirmed" | "pending" | "cancelled";
}

export interface Message {
  id: string;
  fromId: string;
  fromName: string;
  preview: string;
  date: string;
  read: boolean;
  slotName?: string;
}
