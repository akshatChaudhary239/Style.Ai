import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-transparent border-none">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                <Link to="/" className="text-2xl font-display font-bold tracking-tighter">
                    Style.AI
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <a href="#about" className="text-sm font-medium text-black hover:text-gray-600 transition-colors">
                        About
                    </a>
                    <a href="#stories" className="text-sm font-medium text-black hover:text-gray-600 transition-colors">
                        Stories
                    </a>
                    <a href="#vision" className="text-sm font-medium text-black hover:text-gray-600 transition-colors">
                        Vision
                    </a>
                </div>

                <div className="flex items-center gap-4">
                    <Link to="/auth">
                        <Button variant="ghost" className="text-sm font-medium hover:bg-transparent hover:text-primary/60">
                            Login
                        </Button>
                    </Link>
                    <Link to="/auth">
                        <Button className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 px-6">
                            Sign Up
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};
