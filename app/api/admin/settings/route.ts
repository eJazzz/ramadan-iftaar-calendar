import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const settingsSchema = z.object({
    key: z.string(),
    value: z.string(),
});

export async function GET(req: Request) {
    // Public read access for the Date, or restricted? 
    // Calendar checks it, so needs to be public-ish or at least checking user session not strictly admin for READ.
    // However, let's keep it simple: Public read for 'ramadanStart' is fine as it dictates the whole calendar structure.

    const settings = await (prisma as any).globalSettings.findUnique({
        where: { key: "ramadanStart" }
    });

    return NextResponse.json(settings || { key: "ramadanStart", value: "2026-02-18T00:00:00.000Z" });
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.role !== "ADMIN") {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    try {
        const body = await req.json();
        const { key, value } = settingsSchema.parse(body);

        const updated = await (prisma as any).globalSettings.upsert({
            where: { key },
            update: { value },
            create: { key, value }
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ message: "Error" }, { status: 500 });
    }
}
