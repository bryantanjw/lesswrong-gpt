--  RUN 1st
create extension vector;

-- RUN 2nd
create table lw (
  id bigserial primary key,
  post_title text,
  post_url text,
  post_author text,
  post_date text,
  content text,
  content_length bigint,
  content_tokens bigint,
  embedding vector (1536)
);

-- RUN 3rd after running the scraping and embedding scripts
create or replace function lw_search (
  query_embedding vector(1536),
  similarity_threshold float,
  match_count int
)
returns table (
  id bigint,
  post_title text,
  post_url text,
  post_author text,
  post_date text,
  content text,
  content_length bigint,
  content_tokens bigint,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    lw.id,
    lw.post_title,
    lw.post_url,
    lw.post_author,
    lw.post_date,
    lw.content,
    lw.content_length,
    lw.content_tokens,
    1 - (lw.embedding <=> query_embedding) as similarity
  from lw
  where 1 - (lw.embedding <=> query_embedding) > similarity_threshold
  order by lw.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- RUN 4th
create index on lw
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);