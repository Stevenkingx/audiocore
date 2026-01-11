import Link from "next/link";
import MusicCreator from "./components/MusicCreator";

export default function Home() {
  return (
    <div className="noise">
      {/* Hero Section */}
      <section className="min-h-[85vh] flex flex-col items-center justify-center relative pt-20">
        {/* Floating orbs background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-600/8 rounded-full blur-[80px] animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-teal-500/5 rounded-full blur-[60px] animate-float" style={{ animationDelay: '4s' }} />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center gap-8 max-w-4xl px-4">
          {/* Status badge */}
          <div className="glass-accent rounded-full px-4 py-2 flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-sm text-emerald-300/80 font-medium">API v1.2 Active</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
            <span className="text-white/90">Audio Generation</span>
            <br />
            <span className="text-gradient">Reimagined</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-white/40 max-w-2xl leading-relaxed">
            A powerful REST API for AI-powered music creation. Generate complete songs from text descriptions in seconds.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link
              href="/docs"
              className="group relative px-8 py-4 rounded-2xl font-semibold text-black bg-emerald-400 hover:bg-emerald-300 transition-all glow-sm hover:glow"
            >
              <span className="relative z-10">View Documentation</span>
            </Link>
            <a
              href="#create"
              className="px-8 py-4 rounded-2xl font-medium glass hover:bg-white/10 transition-all text-white/80 hover:text-white"
            >
              Try It Now
            </a>
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-8 mt-8 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">v5</div>
              <div className="text-white/30">Engine</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white">&lt;30s</div>
              <div className="text-white/30">Generation</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white">REST</div>
              <div className="text-white/30">API</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </section>

      {/* Music Creator Section */}
      <section id="create" className="py-20">
        <MusicCreator />
      </section>

      {/* Features Section */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Built for Developers
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">
              Everything you need to integrate AI music generation into your applications.
            </p>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group p-8 rounded-3xl glass hover:glass-strong transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Fast Generation</h3>
              <p className="text-white/40 leading-relaxed">
                Generate complete songs in under 30 seconds with our optimized pipeline.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-3xl glass hover:glass-strong transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">CAPTCHA Handling</h3>
              <p className="text-white/40 leading-relaxed">
                Built-in 2Captcha integration for seamless automated generation.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-3xl glass hover:glass-strong transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Persona Support</h3>
              <p className="text-white/40 leading-relaxed">
                Create and use voice personas for consistent vocal styles across generations.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 rounded-3xl glass hover:glass-strong transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Full Control</h3>
              <p className="text-white/40 leading-relaxed">
                Custom lyrics, style tags, negative prompts, and instrumental mode.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group p-8 rounded-3xl glass hover:glass-strong transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Stem Separation</h3>
              <p className="text-white/40 leading-relaxed">
                Extract vocals, drums, bass, and other stems from generated audio.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group p-8 rounded-3xl glass hover:glass-strong transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Simple Integration</h3>
              <p className="text-white/40 leading-relaxed">
                RESTful endpoints with OpenAPI documentation. Easy to integrate anywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Code example section */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Quick Start</h2>
            <p className="text-white/40">Generate your first song in seconds</p>
          </div>

          <div className="glass rounded-3xl p-6 overflow-hidden">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
              <span className="ml-4 text-xs text-white/30 font-mono">curl</span>
            </div>
            <pre className="text-sm font-mono overflow-x-auto custom-scrollbar">
              <code className="text-white/70">
{`curl -X POST https://your-domain.com/api/custom_generate \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "prompt": "[Verse]\\nHello world...",
    "tags": "pop, upbeat, energetic",
    "title": "My First Song",
    "wait_audio": true
  }'`}
              </code>
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
}
