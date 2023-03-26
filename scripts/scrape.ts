import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import { encode } from "gpt-3-encoder";
import { LWPost, LWChunk, LWJSON } from "@/types";

const CHUNK_SIZE = 200;

const getPosts = async (): Promise<LWPost[]> => {
  console.log("Scraping LessWrong...");
  const API_BASE_URL = "https://www.lesswrong.com/graphql";
  const query = `
    query {
      posts(input: {terms: {view: "top"}}) {
        results {
          title
          url: pageUrl
          author
          date: postedAt
          voteCount
          content: htmlBody
        }
      }
    }
  `;

  const variables = {};
  const headers = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0",
  };
  const data = JSON.stringify({ query, variables });
  const response = await axios.post(API_BASE_URL, data, { headers });
  const posts = response.data.data.posts.results;

  for (const post of posts) {
    const { content, date } = post;

    if (content !== null) {
      // Clean html body
      const $ = cheerio.load(content);
      const text = $("body").text().replace(/\s\s+/g, " ").trim();

      // Format date
      const options = {
        month: "long",
        day: "numeric",
        year: "numeric",
      } as const;
      const formattedDate = new Date(date).toLocaleString("en-US", options);

      post.date = formattedDate;
      post.content = text;
      post.length = text.length;
      post.tokens = 0;
      post.chunks = [];
    } else {
      // Remove post if it has no content
      const indexToRemove = posts.indexOf(post);
      posts.splice(indexToRemove, 1);
    }
  }

  console.log("Done scraping LessWrong. ", posts.length, "posts found");
  return posts;
};

const chunkPost = async (post: LWPost) => {
  const { title, url, author, date, content } = post;

  let postTextChunks = [];

  if (encode(content).length > CHUNK_SIZE) {
    const split = content.split(". ");
    let chunkText = "";

    for (let i = 0; i < split.length; i++) {
      const sentence = split[i];
      const sentenceTokenLength = encode(sentence);
      const chunkTextTokenLength = encode(chunkText).length;

      if (chunkTextTokenLength + sentenceTokenLength.length > CHUNK_SIZE) {
        postTextChunks.push(chunkText);
        chunkText = "";
      }

      if (
        sentence[sentence.length - 1] &&
        sentence[sentence.length - 1].match(/[a-z0-9]/i)
      ) {
        chunkText += sentence + ". ";
      } else {
        chunkText += sentence + " ";
      }
    }

    postTextChunks.push(chunkText.trim());
  } else {
    postTextChunks.push(content.trim());
  }

  const postChunks = postTextChunks.map((text) => {
    const trimmedText = text.trim();

    const chunk: LWChunk = {
      post_title: title,
      post_url: url,
      post_author: author,
      post_date: date,
      content: trimmedText,
      content_length: trimmedText.length,
      content_tokens: encode(trimmedText).length,
      embedding: [],
    };

    return chunk;
  });

  if (postChunks.length > 1) {
    for (let i = 0; i < postChunks.length; i++) {
      const chunk = postChunks[i];
      const prevChunk = postChunks[i - 1];

      if (chunk.content_tokens < 100 && prevChunk) {
        prevChunk.content += " " + chunk.content;
        prevChunk.content_length += chunk.content_length;
        prevChunk.content_tokens += chunk.content_tokens;
        postChunks.splice(i, 1);
        i--;
      }
    }
  }

  const chunkedSection: LWPost = {
    ...post,
    chunks: postChunks,
  };

  return chunkedSection;
};

(async () => {
  const posts = await getPosts();
  const chunkedPosts = [];
  for (let i = 0; i < 318; i++) {
    const post = posts[i];
    const chunkedPost = await chunkPost(post);
    chunkedPosts.push(chunkedPost);
    console.log("Chunked post", i + 1, "of", posts.length);
  }

  const todayDate = new Date().toISOString().split("T")[0];

  const json: LWJSON = {
    current_date: todayDate,
    url: "https://www.lesswrong.com/",
    length: posts.reduce((acc, essay) => acc + essay.length, 0),
    tokens: posts.reduce((acc, essay) => acc + essay.tokens, 0),
    posts: chunkedPosts,
  };

  console.log("Writing to JSON file at scripts/lw.json...");
  fs.writeFileSync("scripts/lw.json", JSON.stringify(json));
  console.log("Done!");
})();
