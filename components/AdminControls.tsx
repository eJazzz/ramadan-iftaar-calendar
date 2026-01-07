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

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className="flex gap-2 mt-2 pt-2 border-t border-primary/10">
                    <Button variant="outline" size="sm" className="h-7 text-xs w-full">
                        <Edit className="w-3 h-3 mr-1" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" className="h-7 text-xs px-2" onClick={(e) => { e.stopPropagation(); handleDelete(); }} disabled={isLoading}>
                        <Trash2 className="w-3 h-3 mr-1" /> Delete
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Reservation</DialogTitle>
                    <DialogDescription>
                        Modify details for {new Date(reservation.date).toDateString()}
                    </DialogDescription>
                </DialogHeader>

                {reservation.editRequest && (
                    <div className="bg-orange-100 dark:text-black p-2 rounded text-xs border border-orange-200">
                        <strong>Request:</strong> {reservation.editRequest}
                    </div>
                )}

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Host Display Name(s)</Label>
                        <Input value={hostNames} onChange={(e) => setHostNames(e.target.value)} placeholder="e.g. Family of..." />
                    </div>
                    <div className="space-y-2">
                        <Label>Host Phone</Label>
                        <Input value={hostPhone} onChange={(e) => setHostPhone(e.target.value)} placeholder="e.g. 727-555-0123" />
                    </div>
                    <div className="space-y-2">
                        <Label>Notes (Internal/Admin)</Label>
                        <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Paid via Zelle" />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdate} disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
```
