"use client";

import { useState } from "react";
import SubtitleForm from "@/components/subtitle-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface LanguageItem {
  lang: string;
  language_name: string;
}

export default function Page() {
  const [languages, setLanguages] = useState<LanguageItem[]>([]);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (url: string) => {
    setLoading(true);
    setError(null);
    setLanguages([]);
    setVideoId(null);

    try {
      const res = await fetch("/api/get-languages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ youtubeUrl: url }),
      });
      const data = await res.json();
      if (res.ok && data.languages && data.videoId) {
        setLanguages(data.languages);
        setVideoId(data.videoId);
      } else {
        setError(data.error || "언어 목록을 가져오는 데 실패했습니다.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "에러가 발생했습니다.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-start justify-center pt-[25vh]">
      <div className="p-4 w-full max-w-xl space-y-4">
        <h1 className="text-2xl font-bold">YouTube Transcript</h1>
        <SubtitleForm onSubmit={handleSubmit} />
        {loading && <p>로딩 중...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {videoId && languages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>가능한 자막 언어</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {languages.map((item, idx) => (
                  <div key={idx}>
                    <Button variant="outline" asChild>
                      <a
                        href={`/transcript/${videoId}/${item.lang}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.language_name}
                      </a>
                    </Button>
                    {idx < languages.length - 1 && (
                      <Separator className="my-2" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
