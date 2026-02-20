import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

gsap.registerPlugin(ScrollTrigger);

const stories = [
    {
        quote: "Style.AI completely transformed how I approach my daily wardrobe. It's like having a personal stylist in my pocket.",
        author: "Elena R.",
        role: "Creative Director",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
    },
    {
        quote: "The personalized recommendations are spot on. I've discovered brands I love but would never have found on my own.",
        author: "Marcus T.",
        role: "Architect",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
    },
    {
        quote: "Finally, a platform that understands my unique body type and style preferences. Shopping is fun again.",
        author: "Sarah L.",
        role: "Tech Entrepreneur",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop"
    }
];

export const StoriesSection = () => {
    const containerRef = useRef(null);
    const headerRef = useRef(null);
    const cardsRef = useRef(null);

    useGSAP(() => {
        gsap.from(headerRef.current, {
            scrollTrigger: {
                trigger: headerRef.current,
                start: "top 80%",
            },
            y: 30,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });

        gsap.from(cardsRef.current?.children || [], {
            scrollTrigger: {
                trigger: cardsRef.current,
                start: "top 70%",
            },
            x: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        });

    }, { scope: containerRef });

    return (
        <section id="stories" ref={containerRef} className="py-32 bg-secondary/30 overflow-hidden">
            <div className="container mx-auto px-6">
                <div ref={headerRef} className="mb-20 text-center md:text-left">
                    <p className="text-sm font-medium tracking-widest uppercase mb-4 text-muted-foreground">Success Stories</p>
                    <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
                        Loved by Fashion Leaders
                    </h2>
                </div>

                <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stories.map((story, index) => (
                        <div key={index} className="bg-background p-10 border border-border/50 hover:border-black/20 transition-colors duration-300 flex flex-col justify-between h-full min-h-[300px]">
                            <p className="text-xl md:text-2xl font-display font-medium leading-relaxed mb-8">
                                "{story.quote}"
                            </p>

                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12 border border-border">
                                    <AvatarImage src={story.image} alt={story.author} />
                                    <AvatarFallback>{story.author[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold text-sm tracking-wide">{story.author}</p>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{story.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
