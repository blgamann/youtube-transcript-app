import { NextRequest, NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";

export async function POST(request: NextRequest) {
  const { videoId, lang } = await request.json();
  if (!videoId || !lang) {
    return NextResponse.json(
      { error: "videoId and lang are required" },
      { status: 400 }
    );
  }

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId, {
      lang: lang,
    });
    return NextResponse.json({ transcript });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch transcript" },
      { status: 500 }
    );
  }
}
