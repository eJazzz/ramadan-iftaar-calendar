import Calendar from "@/components/Calendar";
import { prisma } from "@/lib/prisma";
import InfoSidebar from "@/components/InfoSidebar";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const reservations = await prisma.reservation.findMany({
    include: { user: true },
  });

  // Fetch Global Settings
  let ramadanStart = "2026-02-18T00:00:00.000Z"; // Default
  try {
    const setting = await (prisma as any).globalSettings.findUnique({
      where: { key: "ramadanStart" }
    });
    if (setting) ramadanStart = setting.value;
  } catch (e) {
    console.error("Failed to fetch settings", e);
  }

  // Serialize dates for Client Component
  const serializedReservations = reservations.map(r => ({
    ...r,
    date: r.date.toISOString(),
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    user: {
      ...r.user,
      createdAt: r.user.createdAt.toISOString(),
      updatedAt: r.user.updatedAt.toISOString(),
    }
  }));

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-primary drop-shadow-sm">
          Ramadan Iftaar Calendar
        </h1>
        <p className="text-lg text-muted-foreground max-w-[700px]">
          Join us for community Iftaar. Reserve a date to host or coordinate with others.
          May Allah accept our fasting and prayers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 bg-white/40 backdrop-blur-sm p-6 rounded-xl border border-white/50 shadow-xl">
          {/* @ts-ignore -- Casting issues with exact Date vs String types, handled in component logic */}
          <Calendar reservations={serializedReservations as any} startDate={ramadanStart} />
        </div>
        <div className="lg:col-span-1">
          <InfoSidebar />
        </div>
      </div>
    </main>
  );
}
