"use client";

import { useState } from "react";
import { addDays, format } from "date-fns";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { User, Reservation } from "@prisma/client";
import ReservationModal from "./ReservationModal";
import AdminControls from "./AdminControls";
import RequestEditModal from "./RequestEditModal";
import { AlertCircle } from "lucide-react";
import AdminSettings from "./AdminSettings"; // Assuming this new component is in the same directory

// START_DATE is now dynamic, passed as prop or fetched.
// For simplicity in this Server Component architecture (page.tsx fetches), we'll accept it as prop.

type CalendarProps = {
    reservations: (Reservation & { user: User })[];
    startDate: string; // ISO string
};

export default function Calendar({ reservations, startDate }: CalendarProps) {
    const { data: session } = useSession();
    const router = useRouter();

    const ramadanStart = new Date(startDate);
    // Generate 30 days based on the dynamic start date
    const days = Array.from({ length: 30 }, (_, i) => addDays(ramadanStart, i));

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [reservationToEdit, setReservationToEdit] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

    const isAdmin = (session?.user as any)?.role === 'ADMIN';

    const handleDayClick = (date: Date, reservation: Reservation & { user: User } | undefined) => {
        // ... same logic ...
        if (reservation) {
            // If user is owner OR admin, maybe show details or edit options?
            // Admin edits directly via the card controls.
            // Owner can request edit.
            const isOwner = (session?.user as any)?.id === reservation.userId;
            if (isOwner && !isAdmin) {
                setReservationToEdit(reservation.id);
                setIsRequestModalOpen(true);
            }
            return;
        }

        if (!session) {
            if (confirm("You need to login to reserve a day. Go to login?")) {
                router.push("/login");
            }
            return;
        }

        setSelectedDate(date);
        setIsModalOpen(true);
    };

    const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    // Calculate offest: getDay() returns 0 for Sun, 1 for Mon...
    // We want Mon=0, ... Sun=6
    const startDayIndex = (ramadanStart.getDay() + 6) % 7;
    const paddingDays = Array.from({ length: startDayIndex });

    return (
        <>
            {isAdmin && <AdminSettings currentStartDate={startDate} />}

            <div className="w-full max-w-7xl mx-auto">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-4 mb-4 text-center">
                    {WEEKDAYS.map(day => (
                        <div key={day} className="font-bold text-muted-foreground uppercase tracking-wider text-sm">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                    {/* Padding for empty days at start of month (Desktop only usually, but good for grid alignment) */}
                    {paddingDays.map((_, i) => (
                        <div key={`padding-${i}`} className="hidden md:block h-full bg-white/5 rounded-lg border border-transparent" />
                    ))}

                    {days.map((date, index) => {
                        const dateStr = format(date, "yyyy-MM-dd");
                        const reservation = reservations.find(r =>
                            format(new Date(r.date), "yyyy-MM-dd") === dateStr
                        );

                        // Calculate Islamic Date: simple index + 1 since start date is Ramadan 1st
                        const islamicDay = index + 1;

                        return (
                            <div key={dateStr} onClick={() => handleDayClick(date, reservation)}>
                                <DayCard date={date} islamicDay={islamicDay} reservation={reservation} isAdmin={isAdmin} />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modals ... */}
            {selectedDate && (
                <ReservationModal
                    date={selectedDate}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

            {reservationToEdit && (
                <RequestEditModal
                    reservationId={reservationToEdit}
                    isOpen={isRequestModalOpen}
                    onClose={() => setIsRequestModalOpen(false)}
                />
            )}
        </>
    );
}

function DayCard({ date, islamicDay, reservation, isAdmin }: { date: Date; islamicDay: number; reservation?: any, isAdmin: boolean }) {
    const isReserved = !!reservation;

    return (
        <Card className={cn(
            "h-auto min-h-[12rem] transition-all duration-200 border-2 relative overflow-hidden group flex flex-col justify-between",
            isReserved ? "bg-white/80 border-primary/20 cursor-default" : "bg-white/40 hover:bg-white/60 hover:shadow-lg hover:border-primary/50 cursor-pointer"
        )}>
            {/* Decorative background element */}
            {!isReserved && (
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
            )}

            {/* Admin indicator */}
            {isAdmin && reservation?.editRequest && (
                <div className="absolute top-2 right-2 text-orange-500 animate-pulse" title="Edit Requested">
                    <AlertCircle className="w-5 h-5" />
                </div>
            )}

            <CardHeader className="p-4 pb-2 relative z-10">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{format(date, "EEE")}</span>
                        <span className={cn("text-3xl font-bold font-mono", isReserved ? "text-primary/80" : "text-primary")}>{format(date, "d")}</span>
                        {/* Islamic Date Display */}
                        <span className="text-xs font-serif italic text-primary/70 mt-1">Ramadan {islamicDay}</span>
                    </div>
                    <span className="text-xs font-bold text-muted-foreground/30">{format(date, "MMM")}</span>
                </div>
            </CardHeader>

            {/* Rest of CardContent same as before... */}
            <CardContent className="p-4 pt-0 relative z-10 flex-1 flex flex-col justify-end">
                {isReserved ? (
                    <div className="flex flex-col gap-2 animate-in fade-in duration-300">
                        {/* Main Hosts Display */}
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold tracking-widest text-primary/60 uppercase">Hosts</span>
                            {/* Reduced font size and removed line clamp to show full names */}
                            <span className="font-bold text-sm leading-tight text-foreground break-words">
                                {reservation.hostNames || reservation.user.name}
                            </span>
                        </div>

                        {/* Added By & Phone */}
                        <div className="flex flex-col gap-0.5 text-xs text-muted-foreground border-t border-primary/5 pt-1">
                            <div className="flex items-center gap-1">
                                <span>Added By:</span>
                                <span className="font-medium">{reservation.user.name}</span>
                            </div>
                            {reservation.user.phone && (
                                <div className="flex items-center gap-1">
                                    <span className="opacity-70">Ph:</span>
                                    <span className="font-mono">{reservation.user.phone}</span>
                                </div>
                            )}
                        </div>

                        {isAdmin && <AdminControls reservation={reservation} />}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-lg font-bold">
                            +
                        </div>
                        <span className="text-xs font-medium text-primary/70">
                            Reserve
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
