import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const AboutSection = () => {
    const containerRef = useRef(null);
    const textRef = useRef(null);
    const imageRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse",
            }
        });

        tl.from(textRef.current, {
            x: -50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        })
            .from(imageRef.current, {
                x: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            }, "-=0.8");

    }, { scope: containerRef });

    return (
        <section id="about" ref={containerRef} className="py-24 px-6 md:px-12 bg-background overflow-hidden">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                <div ref={textRef} className="space-y-8">
                    <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight">
                        Redefining Fashion <br /> with Artificial Intelligence
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light">
                        Style.AI isn't just a platform; it's your personal stylist, evolved.
                        We analyze thousands of data points to curate outfits that perfectly match your body type,
                        preferences, and the latest trends. Experience fashion that truly fits you.
                    </p>
                    <div className="flex gap-4 pt-4">
                        <div className="h-px w-24 bg-black mt-3"></div>
                        <p className="text-sm font-medium tracking-widest uppercase">The Future of Style</p>
                    </div>
                </div>

                <div ref={imageRef} className="relative h-[600px] w-full overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
                        alt="Fashion Editorial"
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out scale-100 hover:scale-105"
                    />
                    <div className="absolute inset-0 ring-1 ring-black/5 pointer-events-none"></div>
                </div>

            </div>
        </section>
    );
};
