import OpenAI from 'openai';

// Default banned words that produce cliché lyrics
const DEFAULT_BANNED_WORDS = ['neon', 'ashes', 'echoes', 'shadows', 'abyss', 'void'];

// System prompt optimized for Suno AI lyrics
const SYSTEM_PROMPT = `You write original song lyrics for Suno AI.

HARD RULES:
- Output ONLY valid JSON matching the schema provided.
- Lyrics must use Suno section tags in English: [Intro], [Verse 1], [Verse 2], [Pre-Chorus], [Chorus], [Bridge], [Outro], etc.
- Simple American English. 6th-8th grade reading level.
- Short lines, usually 4-8 words per line. No obscure or pretentious words.
- No dashes in lyrics. No artist names. No copied lyrics from existing songs.
- Each section should have 4-8 lines.

MUSIC PROMPT RULES:
- Must be 600-800 characters, English only.
- Must include: genre/subgenre, mood arc, instruments, vocal style with effects, tempo (BPM range), overall vibe, production notes.
- Be specific about instruments (e.g., "warm fingerpicked acoustic guitar" not just "guitar").
- Include dynamics and energy progression.

DUET RULES (only when song_type is "Duet"):
- Use voice tags: (male), (female), (both)
- Put the voice tag on its own line BEFORE the lyrics lines it applies to.
- Example:
  [Verse 1]
  (male)
  I walked alone tonight
  Through empty streets so cold
  (female)
  I saw you from afar
  A story left untold
  [Chorus]
  (both)
  We found our way back home
- Balance male and female parts roughly equally.
- Specify both vocal styles in music_prompt (e.g., "warm male tenor verses, soaring female soprano chorus").

TITLE RULES:
- 2-4 words maximum.
- Must NOT be a line from the lyrics.
- Avoid all banned words.
- Should capture the song's essence.`;

export interface LyricsRequest {
  prompt: string;
  genre?: string;
  mood?: string;
  type?: 'solo' | 'duet';
  avoid?: string[];
}

export interface LyricsResult {
  title: string;
  song_type: 'Solo' | 'Duet';
  music_prompt: string;
  lyrics: string;
  // Legacy field for backwards compatibility
  style: string;
}

export async function generateLyricsWithAI(request: string | LyricsRequest): Promise<LyricsResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured in .env');
  }

  // Handle both string and object input for backwards compatibility
  let params: LyricsRequest;
  if (typeof request === 'string') {
    params = { prompt: request };
  } else {
    params = request;
  }

  const openai = new OpenAI({ apiKey });

  // Build banned words list
  const bannedWords = [...DEFAULT_BANNED_WORDS, ...(params.avoid || [])];

  // Build user message
  const userMessage = buildUserMessage(params, bannedWords);

  // JSON Schema for structured output
  const jsonSchema = {
    name: "suno_song",
    strict: true,
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        title: {
          type: "string",
          description: "Song title, 2-4 words, not a lyric line"
        },
        song_type: {
          type: "string",
          enum: ["Solo", "Duet"],
          description: "Whether this is a solo or duet song"
        },
        music_prompt: {
          type: "string",
          description: "Detailed music style prompt, 600-800 characters"
        },
        lyrics: {
          type: "string",
          description: "Full song lyrics with section tags"
        }
      },
      required: ["title", "song_type", "music_prompt", "lyrics"]
    }
  };

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
    response_format: {
      type: "json_schema",
      json_schema: jsonSchema
    },
    temperature: 0.9,
    max_tokens: 2000,
  });

  const content = completion.choices[0].message.content;
  if (!content) throw new Error('Failed to generate lyrics');

  const parsed = JSON.parse(content);

  // Validate and clean up the response
  const result: LyricsResult = {
    title: String(parsed.title || 'Untitled').slice(0, 50),
    song_type: parsed.song_type === 'Duet' ? 'Duet' : 'Solo',
    music_prompt: String(parsed.music_prompt || ''),
    lyrics: cleanLyrics(String(parsed.lyrics || '')),
    // Legacy 'style' field for backwards compatibility with existing UI
    style: extractStyleTags(String(parsed.music_prompt || ''))
  };

  // Validate music_prompt length
  if (result.music_prompt.length < 100) {
    console.warn('Music prompt too short, may affect generation quality');
  }

  return result;
}

function buildUserMessage(params: LyricsRequest, bannedWords: string[]): string {
  const lines: string[] = [];

  lines.push(`Theme/concept: ${params.prompt}`);

  if (params.genre) {
    lines.push(`Genre: ${params.genre}`);
  }

  if (params.mood) {
    lines.push(`Mood: ${params.mood}`);
  }

  const songType = params.type?.toLowerCase() === 'duet' ? 'Duet' : 'Solo';
  lines.push(`Type: ${songType}`);

  if (bannedWords.length > 0) {
    lines.push(`Words to avoid: ${bannedWords.join(', ')}`);
  }

  lines.push('');
  lines.push('Generate a complete song with title, music_prompt (600-800 chars), and full lyrics.');

  return lines.join('\n');
}

function cleanLyrics(lyrics: string): string {
  return lyrics
    // Normalize line breaks
    .replace(/\r\n/g, '\n')
    // Remove excessive blank lines (more than 2)
    .replace(/\n{3,}/g, '\n\n')
    // Ensure section tags are on their own line
    .replace(/(\[[^\]]+\])\s*(?!\n)/g, '$1\n')
    // Trim
    .trim();
}

function extractStyleTags(musicPrompt: string): string {
  // Extract key style words from the music prompt for backwards compatibility
  const keywords: string[] = [];

  // Common genre/style patterns to extract
  const patterns = [
    /\b(pop|rock|indie|folk|country|jazz|blues|r&b|hip-hop|rap|electronic|edm|house|techno|classical|orchestral|acoustic|metal|punk|soul|funk|reggae|latin|disco)\b/gi,
    /\b(upbeat|mellow|energetic|chill|intense|soft|powerful|gentle|aggressive|calm|dreamy|dark|bright|warm|cold)\b/gi,
    /\b(ballad|anthem|banger|groove|vibe)\b/gi,
  ];

  for (const pattern of patterns) {
    const matches = musicPrompt.match(pattern);
    if (matches) {
      keywords.push(...matches.map(m => m.toLowerCase()));
    }
  }

  // Remove duplicates and join
  return [...new Set(keywords)].slice(0, 10).join(', ');
}

// Legacy function for backwards compatibility
export async function generateLyrics(prompt: string): Promise<{ title: string; lyrics: string; style: string }> {
  const result = await generateLyricsWithAI(prompt);
  return {
    title: result.title,
    lyrics: result.lyrics,
    style: result.style
  };
}
