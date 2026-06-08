"use client";

export const MemberAvatar = ({
  initial,
  color,
  size = "sm",
}: {
  initial: string;
  color: string;
  size?: "sm" | "lg";
}) => {
  const dim = size === "lg" ? "h-16 w-16" : "h-8 w-8";
  const svgSize = size === "lg" ? 40 : 24;
  const mt = size === "lg" ? "mt-4" : "mt-2.5";

  return (
    <div
      className={`flex ${dim} shrink-0 items-center justify-center overflow-hidden rounded-full relative`}
      style={{ background: color }}
    >
      <svg
        width={svgSize}
        height={svgSize}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${mt} relative z-10`}
      >
        <path
          d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
          fill="#ff748e"
        />
        <path
          d="M12 13C8.68629 13 6 15.6863 6 19V21H18V19C18 15.6863 15.3137 13 12 13Z"
          fill="#0ea5e9"
        />
      </svg>
      <span className="sr-only">{initial}</span>
    </div>
  );
};

export const LetterAvatar = ({ initial }: { initial: string }) => (
  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-2xl font-bold text-white">
    {initial}
  </div>
);
