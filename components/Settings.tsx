import { IoCheckmarkCircleOutline, IoTrashOutline } from "react-icons/io5";
import { MutableRefObject } from "react";

const actions = [
  { name: "Save", icon: IoCheckmarkCircleOutline },
  { name: "Clear", icon: IoTrashOutline },
];

export default function Settings({
  matchCount,
  setMatchCount,
  apiKey,
  setApiKey,
  close,
}: {
  matchCount: number;
  setMatchCount: React.Dispatch<React.SetStateAction<number>>;
  apiKey: string;
  setApiKey: React.Dispatch<React.SetStateAction<string>>;
  close: (
    focusableElement?:
      | HTMLElement
      | MutableRefObject<HTMLElement | null>
      | undefined
  ) => void;
}) {
  const handleSave = () => {
    localStorage.setItem("LWW_KEY", apiKey);
    localStorage.setItem("LW_MATCH_COUNT", matchCount.toString());
    close();
  };

  const handleClear = () => {
    localStorage.removeItem("LW_KEY");
    localStorage.removeItem("LW_MATCH_COUNT");

    setApiKey("");
    setMatchCount(5);
  };

  return (
    <div className="w-screen max-w-md flex-auto overflow-hidden rounded-xl bg-white text-sm leading-6 shadow-2xl ring-1 ring-gray-900/5">
      <div className="p-4">
        <div className="w-[340px] sm:w-[400px] px-2 py-3 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              No. of posts
            </label>
            <div className="mt-2">
              <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-md">
                <input
                  type="number"
                  min={1}
                  max={10}
                  defaultValue={5}
                  id="matchCount"
                  onChange={(e) => setMatchCount(Number(e.target.value))}
                  className="block flex-1 border-0 bg-transparent py-1.5 px-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>

          <div className="col-span-full">
            <label
              htmlFor="OpenAI API Key"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              OpenAI API Key
            </label>
            <div className="my-2">
              <input
                type="password"
                name="apiKey"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                }}
                className="block w-full rounded-md border-0 text-gray-900 px-3 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:py-1.5 sm:text-sm sm:leading-6"
              />
            </div>
            <p className="mt-1 text-xs leading-6 text-gray-600">
              Don&apos;t know your API key? Get it{" "}
              <a
                href="https://openai.com/product"
                className="underline hover:opacity-50"
              >
                here
              </a>
              .
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
        {actions.map((item) => (
          <button
            key={item.name}
            type={item.name === "Save" ? "submit" : "button"}
            className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-200 transition duration-180 ease-out hover:ease-in"
            onClick={item.name === "Save" ? handleSave : handleClear}
          >
            <item.icon
              className="h-5 w-5 flex-none text-gray-400"
              aria-hidden="true"
            />
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
