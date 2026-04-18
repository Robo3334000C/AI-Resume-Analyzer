import { AdaptiveNav } from "@/components/m3/AdaptiveNav";
import { M3Card } from "@/components/m3/M3Card";
import { Link } from "react-router-dom";
import '@material/web/ripple/ripple.js';

export default function MaterialLanding() {
    return (
        <div className="min-h-screen bg-[var(--md-sys-color-background)] text-[var(--md-sys-color-on-background)] pb-24 md:pb-0 md:pl-[80px] transition-colors duration-300 font-sans">
            <AdaptiveNav />

            <main className="container mx-auto px-4 py-8 md:py-16 max-w-6xl">
                {/* Hero Section */}
                <div className="text-center mb-16 space-y-6">
                    <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] mb-4">
                        <span className="material-symbols-outlined text-4xl">palette</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-medium text-[var(--md-sys-color-on-background)] tracking-tight">
                        Material 3 Expressive
                    </h1>
                    <p className="text-xl md:text-2xl text-[var(--md-sys-color-on-surface-variant)] max-w-3xl mx-auto leading-relaxed">
                        A dynamic, personalized, and accessible design system adapting to your specific needs with advanced color roles and adaptive typography.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                        <md-filled-button style={{ '--md-filled-button-label-text-font': 'inherit', '--md-filled-button-label-text-size': '16px' }}>
                            Get Started
                        </md-filled-button>
                        <md-outlined-button style={{ '--md-outlined-button-label-text-font': 'inherit', '--md-outlined-button-label-text-size': '16px' }}>
                            Read Guidelines
                        </md-outlined-button>
                    </div>
                </div>

                {/* M3 Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    <M3Card size="lg" variant="elevated">
                        <div className="p-6 h-full flex flex-col">
                            <div className="w-12 h-12 rounded-full bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined pb-safe">dynamic_form</span>
                            </div>
                            <h3 className="text-2xl font-medium mb-3">Dynamic Color</h3>
                            <p className="text-[var(--md-sys-color-on-surface-variant)] leading-relaxed flex-grow">
                                Extracts custom color schemes from wallpapers to create personalized experiences.
                            </p>
                        </div>
                    </M3Card>

                    <M3Card size="lg" variant="filled">
                        <div className="p-6 h-full flex flex-col">
                            <div className="w-12 h-12 rounded-full bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined pb-safe">category</span>
                            </div>
                            <h3 className="text-2xl font-medium mb-3">Expressive Shapes</h3>
                            <p className="text-[var(--md-sys-color-on-surface-variant)] leading-relaxed flex-grow">
                                Large, rounded corners (24px) for prominent surfaces, shifting from strictly rectangular layouts.
                            </p>
                        </div>
                    </M3Card>

                    <M3Card size="lg" variant="outlined">
                        <div className="p-6 h-full flex flex-col">
                            <div className="w-12 h-12 rounded-full bg-[var(--md-sys-color-tertiary-container)] text-[var(--md-sys-color-on-tertiary-container)] flex items-center justify-center mb-6">
                                <span className="material-symbols-outlined pb-safe">elevation</span>
                            </div>
                            <h3 className="text-2xl font-medium mb-3">Tonal Elevation</h3>
                            <p className="text-[var(--md-sys-color-on-surface-variant)] leading-relaxed flex-grow">
                                Replaces drop shadows with color overlays in light and dark modes to define visual hierarchy.
                            </p>
                        </div>
                    </M3Card>
                </div>

                {/* Typography Section block */}
                <section className="bg-[var(--md-sys-color-surface-container-low)] rounded-3xl p-8 md:p-12 mb-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <span className="material-symbols-outlined text-[200px]">text_fields</span>
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-4xl font-display mb-8 text-[var(--md-sys-color-primary)]">M3 Typography Scale</h2>
                        <div className="space-y-6">
                            <div className="border-b border-[var(--md-sys-color-outline-variant)] pb-4">
                                <span className="text-sm font-medium text-[var(--md-sys-color-secondary)] mb-1 block uppercase tracking-wider">Display Large</span>
                                <div className="text-5xl md:text-6xl lg:text-7xl font-display">Ag</div>
                            </div>
                            <div className="border-b border-[var(--md-sys-color-outline-variant)] pb-4">
                                <span className="text-sm font-medium text-[var(--md-sys-color-secondary)] mb-1 block uppercase tracking-wider">Headline Large</span>
                                <div className="text-3xl md:text-4xl font-display">Headline</div>
                            </div>
                            <div className="border-b border-[var(--md-sys-color-outline-variant)] pb-4">
                                <span className="text-sm font-medium text-[var(--md-sys-color-secondary)] mb-1 block uppercase tracking-wider">Title Large</span>
                                <div className="text-xl md:text-2xl font-medium">Card Title</div>
                            </div>
                            <div className="border-b border-[var(--md-sys-color-outline-variant)] pb-4">
                                <span className="text-sm font-medium text-[var(--md-sys-color-secondary)] mb-1 block uppercase tracking-wider">Body Large</span>
                                <div className="text-base text-[var(--md-sys-color-on-surface-variant)]">This is paragraph text describing the feature or content. It utilizes the default body text styles meant for longer passages of content.</div>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-[var(--md-sys-color-secondary)] mb-1 block uppercase tracking-wider">Label Large</span>
                                <div className="text-sm font-medium">BUTTON TEXT</div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}
