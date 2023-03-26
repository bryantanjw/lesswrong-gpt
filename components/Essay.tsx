import { LWChunk } from "@/types";

interface EssayProps {
  chunk: LWChunk;
}

export const Essay = ({ chunk }: EssayProps) => {
  const { post_title, post_date, post_url, content } = chunk;
  return (
    <a
      href={post_url}
      target="_blank"
      className="mt-4 group relative block h-64 sm:h-80 lg:h-auto"
    >
      <span className="absolute inset-0 border-2 border-dashed border-black rounded-lg border-gray-600"></span>

      <div className="relative px-6 py-7 flex flex-col h-full transform border border-gray-600 rounded-lg bg-white transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2">
        <div className="font-bold text-lg">{post_title}</div>
        <div className="py-2 text-gray-800 text-sm">{post_date}</div>
        <p className="mt-1 text-ellipsis overflow-hidden">{content}</p>
      </div>
    </a>
  );
};
