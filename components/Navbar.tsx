import Image from "next/image";

export const Navbar = () => {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        className="flex items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <div className="-m-1.5 p-1.5 flex items-center">
            <Image
              className="h-8 w-auto"
              src={"/lw.png"}
              alt=""
              width={32}
              height={32}
            />
            <span className="sr-only">LessWrong GPT</span>
          </div>
        </div>
        <div className="lg:flex lg:flex-1 lg:justify-end">
          <a
            href="https://www.lesswrong.com"
            className="group text-sm font-semibold leading-6 text-gray-900 flex items-center"
          >
            <span className="hidden md:inline-block">Go to LessWrong</span>{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2 h-6 w-6 transition group-hover:translate-x-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </nav>
    </header>
  );
};
