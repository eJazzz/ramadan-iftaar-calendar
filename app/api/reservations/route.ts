import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const reservationSchema = z.object({
    date: z.string().datetime(), // Expect ISO string
    coHosts: z.string().optional(),
    notes: z.string().optional(),
});

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { date, coHosts, notes } = reservationSchema.parse(body);

        // Check if date is already reserved
        const existing = await prisma.reservation.findUnique({
            where: { date: new Date(date) },
        });

        if (existing) {
            return NextResponse.json({ message: "Date already reserved" }, { status: 409 });
        }

        const reservation = await prisma.reservation.create({
            data: {
                date: new Date(date),
                userId: (session.user as any).id,
                coHosts,
                notes,
            },
        });

        return NextResponse.json(reservation, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error creating reservation" }, { status: 500 });
    }
}
