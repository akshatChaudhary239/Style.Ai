import { useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const VisionSection = () => {
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const visualRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 70%",
                end: "bottom 80%",
                toggleActions: "play none none reverse",
            }
        });

        tl.from(textRef.current?.children || [], {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        });

        gsap.to(visualRef.current, {
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            },
            y: 100,
            ease: "none"
        });

    }, { scope: containerRef });

    return (
        <section id="vision" ref={containerRef} className="relative py-32 bg-black text-white overflow-hidden min-h-[80vh] flex items-center">
            {/* Abstract Background Elements */}
            <div ref={visualRef} className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-gray-800 to-transparent rounded-full blur-[120px] opacity-30 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gray-900 rounded-full blur-[80px] opacity-40 pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                <div ref={textRef} className="space-y-8">
                    <p className="text-sm font-medium tracking-[0.3em] uppercase text-gray-400">Our Vision</p>
                    <h2 className="text-5xl md:text-7xl font-display font-bold leading-tight">
                        The Future <br /> of Personal Style
                    </h2>
                    <p className="text-xl text-gray-400 leading-relaxed font-light max-w-md">
                        We believe in a world where AI empowers your individuality.
                        No more endless scrolling. No more fashion fatigue.
                        Just curated style that evolves with you.
                    </p>
                    <div className="pt-8">
                        <Link to="/auth">
                            <Button size="lg" className="bg-white text-black hover:bg-gray-200 rounded-none px-10 h-14 text-lg">
                                Join the Movement
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="flex justify-center md:justify-end">
                    <div className="relative w-full max-w-md aspect-square border-l border-t border-white/20 p-8">
                        <div className="absolute top-0 right-0 w-32 h-32 border-r border-t border-white/20"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 border-l border-b border-white/20"></div>

                        <div className="h-full w-full flex flex-col justify-between">
                            <span className="text-6xl font-display font-bold text-white/10">01</span>
                            <span className="text-6xl font-display font-bold text-white/10 text-right">∞</span>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};
