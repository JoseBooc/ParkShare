import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#F7F9FC] overflow-hidden">
      {/* NAVBAR */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Image
            src="/logo.png"
            alt="ParkShare"
            width={150}
            height={40}
            className="h-auto w-[140px]"
            priority
          />

          <Link
            href="/auth/login"
            className="rounded-full bg-[#071120] px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:scale-105"
          >
            Log In
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 py-10 lg:grid-cols-2">
        {/* LEFT */}
        <div>
          <div className="mb-5 inline-flex rounded-full bg-[#E8F9FD] px-4 py-2 text-xs font-bold text-[#18C3E6]">
            Smart Parking Platform
          </div>

          <h1 className="max-w-[520px] text-5xl font-black leading-[1.05] text-[#071120] md:text-6xl">
            Reserve parking before you arrive.
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600">
            ParkShare helps drivers find secure parking spaces instantly while
            allowing hosts to earn from unused parking spots.
          </p>

          <div className="mt-8">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center rounded-2xl bg-[#18C3E6] px-8 py-4 text-base font-black text-white shadow-lg transition hover:bg-[#12afd0]"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* RIGHT */}
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl">
          <div className="mb-6">
            <div className="inline-flex rounded-full bg-[#E8F9FD] px-4 py-2 text-xs font-bold text-[#18C3E6]">
              How It Works
            </div>

            <h2 className="mt-4 text-3xl font-black text-[#071120]">
              Parking made simple.
            </h2>

            <p className="mt-2 text-base text-slate-500">
              Find, reserve, and park in just a few taps.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                step: "1",
                title: "Search Nearby Parking",
                text: "Browse available parking spaces around your destination.",
              },
              {
                step: "2",
                title: "Reserve Instantly",
                text: "Secure your parking slot before arriving.",
              },
              {
                step: "3",
                title: "Park With Confidence",
                text: "Get verified parking with secure and trusted hosts.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#18C3E6] text-lg font-black text-white">
                  {item.step}
                </div>

                <div>
                  <h3 className="text-lg font-black text-[#071120]">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-sm leading-relaxed text-slate-500">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}