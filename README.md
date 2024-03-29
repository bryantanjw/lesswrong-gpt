# LessWrong GPT

AI-powered search and chat for the LessWrong forum

[![LessWrong GPT](./public/lw.png)](https://lesswrong.com/)


https://github.com/bryantanjw/lesswrong-gpt/assets/34775928/b4228eed-f2eb-456f-80cf-8f4bbdc0fb1c


## Dataset

The dataset is a CSV file containing all text & embeddings used.

Download it [here](https://drive.google.com/file/d/1FXYg5TlY6-oMFeCMS0nOsZi7YJjXLBKa/view?usp=sharing).

## How It Works

### Search

Search was created with [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings) (`text-embedding-ada-002`).

First, we loop over the essays and generate embeddings for each chunk of text.

Then in the app we take the user's search query, generate an embedding, and use the result to find the most similar essays from the forum.

The comparison is done using cosine similarity across our database of vectors.

Our database is a Postgres database with the [pgvector](https://github.com/pgvector/pgvector) extension hosted on [Supabase](https://supabase.com/).

Results are ranked by similarity score and returned to the user.

### Chat

Chat builds on top of search. It uses search results to create a prompt that is fed into GPT-3.5-turbo.

This allows for a chat-like experience where the user can ask questions about the forum and get answers.

## Running Locally

Here's a quick overview of how to run it locally.

### Requirements

1. Set up OpenAI

You'll need an OpenAI API key to generate embeddings.

2. Set up Supabase and create a database

Note: You don't have to use Supabase. Use whatever method you prefer to store your data. But I like Supabase and think it's easy to use.

There is a schema.sql file in the root of the repo that you can use to set up the database.

Run that in the SQL editor in Supabase as directed.

I recommend turning on Row Level Security and setting up a service role to use with the app.

### Repo Setup

3. Clone repo

```bash
git clone https://github.com/bryantanjw/lesswrong-gpt.git
```

4. Install dependencies

```bash
npm i
```

5. Set up environment variables

Create a .env.local file in the root of the repo with the following variables:

```bash
OPENAI_API_KEY=

NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

### Dataset

6. Run scraping script

```bash
npm run scrape
```

This pulls the top 5000 posts from the LessWrong website, using their [GraphQL endpoint](https://www.lesswrong.com/graphiql), and saves them to a json file. For simplicity and cost, this project only later embeds the top 300 posts.

7. Run embedding script

```bash
npm run embed
```

This reads the json file, generates embeddings for each chunk of text, and saves the results to your database.

There is a 100ms delay between each request to avoid rate limiting.

This process will take 2-3 hours.

### App

8. Run app

```bash
npm run dev
```

## Credits

This project was inspired by [McKay Wrigley](https://twitter.com/mckaywrigley)'s Wait But Why GPT
