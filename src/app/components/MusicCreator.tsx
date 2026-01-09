'use client';

import React, { useState, useRef } from 'react';
import { Sparkles, Music, Loader2, Play, CheckCircle2, AlertCircle, Lock, Download } from 'lucide-react';

interface LyricsResult {
  title: string;
  lyrics: string;
  style: string;
}

interface AudioInfo {
  id: string;
  title?: string;
  audio_url?: string;
  image_url?: string;
  status: string;
}

export default function MusicCreator() {
  const [prompt, setPrompt] = useState('');
  const [lyrics, setLyrics] = useState<LyricsResult | null>(null);
  const [music, setMusic] = useState<AudioInfo[] | null>(null);
  const [loading, setLoading] = useState<'lyrics' | 'music' | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);

  const getHeaders = () => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    // In some setups, we might want to expose the public key to the frontend 
    // or handle it via a session. For now, we'll check if a public key is provided.
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }
    return headers;
  };

  const generateLyrics = async () => {
    if (!prompt) return;
    setLoading('lyrics');
    setError(null);
    setMusic(null);
    setLyrics(null);
    try {
      const res = await fetch('/api/ai_lyrics', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ prompt }),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server Error (${res.status}): ${errorText.substring(0, 100)}`);
      }

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setLyrics(data);
      
      // Auto-scroll to step 2 after a short delay
      setTimeout(() => {
        step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    } catch (err: any) {
      console.error('Lyrics error:', err);
      setError(err.message || 'Failed to generate lyrics. Check your OpenAI Key.');
    } finally {
      setLoading(null);
    }
  };

  const generateMusic = async () => {
    if (!lyrics) return;
    setLoading('music');
    setError(null);
    try {
      const res = await fetch('/api/custom_generate', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          prompt: String(lyrics.lyrics),
          tags: String(lyrics.style),
          title: String(lyrics.title),
          wait_audio: true,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Engine Error (${res.status}): ${errorText.substring(0, 100)}`);
      }

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMusic(data);
      
      // Auto-scroll to results
      setTimeout(() => {
        step3Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    } catch (err: any) {
      console.error('Music error:', err);
      setError(err.message || 'The Suno engine timed out. Try generating without waiting for audio.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-16 pb-32 px-4">
      {/* Step 1: Input */}
      <div className="p-8 rounded-[40px] bg-white/[0.03] border border-white/10 backdrop-blur-xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <span className="text-8xl font-black italic tracking-tighter text-white">01</span>
        </div>
        
        <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
            <Sparkles className="text-indigo-400 w-6 h-6" />
          </div>
          Create Your Concept
        </h2>
        
        <div className="space-y-6">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="What is your song about? (e.g. A futuristic love story in a neon-lit Tokyo)"
            className="w-full h-40 bg-black/60 border border-white/10 rounded-[24px] p-6 text-xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none shadow-inner"
          />
          
          <button
            onClick={generateLyrics}
            disabled={loading !== null || !prompt}
            className="w-full py-5 bg-indigo-600 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed text-white font-black text-lg rounded-2xl transition-all flex items-center justify-center gap-3 shadow-[0_10px_40px_-10px_rgba(79,70,229,0.5)] active:scale-[0.99]"
          >
            {loading === 'lyrics' ? (
              <Loader2 className="animate-spin w-6 h-6" />
            ) : (
              <Sparkles className="w-6 h-6" />
            )}
            {loading === 'lyrics' ? 'AI IS WRITING...' : 'GENERATE LYRICS & STYLE'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-4 animate-bounce">
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
          <p className="font-bold">{error}</p>
        </div>
      )}

      {/* Step 2: Composition & Music Trigger */}
      <div 
        ref={step2Ref}
        className={`transition-all duration-700 border-2 rounded-[44px] p-1 ${!lyrics ? 'border-white/5 opacity-50' : 'border-indigo-500/50 shadow-[0_0_50px_-10px_rgba(79,70,229,0.3)]'}`}
      >
        <div className="p-8 rounded-[40px] bg-white/[0.03] backdrop-blur-3xl">
          <div className="flex items-center gap-3 mb-10">
            <div className={`p-3 rounded-2xl ${lyrics ? 'bg-indigo-500' : 'bg-white/10'}`}>
              {lyrics ? <CheckCircle2 className="w-5 h-5 text-white" /> : <Lock className="w-5 h-5 text-white/40" />}
            </div>
            <div>
              <h2 className="text-3xl font-black text-white leading-none">Music Production</h2>
              <p className="text-gray-500 text-sm mt-2 uppercase tracking-widest font-bold">Step 02: Studio Processing</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-3 space-y-6">
              <div className="p-8 rounded-3xl bg-black/40 border border-white/10 min-h-[300px] relative overflow-hidden">
                {!lyrics && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 gap-2">
                    <Loader2 className={`w-8 h-8 ${loading === 'lyrics' ? 'animate-spin text-indigo-500' : 'opacity-20'}`} />
                    <p className="font-bold text-sm tracking-tighter uppercase">{loading === 'lyrics' ? 'IA is writing...' : 'Waiting for composition'}</p>
                  </div>
                )}
                
                {lyrics && (
                  <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <h4 className="text-2xl font-black text-white mb-2 underline decoration-indigo-500 decoration-4 underline-offset-8">{lyrics.title}</h4>
                    <div className="flex flex-wrap gap-2 mb-6 mt-4">
                      {String(lyrics.style || '').split(' ').filter(t => t.trim()).map((tag, i) => (
                        <span key={i} className="text-[10px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="max-h-[350px] overflow-y-auto pr-4 custom-scrollbar text-gray-300 text-lg whitespace-pre-wrap leading-relaxed italic font-serif">
                      {typeof lyrics.lyrics === 'string' ? lyrics.lyrics : JSON.stringify(lyrics.lyrics, null, 2)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col justify-center space-y-8">
              <div className="text-center lg:text-left space-y-4">
                <h3 className="text-4xl font-black text-white tracking-tighter">Ready to Hear It?</h3>
                <p className="text-gray-400 text-lg leading-snug">The Suno Engine will transform this text into two unique studio variations.</p>
              </div>
              
              <button
                onClick={generateMusic}
                disabled={!lyrics || loading !== null}
                className={`group relative w-full py-8 text-2xl font-black rounded-3xl transition-all transform active:scale-95 flex items-center justify-center gap-4 overflow-hidden ${
                  lyrics 
                    ? 'bg-white text-black shadow-[0_20px_50px_-10px_rgba(255,255,255,0.3)] hover:bg-indigo-50' 
                    : 'bg-white/5 text-white/10 cursor-not-allowed border border-white/5'
                }`}
              >
                {loading === 'music' ? (
                  <Loader2 className="animate-spin w-8 h-8" />
                ) : (
                  <Play className={`w-8 h-8 ${lyrics ? 'fill-black' : 'fill-white/10'}`} />
                )}
                <span className="relative z-10">
                  {loading === 'music' ? 'PRODUCING...' : 'CREATE MUSIC NOW'}
                </span>
                
                {lyrics && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                )}
              </button>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                  <p className="text-[10px] font-black text-gray-500 uppercase">Cost</p>
                  <p className="text-lg font-black text-white">10 Credits</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                  <p className="text-[10px] font-black text-gray-500 uppercase">Engine</p>
                  <p className="text-lg font-black text-indigo-400 italic">v5.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Production Results */}
      <div 
        ref={step3Ref}
        className={`transition-all duration-1000 ${!music ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
      >
        <div className="p-10 rounded-[40px] bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <span className="text-9xl font-black italic tracking-tighter text-white">03</span>
          </div>

          <h3 className="text-2xl font-black text-white mb-10 flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Play className="text-emerald-400 w-6 h-6 fill-emerald-400" />
            </div>
            Studio Masters
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            {music?.map((track) => (
              <div key={track.id} className="p-6 rounded-3xl bg-black/60 border border-white/5 space-y-6 hover:border-emerald-500/40 transition-all group overflow-hidden flex flex-col md:flex-row gap-6 items-center md:items-start">
                {/* Track Image */}
                <div className="w-32 h-32 flex-shrink-0 relative overflow-hidden rounded-2xl bg-white/5 border border-white/10">
                  {track.image_url ? (
                    <img src={track.image_url} alt={track.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="text-white/10 w-8 h-8" />
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-white font-black text-xl block truncate max-w-[200px]">{track.title || 'Variation'}</span>
                      <span className="text-emerald-500 text-[10px] font-black font-mono uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 inline-block">Mastered</span>
                    </div>
                    {track.audio_url && (
                      <a 
                        href={track.audio_url} 
                        download={`${track.title || 'audio'}.mp3`}
                        target="_blank"
                        className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all"
                        title="Download MP3"
                      >
                        <Download className="w-5 h-5" />
                      </a>
                    )}
                  </div>

                  {track.audio_url ? (
                    <audio controls className="w-full h-12 filter brightness-125 contrast-125">
                      <source src={track.audio_url} type="audio/mpeg" />
                    </audio>
                  ) : (
                    <div className="h-12 flex items-center justify-center text-sm text-gray-500 font-bold bg-white/5 rounded-2xl border border-dashed border-white/10">
                      <Loader2 className="animate-spin w-4 h-4 mr-3" />
                      Synchronizing Audio...
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
