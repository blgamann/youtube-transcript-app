"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SubtitleFormProps {
  onSubmit: (url: string) => void;
}

export default function SubtitleForm({ onSubmit }: SubtitleFormProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder="YouTube 링크를 입력하세요"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Button type="submit">확인</Button>
    </form>
  );
}
