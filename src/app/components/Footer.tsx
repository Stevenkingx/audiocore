import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-end justify-center gap-[2px] h-5">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-[2px] bg-emerald-500/50 rounded-full"
                  style={{ height: `${[40, 70, 100, 60, 30][i]}%` }}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-white/50">audiocore</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <Link href="/docs" className="text-white/40 hover:text-white transition-colors">
              Documentation
            </Link>
            <a
              href="https://github.com/Stevenkingx/audiocore"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-white/30">
            {new Date().getFullYear()} audiocore
          </p>
        </div>
      </div>
    </footer>
  );
}
