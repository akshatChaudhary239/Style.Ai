import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const images = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1721003080966-423d4017d09d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmFzaGlvbiUyMG1vZGVsJTIwd29tZW58ZW58MHwxfDB8fHww",
];

export const GallerySection = () => {
    const containerRef = useRef(null);
    const headerRef = useRef(null);

    useGSAP(() => {
        gsap.from(headerRef.current, {
            scrollTrigger: {
                trigger: headerRef.current,
                start: "top 90%",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });

        gsap.utils.toArray(".gallery-item").forEach((item: any, i) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: "top 90%",
                },
                y: 100,
                opacity: 0,
                duration: 1,
                delay: i * 0.1,
                ease: "power3.out"
            });
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="py-24 bg-background">
            <div className="container mx-auto px-4 md:px-8">
                <div ref={headerRef} className="text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-display font-bold mb-4">Stylish People</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Join the community of trendsetters. Discover how others are redefining their look with Style.AI.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {images.map((src, index) => (
                        <div key={index} className="gallery-item group relative h-[500px] overflow-hidden cursor-pointer">
                            <img
                                src={src}
                                alt={`Stylish person ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 grayscale group-hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="text-white text-lg font-medium tracking-widest uppercase border border-white px-6 py-2">View Look</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
