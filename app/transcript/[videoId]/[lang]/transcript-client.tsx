"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";

interface TranscriptItem {
  text: string;
  duration: number;
  start: number;
}

interface TranscriptClientProps {
  transcript: TranscriptItem[];
  lang: string;
}

export default function TranscriptClient({
  transcript,
  lang,
}: TranscriptClientProps) {
  const { toast } = useToast();

  const handleCopy = useCallback(() => {
    const textToCopy = transcript.map((item) => item.text).join("\n");
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        toast({
          description: "자막이 클립보드에 복사되었습니다.",
          duration: 2000,
        });
      })
      .catch(() => {
        toast({
          variant: "destructive",
          description: "복사에 실패했습니다.",
          duration: 2000,
        });
      });
  }, [toast, transcript]);

  return (
    <div className="h-full flex flex-col gap-4 mt-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="secondary">{lang}</Badge>
          <Button onClick={handleCopy} variant="outline" size="sm">
            전체 복사
          </Button>
        </div>
        <Link href="/">
          <Button variant="outline">홈으로 돌아가기</Button>
        </Link>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)] rounded-md mt-8">
        <div className="space-y-4 p-4">
          {transcript.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <p className="text-sm leading-normal break-words whitespace-pre-wrap">
                {item.text}
              </p>
              {idx < transcript.length - 1 && <Separator className="my-2" />}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
