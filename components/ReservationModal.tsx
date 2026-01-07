"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea" // Using Input for notes for simplicity or stick to Input
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

type ReservationModalProps = {
    date: Date;
    isOpen: boolean;
    onClose: () => void;
};

export default function ReservationModal({ date, isOpen, onClose }: ReservationModalProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const data = {
            date: date.toISOString(),
            hostNames: formData.get("hostNames") as string,
            hostPhone: formData.get("hostPhone") as string,
            notes: formData.get("notes") as string,
        };

        try {
            const res = await fetch("/api/reservations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.message || "Failed to reserve");
            }

            router.refresh();
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Reserve Iftaar</DialogTitle>
                    <DialogDescription>
                        Book Iftaar for {format(date, "EEEE, MMMM do, yyyy")}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="hostNames" className="text-right">
                            Host Names
                        </Label>
                        <Input
                            id="hostNames"
                            name="hostNames"
                            placeholder="e.g. Family of..."
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="hostPhone" className="text-right">
                            Host Phone
                        </Label>
                        <Input
                            id="hostPhone"
                            name="hostPhone"
                            placeholder="e.g. 727-555-0123"
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="notes" className="text-right">
                            Notes
                        </Label>
                        <Input
                            id="notes"
                            name="notes"
                            placeholder="Special requirements..."
                            className="col-span-3"
                        />
                    </div>
                    {error && <p className="text-sm text-destructive text-center col-span-4">{error}</p>}
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Confirm Reservation"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
