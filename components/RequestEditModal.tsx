"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Need to create this or use Input
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

type RequestEditModalProps = {
    reservationId: string;
    isOpen: boolean;
    onClose: () => void;
};

export default function RequestEditModal({ reservationId, isOpen, onClose }: RequestEditModalProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const reason = formData.get("reason") as string;

        try {
            const res = await fetch(`/api/reservations/request`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reservationId, reason }),
            });

            if (!res.ok) {
                throw new Error("Failed to submit request");
            }

            router.refresh();
            onClose();
            alert("Request submitted to Admin (Imam).");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Request Change</DialogTitle>
                    <DialogDescription>
                        Submit a request to the Admin to cancel or edit this reservation.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="reason">Reason / Request Details</Label>
                        <Input
                            id="reason"
                            name="reason"
                            placeholder="e.g. Please cancel for me, or change host name to..."
                            required
                        />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Submitting..." : "Submit Request"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
