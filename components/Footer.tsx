import { IoLogoTwitter, IoLogoGithub } from "react-icons/io";

export const Footer = () => {
  return (
    <div className="flex py-2 items-center justify-center z-10">
      <div className="hidden sm:flex"></div>
      <div className="flex space-x-8">
        <a
          className="flex items-center hover:opacity-70 transition duration-180 ease-out hover:ease-in"
          href="https://twitter.com/bryantanjw"
          target="_blank"
          rel="noreferrer"
        >
          <IoLogoTwitter size={30} />
        </a>

        <a
          className="flex items-center hover:opacity-70 transition duration-180 ease-out hover:ease-in"
          href="https://github.com/bryantanjw/lesswrong-gpt"
          target="_blank"
          rel="noreferrer"
        >
          <IoLogoGithub size={30} />
        </a>
      </div>
    </div>
  );
};
