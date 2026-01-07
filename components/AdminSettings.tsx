"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export default function AdminSettings({ currentStartDate }: { currentStartDate: string }) {
    const router = useRouter();
    const [date, setDate] = useState(currentStartDate.split("T")[0]);
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const isoDate = new Date(date).toISOString();
            const res = await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: "ramadanStart", value: isoDate })
            });

            if (!res.ok) throw new Error("Failed");

            router.refresh();
            alert("Ramadan Start Date Updated!");
        } catch (e) {
            alert("Error updating settings");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white/50 p-4 rounded-lg border border-primary/20 mb-6 flex flex-col sm:flex-row items-end gap-4">
            <div className="w-full max-w-sm space-y-2">
                <Label className="font-bold text-primary">Set Ramadan 1st (Gregorian Date)</Label>
                <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-white"
                />
                <p className="text-xs text-muted-foreground">Changing this shifts the entire Islamic calendar.</p>
            </div>
            <Button onClick={handleUpdate} disabled={isLoading}>
                {isLoading ? "Saving..." : "Update Start Date"}
            </Button>
        </div>
    );
}
