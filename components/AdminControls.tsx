"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Reservation } from "@prisma/client";
import { Trash2, Edit } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

type AdminControlsProps = {
    reservation: any; // Using any temporarily to bypass generic Prisma type lag
};

export default function AdminControls({ reservation }: AdminControlsProps) {
    const router = useRouter();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to DELETE this reservation?")) return;
        setIsLoading(true);
        try {
            await fetch(`/api/admin/reservations?id=${reservation.id}`, { method: "DELETE" });
            router.refresh();
        } catch (e) {
            alert("Failed to delete");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = {
            id: reservation.id,
            hostNames: formData.get("hostNames"),
            notes: formData.get("notes"),
            clearRequest: true,
        };

        try {
            await fetch(`/api/admin/reservations`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            setIsEditOpen(false);
            router.refresh();
        } catch (e) {
            alert("Failed to update");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-2 pt-2 border-t border-primary/10 flex flex-col gap-2">
            {reservation.editRequest && (
                <div className="bg-orange-100 dark:text-black p-2 rounded text-xs border border-orange-200">
                    <strong>Request:</strong> {reservation.editRequest}
                </div>
            )}
            <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)} className="h-7 text-xs">
                    <Edit className="w-3 h-3 mr-1" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isLoading} className="h-7 text-xs">
                    <Trash2 className="w-3 h-3 mr-1" /> Delete
                </Button>
            </div>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Admin Edit</DialogTitle>
                        <DialogDescription>Modify reservation details directly.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Host Names (Display)</Label>
                            <Input name="hostNames" defaultValue={reservation.hostNames || ""} placeholder="Custom Host Names..." />
                        </div>
                        <div className="space-y-2">
                            <Label>Notes</Label>
                            <Input name="notes" defaultValue={reservation.notes || ""} />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isLoading}>Save Changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
