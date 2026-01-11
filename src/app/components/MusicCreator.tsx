'use client';

import React, { useState, useRef } from 'react';

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

// Icons as components for cleaner code
const SparklesIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
  </svg>
);

const MusicIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
  </svg>
);

const LoaderIcon = ({ className = '' }: { className?: string }) => (
  <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const PlayIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

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

      setTimeout(() => {
        step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    } catch (err: any) {
      console.error('Lyrics error:', err);
      setError(err.message || 'Failed to generate lyrics.');
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

      setTimeout(() => {
        step3Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    } catch (err: any) {
      console.error('Music error:', err);
      setError(err.message || 'Generation failed. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 px-4">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
            loading === 'lyrics' ? 'bg-emerald-500 text-white animate-pulse' :
            lyrics ? 'bg-emerald-500 text-white' : 'glass text-white/50'
          }`}>
            {lyrics ? <CheckIcon /> : '1'}
          </div>
          <span className={`text-sm ${lyrics ? 'text-white' : 'text-white/40'}`}>Concept</span>
        </div>
        <div className={`w-12 h-px ${lyrics ? 'bg-emerald-500' : 'bg-white/10'}`} />
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
            loading === 'music' ? 'bg-emerald-500 text-white animate-pulse' :
            music ? 'bg-emerald-500 text-white' : 'glass text-white/50'
          }`}>
            {music ? <CheckIcon /> : '2'}
          </div>
          <span className={`text-sm ${music ? 'text-white' : 'text-white/40'}`}>Generate</span>
        </div>
        <div className={`w-12 h-px ${music ? 'bg-emerald-500' : 'bg-white/10'}`} />
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium glass ${music ? 'text-white' : 'text-white/50'}`}>
            3
          </div>
          <span className={`text-sm ${music ? 'text-white' : 'text-white/40'}`}>Listen</span>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="glass-accent rounded-2xl p-4 border-red-500/20 bg-red-500/10">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Step 1: Input */}
      <div className="glass rounded-3xl p-8 glow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <SparklesIcon />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Describe your song</h2>
            <p className="text-sm text-white/40">What should your music be about?</p>
          </div>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A melancholic indie song about late night city walks and neon reflections on wet pavement..."
          className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all resize-none text-base"
        />

        <button
          onClick={generateLyrics}
          disabled={loading !== null || !prompt}
          className="mt-4 w-full py-4 rounded-2xl font-medium transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed bg-emerald-500 hover:bg-emerald-400 text-black"
        >
          {loading === 'lyrics' ? (
            <>
              <LoaderIcon className="w-5 h-5" />
              <span>Generating lyrics...</span>
            </>
          ) : (
            <>
              <SparklesIcon />
              <span>Generate Lyrics & Style</span>
            </>
          )}
        </button>
      </div>

      {/* Step 2: Review & Generate */}
      <div
        ref={step2Ref}
        className={`transition-all duration-500 ${!lyrics && !loading ? 'opacity-40 pointer-events-none' : ''}`}
      >
        <div className={`glass rounded-3xl p-8 ${lyrics ? 'border-glow' : ''}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              lyrics ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400' : 'bg-white/5 border border-white/10 text-white/30'
            }`}>
              <MusicIcon />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Review & Create</h2>
              <p className="text-sm text-white/40">AI-generated composition ready for production</p>
            </div>
          </div>

          {!lyrics && !loading && (
            <div className="h-48 flex items-center justify-center text-white/20 text-sm">
              Waiting for lyrics...
            </div>
          )}

          {loading === 'lyrics' && (
            <div className="h-48 flex flex-col items-center justify-center gap-3">
              <LoaderIcon className="w-8 h-8 text-emerald-500" />
              <span className="text-white/40 text-sm">AI is composing...</span>
            </div>
          )}

          {lyrics && (
            <div className="space-y-6">
              {/* Title and tags */}
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-white">{lyrics.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {String(lyrics.style || '').split(',').filter(t => t.trim()).map((tag, i) => (
                    <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Lyrics */}
              <div className="bg-white/5 rounded-2xl p-5 max-h-64 overflow-y-auto custom-scrollbar">
                <pre className="text-white/70 text-sm whitespace-pre-wrap font-sans leading-relaxed">
                  {typeof lyrics.lyrics === 'string' ? lyrics.lyrics : JSON.stringify(lyrics.lyrics, null, 2)}
                </pre>
              </div>

              {/* Generate button */}
              <button
                onClick={generateMusic}
                disabled={loading !== null}
                className="w-full py-4 rounded-2xl font-medium transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed bg-white hover:bg-white/90 text-black glow-sm"
              >
                {loading === 'music' ? (
                  <>
                    <LoaderIcon className="w-5 h-5" />
                    <span>Producing audio...</span>
                  </>
                ) : (
                  <>
                    <PlayIcon />
                    <span>Create Music</span>
                  </>
                )}
              </button>

              <p className="text-center text-xs text-white/30">
                Generation takes ~30 seconds and uses 10 credits
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Step 3: Results */}
      <div
        ref={step3Ref}
        className={`transition-all duration-500 ${!music ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}
      >
        <div className="glass rounded-3xl p-8 border-glow">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <PlayIcon />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Your Music</h2>
              <p className="text-sm text-white/40">Two unique variations generated</p>
            </div>
          </div>

          <div className="space-y-4">
            {music?.map((track, index) => (
              <div key={track.id} className="glass rounded-2xl p-5 flex gap-5 items-center">
                {/* Album art */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                  {track.image_url ? (
                    <img src={track.image_url} alt={track.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/10">
                      <MusicIcon />
                    </div>
                  )}
                </div>

                {/* Track info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h4 className="font-medium text-white truncate">{track.title || `Variation ${index + 1}`}</h4>
                      <span className="text-xs text-emerald-400">Ready</span>
                    </div>
                    {track.audio_url && (
                      <a
                        href={track.audio_url}
                        download={`${track.title || 'audio'}.mp3`}
                        target="_blank"
                        className="p-2 rounded-lg glass hover:bg-white/10 transition-all text-white/60 hover:text-white"
                        title="Download"
                      >
                        <DownloadIcon />
                      </a>
                    )}
                  </div>

                  {track.audio_url ? (
                    <audio controls className="w-full h-10" style={{ filter: 'invert(1) hue-rotate(180deg) brightness(0.9)' }}>
                      <source src={track.audio_url} type="audio/mpeg" />
                    </audio>
                  ) : (
                    <div className="h-10 flex items-center text-sm text-white/30">
                      <LoaderIcon className="w-4 h-4 mr-2" />
                      Processing...
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
