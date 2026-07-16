import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    if (!text) {
      return NextResponse.json({ translatedText: '' });
    }

    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ja|en`);
    const data = await res.json();
    
    return NextResponse.json({ translatedText: data.responseData.translatedText || text });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
