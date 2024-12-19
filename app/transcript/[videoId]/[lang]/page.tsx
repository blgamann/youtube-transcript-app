import { notFound } from "next/navigation";

interface TranscriptItem {
  text: string;
  duration: number;
  start: number;
}

interface PageProps {
  params: {
    videoId: string;
    lang: string;
  };
}

async function getSubtitles(
  videoId: string,
  lang: string
): Promise<TranscriptItem[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/get-subtitles`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ videoId, lang }),
      cache: "no-store", // Always fetch fresh data on first load
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch subtitles");
  }

  const data = await res.json();
  return data.transcript;
}

export default async function TranscriptPage({ params }: PageProps) {
  const { videoId, lang } = params;

  if (!videoId || !lang) {
    return notFound();
  }

  let transcript: TranscriptItem[];
  try {
    transcript = await getSubtitles(videoId, lang);
  } catch (error: any) {
    return (
      <div className="p-4 max-w-xl mx-auto">
        <div className="space-y-4">
          <h2 className="text-red-500 text-xl font-semibold">
            자막을 불러오는 데 실패했습니다.
          </h2>
          <p className="text-sm text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  // fetch는 서버에서 한 번만 일어난다. 이제 클라이언트 컴포넌트로 transcript를 props로 전달.
  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      {/* 클라이언트 컴포넌트에 transcript 전달 */}
      {/* NEXT_PUBLIC_BASE_URL가 설정되어 있다면, API 호출은 서버에서 이미 끝났으므로 재호출 없음 */}
      {/*
        transcript 데이터를 클라이언트 컴포넌트로 넘겨서 toast 및 copy 기능 구현
      */}
      {/* transcript와 videoId, lang도 같이 전달 */}
      <TranscriptClient transcript={transcript} videoId={videoId} lang={lang} />
    </div>
  );
}

// 클라이언트 컴포넌트를 import (아래에서 구현)
import TranscriptClient from "./transcript-client";
