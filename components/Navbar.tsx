import Link from "next/link";
import { Moon } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="bg-white/50 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
                            <Moon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-xl leading-none text-primary">Masjid Al Rahman</span>
                            <span className="text-[10px] font-medium text-muted-foreground tracking-wide uppercase">Ramadan 2026</span>
                        </div>
                    </Link>
                    <div className="hidden md:flex flex-col text-xs text-muted-foreground border-l pl-4 border-dashed border-primary/20">
                        <span>2577 Keystone Rd, Tarpon Springs, FL 34688</span>
                        <span>(727) 279-5503</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                        Login
                    </Link>
                    <Link href="/register" className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                        Register
                    </Link>
                </div>
            </div>
        </nav>
    );
}
