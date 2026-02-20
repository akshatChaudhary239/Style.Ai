export const Footer = () => {
    return (
        <footer className="bg-black text-white py-12 border-t border-white/10">
            <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-center md:text-left">
                    <h3 className="text-2xl font-display font-bold">Style.AI</h3>
                    <p className="text-white/60 text-sm mt-2">© 2024 Style.AI. All rights reserved.</p>
                </div>

                <div className="flex gap-8">
                    <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Terms</a>
                    <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Contact</a>
                </div>
            </div>
        </footer>
    );
};
