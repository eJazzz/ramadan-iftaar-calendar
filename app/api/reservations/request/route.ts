import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const requestSchema = z.object({
    reservationId: z.string(),
    reason: z.string().min(1),
});

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { reservationId, reason } = requestSchema.parse(body);

        const reservation = await prisma.reservation.findUnique({
            where: { id: reservationId },
        }) as any;

        if (!reservation) return NextResponse.json({ message: "Not found" }, { status: 404 });

        if (reservation.userId !== (session.user as any).id) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        await prisma.reservation.update({
            where: { id: reservationId },
            data: { editRequest: reason } as any,
        });

        return NextResponse.json({ message: "Request submitted" });
    } catch (error) {
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}
