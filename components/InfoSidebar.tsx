import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Truck, CheckCircle, Smartphone } from "lucide-react";

export default function InfoSidebar() {
    return (
        <div className="space-y-6">
            <Card className="bg-white/50 backdrop-blur-sm border-white/60 shadow-lg">
                <CardHeader className="pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-primary">
                        <Info className="w-5 h-5" />
                        <CardTitle className="text-lg">Notes: Ramadan 2026</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 p-5 text-sm">
                    <div className="space-y-2">
                        <h4 className="font-semibold text-primary/90 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" /> Requirements
                        </h4>
                        <ul className="space-y-2 text-sm text-foreground/80 list-disc list-outside pl-4">
                            <li className="font-medium text-primary">Register and login to make a reservation.</li>
                            <li>Hosts must arrive 30 minutes before Maghrib.</li>
                            <li>Sponsors pay $225/day for supplies</li>
                            <li>Payment: Check to Al Rahman or Zelle</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-semibold text-primary/90 flex items-center gap-2">
                            <Truck className="w-4 h-4" /> Logistics
                        </h4>
                        <p className="text-muted-foreground">
                            Food to be delivered to Masjid <span className="font-medium text-foreground">45 min before Maghreb</span>.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-semibold text-primary/90 flex items-center gap-2">
                            <Smartphone className="w-4 h-4" /> Questions?
                        </h4>
                        <p className="text-muted-foreground">
                            Contact Sister Elizabeth: <span className="font-mono text-foreground">727-967-7014</span>
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/10">
                <CardContent className="p-5">
                    <h4 className="font-bold text-primary mb-2">A Good Muslim Should:</h4>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                        <li><strong className="text-foreground">Avoid:</strong> Food and Water Wastage</li>
                        <li><strong className="text-foreground">Keep:</strong> Masjid and Cafeteria Clean</li>
                        <li><strong className="text-foreground">Be:</strong> Considerate to Others</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
