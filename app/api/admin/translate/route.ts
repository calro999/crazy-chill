import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    if (!text) {
      return NextResponse.json({ translatedText: '' });
    }

    // MyMemory API has a 500-character limit per request. 
    // We split the text into chunks of max 450 characters based on newlines.
    const chunks: string[] = [];
    let currentChunk = '';
    const lines = text.split('\n');

    for (const line of lines) {
      if (currentChunk.length + line.length + 1 > 450) {
        if (currentChunk) chunks.push(currentChunk);
        currentChunk = line;
      } else {
        currentChunk = currentChunk ? currentChunk + '\n' + line : line;
      }
    }
    if (currentChunk) chunks.push(currentChunk);

    const translatedChunks = [];
    for (const chunk of chunks) {
      if (!chunk.trim()) {
        translatedChunks.push(chunk);
        continue;
      }
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=ja|en`);
      const data = await res.json();
      translatedChunks.push(data.responseData?.translatedText || chunk);
    }

    return NextResponse.json({ translatedText: translatedChunks.join('\n') });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
