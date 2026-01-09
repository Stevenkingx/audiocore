import Section from "./components/Section";
import Link from "next/link";
import MusicCreator from "./components/MusicCreator";

export default function Home() {
  return (
    <>
      <Section className="min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[100px] rounded-full -z-10" />
        
        <div className="flex flex-col items-center text-center gap-8 max-w-4xl px-4 pt-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-sm font-medium animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Music Generation System Active
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 leading-tight">
            Create Music <br /> Without Limits
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed">
            Power your projects with artificial intelligence. A clean and powerful interface for high-fidelity audio generation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link 
              href="/docs" 
              className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              API Documentation
            </Link>
            <a 
              href="https://github.com/Stevenkingx/audiocore" 
              className="px-8 py-4 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </Section>

      <div className="py-10 w-full">
        {/* New Music Creator Flow */}
        <MusicCreator />
      </div>

      <Section className="py-24 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-colors group">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            </div>
            <h3 className="text-xl font-bold mb-4 text-white">Low Latency</h3>
            <p className="text-gray-400 leading-relaxed">Optimized for fast responses and efficient processing of your musical requests.</p>
          </div>
          
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-colors group">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10 10 10 0 0 1-10-10 10 10 0 0 1 10-10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
            </div>
            <h3 className="text-xl font-bold mb-4 text-white">Multi-Account</h3>
            <p className="text-gray-400 leading-relaxed">Built-in support for multiple accounts allowing automatic rotation and scalability.</p>
          </div>
          
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-colors group">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7"/><path d="M16 5V3"/><path d="M8 5V3"/><path d="M3 11h18"/><circle cx="18" cy="18" r="3"/><path d="m11 11 3 3"/></svg>
            </div>
            <h3 className="text-xl font-bold mb-4 text-white">Easy Integration</h3>
            <p className="text-gray-400 leading-relaxed">Compatible with standard formats allowing quick integration into any workflow.</p>
          </div>
        </div>
      </Section>
    </>
  );
}
