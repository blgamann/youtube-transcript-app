export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
// @ts-expect-error using replaced ytdl-core
import ytdl from "ytdl-core";

function extractVideoId(youtubeUrl: string): string | null {
  try {
    const url = new URL(youtubeUrl);
    if (url.hostname === "youtu.be") {
      return url.pathname.slice(1);
    } else if (url.hostname.includes("youtube.com")) {
      return url.searchParams.get("v");
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  const { youtubeUrl } = await request.json();
  if (!youtubeUrl) {
    return NextResponse.json(
      { error: "No YouTube URL provided" },
      { status: 400 }
    );
  }

  const videoId = extractVideoId(youtubeUrl);
  if (!videoId) {
    return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
  }

  try {
    const info = await ytdl.getInfo(videoId);
    // ytdl-core v4 이상에서는 player_response를 여기서 직접 참조
    const playerResponse = info.player_response;

    if (!playerResponse) {
      return NextResponse.json(
        { error: "No player_response found in video info." },
        { status: 500 }
      );
    }

    const captions = playerResponse?.captions?.playerCaptionsTracklistRenderer;
    if (!captions) {
      return NextResponse.json({ videoId, languages: [] });
    }

    const captionTracks = captions.captionTracks || [];
    // const translationLanguages = captions.translationLanguages || [];

    const baseLanguages = captionTracks.map(
      (track: { languageCode: string; name?: { simpleText?: string } }) => ({
        lang: track.languageCode,
        language_name: track.name?.simpleText || track.languageCode,
      })
    );

    const languages = [...baseLanguages];
    return NextResponse.json({ videoId, languages });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch languages",
      },
      { status: 500 }
    );
  }
}
