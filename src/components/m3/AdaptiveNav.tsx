import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
    { icon: "home", label: "Home", path: "/m3-landing" },
    { icon: "search", label: "Discover", path: "/m3-landing/discover" },
    { icon: "notifications", label: "Alerts", path: "/m3-landing/alerts" },
    { icon: "person", label: "Profile", path: "/m3-landing/profile" },
];

export const AdaptiveNav = () => {
    const location = useLocation();

    return (
        <>
            {/* Mobile Bottom Navigation Bar */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[var(--md-sys-color-surface-container)] flex justify-around px-2 pb-safe pt-2 z-50 transition-colors duration-300">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path || (item.path !== '/m3-landing' && location.pathname.startsWith(item.path));
                    return (
                        <Link
                            key={item.label}
                            to={item.path}
                            className="flex flex-col items-center justify-center w-16 h-[64px] group"
                        >
                            <div
                                className={cn(
                                    "flex items-center justify-center w-16 h-8 rounded-full mb-1 transition-all duration-300 relative overflow-hidden",
                                    isActive
                                        ? "bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]"
                                        : "text-[var(--md-sys-color-on-surface-variant)] group-hover:bg-[var(--md-sys-color-surface-variant)]"
                                )}
                            >
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none bg-current transition-opacity"></div>
                                <span
                                    className="material-symbols-outlined text-2xl transition-all duration-300"
                                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                                >
                                    {item.icon}
                                </span>
                            </div>
                            <span
                                className={cn(
                                    "text-[12px] font-medium leading-tight tracking-wide transition-all duration-300",
                                    isActive
                                        ? "text-[var(--md-sys-color-on-surface)]"
                                        : "text-[var(--md-sys-color-on-surface-variant)] font-normal"
                                )}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* Desktop Navigation Rail */}
            <nav className="hidden md:flex flex-col fixed left-0 top-0 h-full w-[80px] bg-[var(--md-sys-color-surface-container)] py-4 items-center z-50 transition-colors duration-300 border-r border-[var(--md-sys-color-outline-variant)]">
                <Link to="/m3-landing" className="mb-8 p-2 rounded-full hover:bg-[var(--md-sys-color-surface-variant)] transition-colors">
                    <span className="material-symbols-outlined text-[var(--md-sys-color-primary)] text-3xl">
                        explore
                    </span>
                </Link>
                <div className="flex flex-col gap-[12px] w-full px-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== '/m3-landing' && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.label}
                                to={item.path}
                                className="flex flex-col items-center justify-center w-[64px] group relative py-2 mx-auto"
                            >
                                <div
                                    className={cn(
                                        "flex items-center justify-center w-[56px] h-[32px] rounded-full mb-[4px] transition-all duration-300 overflow-hidden relative",
                                        isActive
                                            ? "bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]"
                                            : "text-[var(--md-sys-color-on-surface-variant)] group-hover:bg-[var(--md-sys-color-surface-variant)]"
                                    )}
                                >
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none bg-current transition-opacity"></div>
                                    <span
                                        className="material-symbols-outlined text-2xl transition-all duration-300"
                                        style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                                    >
                                        {item.icon}
                                    </span>
                                </div>
                                <span
                                    className={cn(
                                        "text-[12px] font-medium leading-tight tracking-wide transition-all duration-300 text-center w-full",
                                        isActive
                                            ? "text-[var(--md-sys-color-on-surface)]"
                                            : "text-[var(--md-sys-color-on-surface-variant)] font-normal group-hover:text-[var(--md-sys-color-on-surface)]"
                                    )}
                                >
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
};
