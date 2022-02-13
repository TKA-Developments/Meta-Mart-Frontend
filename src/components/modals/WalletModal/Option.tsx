import Image from "next/image";
import Link from "next/link";

type OptionProps = {
  id: string;
  header: string;
  subheader?: string;
  link: string | null;
  icon: string;
  active?: boolean;
  onClick?: () => void;
};

export const Option = ({
  id,
  header,
  subheader,
  link,
  icon,
  active = true,
  onClick,
}: OptionProps) => {
  const content = (
    <button
      className={
        `bg-[rgba(0,0,0,0.2)] focus:outline-none flex items-center gap-4 justify-between
        w-full px-4 py-3 rounded-xl border border-dark-700 hover:border-blue text-white` +
        (active ? "cursor-pointer" : "")
      }
      onClick={onClick}
    >
      <div className="flex flex-row items-center">
        <Image src={icon} alt="Icon" width="32px" height="32px" />
        <h3 className="text-sm font-bold ml-4">{header}</h3>
      </div>
      {subheader && <h4 className="text-xs">{subheader}</h4>}
    </button>
  );

  if (link) {
    return <a href={link}>{content}</a>;
  }

  return content;
};
