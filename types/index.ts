export enum OpenAIModel {
  DAVINCI_TURBO = "gpt-3.5-turbo",
}

export type LWPost = {
  title: string;
  url: string;
  author: string;
  date: string;
  voteCount: number;
  content: string;
  length: number;
  tokens: number;
  chunks: LWChunk[];
};

export type LWChunk = {
  post_title: string;
  post_url: string;
  post_author: string;
  post_date: string | undefined;
  content: string;
  content_length: number;
  content_tokens: number;
  embedding: number[];
};

export type LWJSON = {
  current_date: string;
  url: string;
  length: number;
  tokens: number;
  posts: LWPost[];
};
