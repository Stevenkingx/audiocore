export default function Footer() {
    return (
        <footer className="w-full border-t border-white/5 py-12 mt-20 flex flex-col items-center justify-center gap-4 text-gray-500 text-sm font-mono">
            <div className="flex items-center gap-6">
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="/docs" className="hover:text-white transition-colors">API</a>
            </div>
            <p className="opacity-50">
                © {new Date().getFullYear()} AUDIO CORE. Music Processing System.
            </p>
        </footer>
    );
}
