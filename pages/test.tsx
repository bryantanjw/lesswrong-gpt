import { useState, useEffect } from "react";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";

const ArticleCard = () => (
  <div className="bg-white rounded-lg shadow-md p-4 m-2">
    <h2 className="text-lg font-bold mb-2">Article 2</h2>
    <p className="text-gray-800">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis
      molestie diam, a bibendum risus sagittis in. Nunc at elementum odio. Sed
      auctor vestibulum felis, vel convallis lorem pellentesque in.
    </p>
  </div>
);

export default function Example() {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [animationState, setAnimationState] = useState("initial");

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const results = await fetchArticles(searchInput);
    setAnimationState("searchSubmitted");
    setSearchResults(results);
  };

  useEffect(() => {
    if (animationState === "searchSubmitted") {
      setTimeout(() => setAnimationState("resultsVisible"), 500);
    }
  }, [animationState]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Head>
        <title>Article Search</title>
      </Head>
      <AnimatePresence>
        {animationState === "initial" && (
          <motion.h1
            className="text-center text-5xl font-bold mt-10"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            Article Search
          </motion.h1>
        )}
      </AnimatePresence>
      <motion.form
        onSubmit={handleSearchSubmit}
        className={`w-full flex justify-center mt-10 transition-all ${
          animationState !== "initial" ? "-mt-20" : ""
        }`}
      >
        <input
          type="text"
          value={searchInput}
          onChange={handleInputChange}
          className="bg-white w-full max-w-md px-4 py-2 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Search articles..."
        />
      </motion.form>
      <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {animationState === "resultsVisible" &&
          searchResults.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
      </div>
    </div>
  );
}
