import { useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export const HeroSection = () => {
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const buttonsRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        tl.from(textRef.current?.children || [], {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            delay: 0.5
        })
            .from(buttonsRef.current, {
                y: 20,
                opacity: 0,
                duration: 0.8
            }, "-=0.5");

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1635650804512-003e5ee6ccac?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Fashion Background"
                    className="w-full h-full object-cover opacity-100 scale-105"
                />
                <div className="absolute inset-0 bg-black/20"></div>
            </div>

            <div ref={textRef} className="z-10 flex flex-col items-center text-center space-y-2 mt-20">
                <h1 className="text-6xl md:text-[8rem] leading-[0.9] font-display font-black tracking-tighter text-white uppercase overflow-hidden drop-shadow-sm">
                    <div className="inline-block relative">Your Style</div>
                </h1>
                <h1 className="text-6xl md:text-[8rem] leading-[0.9] font-display font-black tracking-tighter text-white/90 uppercase overflow-hidden drop-shadow-sm">
                    <div className="inline-block relative">Journey</div>
                </h1>
                <h1 className="text-6xl md:text-[8rem] leading-[0.9] font-display font-black tracking-tighter text-white/80 uppercase overflow-hidden drop-shadow-sm">
                    <div className="inline-block relative">Starts Here</div>
                </h1>
            </div>

            <div ref={buttonsRef} className="z-10 mt-12 flex flex-col sm:flex-row gap-6">
                <Link to="/auth">
                    <Button size="lg" className="h-14 px-10 rounded-full text-lg bg-black text-white hover:bg-black/80 hover:scale-105 transition-all duration-300 shadow-xl border border-black/10">
                        Start Journey
                    </Button>
                </Link>
                <Link to="/auth">
                    <Button size="lg" variant="outline" className="h-14 px-10 rounded-full text-lg border-2 border-white text-white bg-transparent hover:bg-black hover:text-white transition-all duration-300">
                        Login
                    </Button>
                </Link>
            </div>
        </div>
    );
};
