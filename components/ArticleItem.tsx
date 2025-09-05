import React from "react";

type Props = {
  title: string;
  url: string;
  score: number;
  topics: string[];
  source: string;
};

export default function ArticleItem({ title, url, score, topics, source }: Props) {
  return (
    <div className="mb-3">
      <a href={url} target="_blank" className="text-sky-400 hover:underline">{title}</a>
      <div className="text-xs text-slate-400">
        score {score.toFixed(1)} • {topics.join(", ") || "—"} • {source}
      </div>
    </div>
  );
}
