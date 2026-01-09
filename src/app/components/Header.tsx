import Link from "next/link";
import Image from "next/image";

export default function Header() {
    return (
        <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl px-6 h-20 flex items-center justify-center font-mono text-sm">
            <div className="max-w-7xl w-full flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href='/' className="text-xl font-black tracking-tighter text-white hover:opacity-80 transition-opacity">
                        AUDIO CORE
                    </Link>
                </div>
                <div className="flex items-center gap-1">
                    <Link href="/docs" className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                        Documentation
                    </Link>
                    <a href="https://github.com/Stevenkingx/audiocore/"
                        target="_blank"
                        className="px-4 py-2 rounded-lg bg-white text-black font-bold hover:bg-gray-200 transition-all flex items-center gap-2">
                        <span>GitHub</span>
                    </a>
                </div>
            </div>
        </nav>
    );
}
