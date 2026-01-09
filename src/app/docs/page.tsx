import React from 'react';
import Swagger from '../components/Swagger';
import spec from './swagger-audiocore.json'; // Directly import JSON file
import Section from '../components/Section';
import Markdown from 'react-markdown';


export default function Docs() {
    return (
        <div className="relative pb-20">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full -z-10" />
            <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-purple-600/5 blur-[100px] rounded-full -z-10" />

            <Section className="pt-16">
                <article className="prose lg:prose-lg max-w-4xl pt-10 prose-invert mx-auto">
                    <div className="text-center mb-16">
                        <h1 className='text-6xl font-black tracking-tighter text-white mb-4'>
                            API Engine
                        </h1>
                        <p className="text-gray-400 text-xl">
                            Complete reference for Audio Core generation endpoints.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 not-prose">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <h3 className="text-white font-bold mb-2">Endpoint URL</h3>
                            <code className="text-indigo-400">http://localhost:3000/api</code>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                            <h3 className="text-white font-bold mb-2">Auth Method</h3>
                            <code className="text-indigo-400">Environment Variables / Cookies</code>
                        </div>
                    </div>

                    <Markdown className="bg-white/5 border border-white/10 p-8 rounded-3xl mb-16">
                        {`                     
### Available Endpoints

\`\`\`bash
- /api/generate           # Music generation
- /api/ai_lyrics          # ChatGPT lyrics engine
- /api/custom_generate    # Custom parameters
- /api/extend_audio       # Length extension
- /api/get                # Retrieve variations
- /api/get_limit          # Check credits
\`\`\`

### Multi-Account Setup
Distribute requests by separating cookies with \`|||\` in your \`.env\`.
                        `}
                    </Markdown>
                </article>
            </Section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className='text-3xl font-bold text-white mb-2'>
                        Interactive Playground
                    </h2>
                    <p className='text-indigo-400/70 italic'>
                        Test the endpoints in real-time.
                    </p>
                </div>

                <div className='bg-white/[0.02] border border-white/10 p-4 rounded-[32px] shadow-2xl backdrop-blur-sm overflow-hidden mb-20'>
                    <Swagger spec={spec} />
                </div>
            </div>
        </div>
    );
}
