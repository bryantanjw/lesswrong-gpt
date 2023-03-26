import Head from "next/head";
import { Answer } from "@/components/Answer/Answer";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import Settings from "@/components/Settings";
import { LWChunk } from "@/types";
import { Popover, Transition } from "@headlessui/react";
import { IoArrowForward, IoSearchOutline } from "react-icons/io5";
import endent from "endent";
import { Fragment, KeyboardEvent, useEffect, useRef, useState } from "react";
import { Essay } from "@/components/Essay";

import styles from "/styles/Home.module.css";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState<string>("");
  const [chunks, setChunks] = useState<LWChunk[]>([]);
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [matchCount, setMatchCount] = useState<number>(5);
  const [apiKey, setApiKey] = useState<string>("");

  const handleAnswer = async () => {
    if (!apiKey) {
      alert("Please enter an API key.");
    }

    if (!query) {
      return;
    }

    setAnswer("");
    setChunks([]);

    setLoading(true);

    const searchResponse = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, apiKey, matches: matchCount }),
    });

    if (!searchResponse.ok) {
      setLoading(false);
      throw new Error(searchResponse.statusText);
    }

    const results: LWChunk[] = await searchResponse.json();

    setChunks(results);

    const prompt = endent`
    Use the following essays to provide an answer to the query: "${query}"

    ${results?.map((d: any) => d.content).join("\n\n")}
    `;

    const answerResponse = await fetch("/api/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, apiKey }),
    });

    if (!answerResponse.ok) {
      setLoading(false);
      throw new Error(answerResponse.statusText);
    }

    const data = answerResponse.body;

    if (!data) {
      return;
    }

    setLoading(false);

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setAnswer((prev) => prev + chunkValue);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAnswer();
    }
  };

  useEffect(() => {
    if (matchCount > 10) {
      setMatchCount(10);
    } else if (matchCount < 1) {
      setMatchCount(1);
    }
  }, [matchCount]);

  useEffect(() => {
    const LW_KEY = localStorage.getItem("LW_KEY");
    const LW_MATCH_COUNT = localStorage.getItem("LW_MATCH_COUNT");

    if (LW_KEY) {
      setApiKey(LW_KEY);
    }

    if (LW_MATCH_COUNT) {
      setMatchCount(parseInt(LW_MATCH_COUNT));
    }
  }, []);

  return (
    <div className="bg-white">
      <Head>
        <title>LessWrong-GPT</title>
        <meta
          name="description"
          content={`AI-powered chat for the LessWrong forum."`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col h-screen">
        <Navbar />

        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
            <svg
              className="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
              viewBox="0 0 1155 678"
            >
              <path
                fill="url(#45de2b6b-92d5-4d68-a6a0-9b9b2abad533)"
                fillOpacity=".3"
                d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
              />
              <defs>
                <linearGradient
                  id="45de2b6b-92d5-4d68-a6a0-9b9b2abad533"
                  x1="1155.49"
                  x2="-78.208"
                  y1=".177"
                  y2="474.645"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#9089FC" />
                  <stop offset={1} stopColor="#FF80B5" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="mx-auto max-w-2xl py-24 sm:py-28 lg:py-28">
            <div className="hidden sm:mb-8 sm:flex sm:justify-center">
              <Popover className="relative">
                <Popover.Button className="relative rounded-full py-1 px-3 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                  <span>Settings</span>{" "}
                  {!apiKey && (
                    <span className="font-semibold text-indigo-600">
                      Enter OpenAI API Key{" "}
                      <span aria-hidden="true">&rarr;</span>
                    </span>
                  )}
                </Popover.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
                    {({ close }) => (
                      <Settings
                        matchCount={matchCount}
                        setMatchCount={setMatchCount}
                        apiKey={apiKey}
                        setApiKey={setApiKey}
                        close={close}
                      />
                    )}
                  </Popover.Panel>
                </Transition>
              </Popover>
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                LessWrong-GPT
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                AI-powered search and chat for the LessWrong forum.
              </p>
            </div>

            <div className="mx-auto flex h-full w-full max-w-[750px] flex-col items-center px-3 pt-4 sm:pt-8">
              <div className="relative flex justify-end w-full gap-2">
                <div className="relative w-full mt-4 sm:mt-1 before:absolute before:bottom-0 before:left-1/4 before:-z-10 before:h-1/2 before:w-1/2 before:bg-gradient-to-r before:from-[#A6DAF5] before:to-[#BABEF1] before:blur-[5px]">
                  <IoSearchOutline className="absolute top-3 w-10 left-1 h-6 rounded-xl opacity-50 sm:left-3 sm:top-4 sm:h-6" />

                  <input
                    ref={inputRef}
                    disabled={!apiKey}
                    className="h-12 w-full rounded-2xl shadow-lg disabled:-z-10 disabled:bg-gray-200 border border-gray-300 pr-12 pl-11 disabled:border-slate-200 hover:border-gray-400 focus:border-gray-400 focus:outline-none sm:h-14 sm:py-2 sm:pr-16 sm:pl-16 sm:text-lg transition ease-out duration-300"
                    type="text"
                    placeholder="What are the hardest alignment problems?"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    data-tooltip-target="tooltip-default"
                  />
                </div>
                <button>
                  <IoArrowForward
                    onClick={handleAnswer}
                    className="rounded-2xl p-1 hover:cursor-pointer w-6 h-8 sm:h-8 sm:w-14 text-gray-800 transition hover:translate-x-1"
                  />
                </button>
              </div>

              {loading ? (
                <div className="mt-6 w-full animate-pulse mt-2">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded mt-2"></div>
                  <div className="h-4 bg-gray-300 rounded mt-2"></div>
                  <div className="h-4 bg-gray-300 rounded mt-2"></div>
                  <div className="h-4 bg-gray-300 rounded mt-2"></div>
                </div>
              ) : (
                answer && (
                  <div className="mt-10">
                    <Answer text={answer} />

                    <div className="mt-8">
                      {chunks.map((chunk, index) => (
                        <div
                          key={index}
                          className={styles.fadeIn}
                          style={{ animationDelay: `${5 + index * 0.001}s` }}
                        >
                          <Essay chunk={chunk} />
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
            <svg
              className="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
              viewBox="0 0 1155 678"
            >
              <path
                fill="url(#ecb5b0c9-546c-4772-8c71-4d3f06d544bc)"
                fillOpacity=".3"
                d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
              />
              <defs>
                <linearGradient
                  id="ecb5b0c9-546c-4772-8c71-4d3f06d544bc"
                  x1="1155.49"
                  x2="-78.208"
                  y1=".177"
                  y2="474.645"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#9089FC" />
                  <stop offset={1} stopColor="#FF80B5" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
