import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
    id: z.string(),
    hostNames: z.string().optional(),
    hostPhone: z.string().optional(),
    notes: z.string().optional(),
    clearRequest: z.boolean().optional(),
});

// Admin check helper
const isAdmin = (session: any) => session?.user?.role === "ADMIN";

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!isAdmin(session)) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    try {
        const body = await req.json();
        const { id, hostNames, hostPhone, notes, clearRequest } = updateSchema.parse(body);

        // Admin can update host names, phone, notes, and clear the edit request
        await prisma.reservation.update({
            where: { id },
            data: {
                hostNames: hostNames || undefined,
                hostPhone: hostPhone || undefined,
                notes: notes || undefined,
                editRequest: clearRequest ? null : undefined,
            } as any
        });

        return NextResponse.json({ message: "Updated" });
    } catch (e) {
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!isAdmin(session)) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ message: "Missing ID" }, { status: 400 });

    try {
        await prisma.reservation.delete({ where: { id } });
        return NextResponse.json({ message: "Deleted" });
    } catch (e) {
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}
