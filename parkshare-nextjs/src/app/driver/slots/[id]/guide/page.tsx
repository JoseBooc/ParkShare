"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin,
  Navigation,
  MessageCircle,
  ChevronLeft,
  CheckCircle,
  AlertTriangle,
  QrCode,
  Car,
  LogIn,
  LogOut,
  Star,
  Clock,
  ParkingCircle,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type Slot = {
  id: string;
  title: string;
  address: string | null;
  description: string | null;
  image_url: string | null;
  host_id: string | null;
};

type HostProfile = {
  id: string;
  full_name: string | null;
};

type CheckStatus = "pending" | "checked_in" | "checked_out" | "reviewed";

/* ── Davao City SVG Map ── */
function DavaoMap() {
  return (
    <svg
      viewBox="0 0 800 520"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="800" height="520" fill="#F2ECD8" />
      <path d="M610 0 L800 0 L800 520 L490 520 L460 490 L470 430 L490 360 L510 270 L540 180 L570 100 Z" fill="#C5DCE8" />
      <ellipse cx="75" cy="200" rx="85" ry="95" fill="#CDDEB8" opacity="0.75" />
      <ellipse cx="90" cy="350" rx="100" ry="75" fill="#CDDEB8" opacity="0.70" />
      <ellipse cx="140" cy="460" rx="130" ry="60" fill="#CDDEB8" opacity="0.65" />
      <ellipse cx="680" cy="170" rx="80" ry="90" fill="#CDDEB8" opacity="0.55" />
      <ellipse cx="720" cy="462" rx="78" ry="44" fill="#D8EBC0" />
      <circle cx="398" cy="242" r="22" fill="#B8DAA0" />
      <circle cx="398" cy="242" r="14" fill="#A8CC90" />
      <path d="M430 50 Q448 90 455 140 Q462 190 468 240 Q474 290 480 340" stroke="#C5DCE8" strokeWidth="10" fill="none" opacity="0.9" />
      <path d="M370 180 Q390 200 408 230 Q420 255 430 285" stroke="#C5DCE8" strokeWidth="6" fill="none" opacity="0.8" />
      <path d="M0 85 Q80 80 160 88 Q260 95 340 76 Q400 62 480 52 Q570 42 660 50 L800 56" stroke="#D4AA5A" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M160 88 Q168 160 172 240 Q176 320 182 400 Q186 450 192 520" stroke="#D4AA5A" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M0 490 Q80 474 180 466 Q300 456 400 468 Q465 476 520 484 L590 492" stroke="#D4AA5A" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M362 52 Q358 110 362 165 Q366 220 370 275 Q374 330 378 385 Q382 430 386 480" stroke="#D4AA5A" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M522 0 Q520 80 518 160 Q516 245 514 325 Q512 400 510 480 L508 520" stroke="#D4AA5A" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M570 100 Q565 185 558 265 Q551 345 544 425 L536 510" stroke="#D4AA5A" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M172 282 Q250 278 330 281 Q358 282 378 282" stroke="#D4AA5A" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M182 344 Q270 340 358 342 Q430 346 510 350" stroke="#D4AA5A" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M210 425 Q295 420 370 422 Q418 424 460 430" stroke="#D4AA5A" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M362 165 Q420 162 518 172" stroke="#D8B86A" strokeWidth="3" fill="none" />
      <path d="M366 225 Q420 222 516 230" stroke="#D8B86A" strokeWidth="3" fill="none" />
      <path d="M370 282 Q420 280 514 284" stroke="#D8B86A" strokeWidth="3" fill="none" />
      <path d="M374 344 Q420 342 510 346" stroke="#D8B86A" strokeWidth="3" fill="none" />
      <path d="M378 400 Q420 398 510 402" stroke="#D8B86A" strokeWidth="3" fill="none" />
      <path d="M430 88 Q432 135 436 180 Q440 225 444 272 Q448 320 453 368 Q457 408 462 452" stroke="#52C878" strokeWidth="13" fill="none" strokeLinecap="round" opacity="0.3" />
      <path d="M430 88 Q432 135 436 180 Q440 225 444 272 Q448 320 453 368 Q457 408 462 452" stroke="#27AE60" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M430 88 Q432 135 436 180 Q440 225 444 272 Q448 320 453 368 Q457 408 462 452" stroke="#5EE887" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.65" />
      <text x="490" y="32" textAnchor="middle" fill="#444" fontSize="13" fontWeight="800" fontFamily="Arial" letterSpacing="1.5">BUHANGIN</text>
      <text x="715" y="32" textAnchor="middle" fill="#555" fontSize="11" fontWeight="700" fontFamily="Arial">PANACAN</text>
      <text x="68" y="192" textAnchor="middle" fill="#666" fontSize="11" fontWeight="700" fontFamily="Arial">MA-A</text>
      <text x="490" y="152" textAnchor="middle" fill="#555" fontSize="11" fontWeight="700" fontFamily="Arial">BAJADA</text>
      <text x="660" y="155" textAnchor="middle" fill="#666" fontSize="11" fontWeight="700" fontFamily="Arial">CALINAN</text>
      <text x="340" y="228" textAnchor="middle" fill="#666" fontSize="11" fontWeight="700" fontFamily="Arial">POB.</text>
      <text x="580" y="232" textAnchor="middle" fill="#666" fontSize="11" fontWeight="700" fontFamily="Arial">AGDAO</text>
      <text x="100" y="318" textAnchor="middle" fill="#666" fontSize="9" fontWeight="700" fontFamily="Arial">CATALUNAN</text>
      <text x="100" y="330" textAnchor="middle" fill="#666" fontSize="9" fontWeight="700" fontFamily="Arial">GRANDE</text>
      <text x="285" y="312" textAnchor="middle" fill="#444" fontSize="13" fontWeight="800" fontFamily="Arial">DAVAO CITY</text>
      <text x="285" y="328" textAnchor="middle" fill="#444" fontSize="13" fontWeight="800" fontFamily="Arial">PROPER</text>
      <text x="490" y="398" textAnchor="middle" fill="#555" fontSize="11" fontWeight="700" fontFamily="Arial">MATINA</text>
      <text x="65" y="385" textAnchor="middle" fill="#666" fontSize="11" fontWeight="700" fontFamily="Arial">TORIL</text>
      <text x="78" y="482" textAnchor="middle" fill="#666" fontSize="11" fontWeight="700" fontFamily="Arial">TALOMO</text>
      <text x="660" y="350" textAnchor="middle" fill="#7AA8C2" fontSize="12" fontStyle="italic" fontFamily="Arial">DAVAO GULF</text>
      <text x="718" y="460" textAnchor="middle" fill="#888" fontSize="10" fontFamily="Arial">SAMAL ISLAND</text>
      <rect x="192" y="60" width="40" height="18" rx="3" fill="white" stroke="#AAA" strokeWidth="1" />
      <text x="212" y="73" textAnchor="middle" fill="#333" fontSize="9" fontWeight="800" fontFamily="Arial">AH26</text>
      <rect x="742" y="46" width="40" height="18" rx="3" fill="white" stroke="#AAA" strokeWidth="1" />
      <text x="762" y="59" textAnchor="middle" fill="#333" fontSize="9" fontWeight="800" fontFamily="Arial">AH26</text>
      <rect x="267" y="382" width="40" height="18" rx="3" fill="white" stroke="#AAA" strokeWidth="1" />
      <text x="287" y="395" textAnchor="middle" fill="#333" fontSize="9" fontWeight="800" fontFamily="Arial">AH26</text>
      <rect x="204" y="274" width="96" height="15" rx="3" fill="white" stroke="#CCC" strokeWidth="0.8" />
      <text x="252" y="285" textAnchor="middle" fill="#444" fontSize="7.5" fontWeight="700" fontFamily="Arial">R. CASTILLO ST.</text>
      <rect x="120" y="460" width="104" height="15" rx="3" fill="white" stroke="#CCC" strokeWidth="0.8" />
      <text x="172" y="471" textAnchor="middle" fill="#444" fontSize="7.5" fontWeight="700" fontFamily="Arial">JP LAUREL AVE.</text>
      <rect x="572" y="398" width="132" height="15" rx="3" fill="white" stroke="#CCC" strokeWidth="0.8" />
      <text x="638" y="409" textAnchor="middle" fill="#444" fontSize="7.5" fontWeight="700" fontFamily="Arial">DAVAO COASTAL ROAD</text>
      <text x="452" y="102" fill="#333" fontSize="9" fontWeight="800" fontStyle="italic" fontFamily="Arial">SM LANANG</text>
      <text x="452" y="113" fill="#333" fontSize="9" fontWeight="800" fontStyle="italic" fontFamily="Arial">PREMIER</text>
      <circle cx="430" cy="88" r="17" fill="#3B8DE0" stroke="white" strokeWidth="3.5" />
      <circle cx="430" cy="88" r="7" fill="white" />
      <ellipse cx="462" cy="458" rx="11" ry="4" fill="#00000018" />
      <path d="M462 456 C456 445, 447 434, 447 421 A15 15 0 0 1 477 421 C477 434, 468 445, 462 456 Z" fill="#E53935" stroke="white" strokeWidth="2.5" />
      <circle cx="462" cy="421" r="6" fill="white" opacity="0.92" />
    </svg>
  );
}

/* ── Elapsed time formatter ── */
function formatElapsed(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m.toString().padStart(2, "0")}m`;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

/* ── Star rating component ── */
function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={32}
            className={
              n <= (hovered || value)
                ? "text-amber-400 fill-amber-400"
                : "text-slate-300"
            }
          />
        </button>
      ))}
    </div>
  );
}

export default function LocationGuidePage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [slot, setSlot] = useState<Slot | null>(null);
  const [host, setHost] = useState<HostProfile | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* Check-in / Check-out state */
  const [checkStatus, setCheckStatus] = useState<CheckStatus>("pending");
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Review state */
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewDone, setReviewDone] = useState(false);

  /* ── Load slot, host, booking ── */
  useEffect(() => {
    if (!id) return;
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      const { data: slotData } = await supabase
        .from("parking_slots")
        .select("id, title, address, description, image_url, host_id")
        .eq("id", id)
        .single();

      if (!slotData) { router.push("/driver"); return; }
      setSlot(slotData);

      if (slotData.host_id) {
        const { data: hostData } = await supabase
          .from("profiles")
          .select("id, full_name")
          .eq("id", slotData.host_id)
          .single();
        if (hostData) setHost(hostData);
      }

      if (user) {
        const { data: bookingData } = await supabase
          .from("bookings")
          .select("id, status")
          .eq("slot_id", id)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();
        if (bookingData) {
          setBookingId(bookingData.id);
          if (bookingData.status === "checked_in") setCheckStatus("checked_in");
          if (bookingData.status === "completed") setCheckStatus("checked_out");
        }
      }

      setLoading(false);
    }
    load();
  }, [id, router]);

  /* ── Timer ── */
  useEffect(() => {
    if (checkStatus === "checked_in") {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [checkStatus]);

  /* ── Check In ── */
  async function handleCheckIn() {
    setCheckStatus("checked_in");
    setElapsed(0);
    if (bookingId) {
      const supabase = createClient();
      await supabase.from("bookings").update({ status: "checked_in" }).eq("id", bookingId);
    }
  }

  /* ── Check Out ── */
  async function handleCheckOut() {
    setCheckStatus("checked_out");
    if (bookingId) {
      const supabase = createClient();
      await supabase.from("bookings").update({ status: "completed" }).eq("id", bookingId);
    }
  }

  /* ── Submit Review ── */
  async function handleSubmitReview() {
    if (rating === 0) return;
    setSubmittingReview(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user && slot) {
        await supabase.from("reviews").insert({
          user_id: user.id,
          slot_id: slot.id,
          host_id: slot.host_id,
          booking_id: bookingId,
          rating,
          comment: reviewText.trim() || null,
        });
      }
    } catch {}
    setSubmittingReview(false);
    setReviewDone(true);
    setCheckStatus("reviewed");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="animate-pulse text-sm text-slate-400">Loading guide…</p>
      </div>
    );
  }

  if (!slot) return null;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(slot.address || slot.title)}`;

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      {/* Success Banner */}
      <div className="bg-emerald-500 px-4 py-4 text-center text-white shadow-md">
        <p className="text-base font-bold">🎉 Booking Confirmed! Your space is reserved.</p>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Back */}
        <button
          onClick={() => router.push("/driver")}
          className="mb-6 flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-park-navy"
        >
          <ChevronLeft size={16} />
          Back to Dashboard
        </button>

        {/* Title */}
        <div className="mb-6">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-park-teal">
            Location &amp; Check-In Guide
          </p>
          <h1 className="text-2xl font-black text-park-navy sm:text-3xl">{slot.title}</h1>
        </div>

        {/* Map + Address Card */}
        <div className="mb-4 overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="relative h-56 w-full sm:h-64">
            <DavaoMap />
          </div>
          <div className="flex items-center justify-between p-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-park-teal/10">
                <MapPin size={16} className="text-park-teal" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Address</p>
                <p className="mt-0.5 text-sm font-semibold leading-snug text-slate-800">
                  {slot.address || "See host notes for directions"}
                </p>
              </div>
            </div>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 flex shrink-0 items-center gap-2 rounded-full bg-park-teal px-4 py-2.5 text-xs font-bold text-white transition hover:bg-park-teal/90"
            >
              <Navigation size={13} />
              Open in Google Maps
            </a>
          </div>
        </div>

        {/* ── CHECK IN / CHECK OUT CARD ── */}
        <div className="mb-4 overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <div className="flex items-center gap-2">
              <ParkingCircle size={20} className="text-park-teal" />
              <h2 className="text-base font-bold text-park-navy">Parking Status</h2>
            </div>
          </div>

          <div className="px-6 py-5">
            {/* Status pill */}
            <div className="mb-5 flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                  checkStatus === "pending"
                    ? "bg-amber-50 text-amber-600"
                    : checkStatus === "checked_in"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    checkStatus === "pending"
                      ? "bg-amber-400"
                      : checkStatus === "checked_in"
                      ? "animate-pulse bg-emerald-500"
                      : "bg-slate-400"
                  }`}
                />
                {checkStatus === "pending" && "Arrived · Not Yet Checked In"}
                {checkStatus === "checked_in" && "Currently Parked"}
                {(checkStatus === "checked_out" || checkStatus === "reviewed") && "Session Completed"}
              </span>

              {checkStatus === "checked_in" && (
                <span className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                  <Clock size={15} className="text-slate-400" />
                  {formatElapsed(elapsed)}
                </span>
              )}
            </div>

            {/* Action button */}
            {checkStatus === "pending" && (
              <button
                onClick={handleCheckIn}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-600 active:scale-[0.98]"
              >
                <LogIn size={18} />
                Check In — I&apos;ve Arrived
              </button>
            )}

            {checkStatus === "checked_in" && (
              <button
                onClick={handleCheckOut}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-red-600 active:scale-[0.98]"
              >
                <LogOut size={18} />
                Check Out — Done Parking
              </button>
            )}

            {(checkStatus === "checked_out" || checkStatus === "reviewed") && (
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                <CheckCircle size={20} className="text-emerald-500" />
                <p className="text-sm font-semibold text-slate-700">
                  You have successfully checked out. Thank you for using ParkShare!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── REVIEW CARD (shown after checkout) ── */}
        {(checkStatus === "checked_out" || checkStatus === "reviewed") && (
          <div className="mb-4 overflow-hidden rounded-3xl bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <Star size={20} className="text-amber-400" />
                <h2 className="text-base font-bold text-park-navy">Rate Your Experience</h2>
              </div>
            </div>

            {reviewDone ? (
              <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
                  <Star size={28} className="fill-amber-400 text-amber-400" />
                </div>
                <p className="text-base font-bold text-park-navy">Thanks for your review!</p>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      size={20}
                      className={n <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                    />
                  ))}
                </div>
                {reviewText && (
                  <p className="text-sm text-slate-500 italic">&ldquo;{reviewText}&rdquo;</p>
                )}
              </div>
            ) : (
              <div className="px-6 py-5 space-y-5">
                <div>
                  <p className="mb-3 text-sm text-slate-500">
                    How was your parking experience at{" "}
                    <span className="font-semibold text-slate-700">{slot.title}</span>?
                  </p>
                  <StarRating value={rating} onChange={setRating} />
                </div>

                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience (optional)…"
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-park-teal focus:ring-2 focus:ring-park-teal/20 transition"
                />

                <button
                  onClick={handleSubmitReview}
                  disabled={rating === 0 || submittingReview}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-park-navy py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-park-navy/90 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  <Star size={16} />
                  {submittingReview ? "Submitting…" : "Submit Review"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Gate Entry Instructions */}
        <div className="mb-4 rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <QrCode size={20} className="text-park-teal" />
            <h2 className="text-base font-bold text-park-navy">Gate Entry Instructions</h2>
          </div>
          <ol className="space-y-4">
            {[
              { icon: <Car size={16} />, text: "Approach the designated entrance gate of the parking facility." },
              { icon: <QrCode size={16} />, text: "Present your ParkShare Digital Pass (booking confirmation) to the guard or scanner." },
              { icon: <MapPin size={16} />, text: "Proceed to your assigned parking slot as indicated in the booking details." },
              { icon: <CheckCircle size={16} />, text: "Park your vehicle and ensure your hazard lights are on while navigating any ramp." },
            ].map(({ icon, text }, i) => (
              <li key={i} className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-park-teal/10 text-park-teal">
                  {icon}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Step {i + 1}</p>
                  <p className="mt-0.5 text-sm text-slate-700">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Host Notes */}
        <div className="mb-4 rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle size={20} className="text-amber-500" />
            <h2 className="text-base font-bold text-park-navy">Host Notes &amp; Rules</h2>
          </div>
          <ul className="space-y-3">
            {[
              "Maximum vehicle height clearance: 2.1 m",
              "Keep hazard lights on while navigating ramps",
              "No overnight parking unless specifically booked",
              "Report any issues to the host immediately via ParkShare messaging",
              slot.description || "Follow all posted signs inside the facility",
            ].map((rule, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-park-teal" />
                <p className="text-sm text-slate-600">{rule}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Host */}
        <div className="rounded-3xl bg-park-navy p-6 text-white shadow-sm">
          <h2 className="mb-1 text-base font-bold">Need help?</h2>
          <p className="mb-4 text-sm text-white/70">
            {host?.full_name ? `Contact ${host.full_name} directly` : "Contact your host"} for any questions about access or parking.
          </p>
          <button
            onClick={() => router.push("/driver/messages")}
            className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-park-navy transition hover:bg-white/90"
          >
            <MessageCircle size={16} />
            Message Host
          </button>
        </div>
      </div>
    </div>
  );
}
