import React from "react";

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses: Record<NonNullable<AvatarProps["size"]>, string> = {
  xs: "h-6 w-6",
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

export function Avatar({ src, alt = "", size = "md", className = "" }: AvatarProps) {
  return (
    <div
      className={[
        "relative rounded-full overflow-hidden bg-gray-200 flex-shrink-0",
        sizeClasses[size],
        className,
      ].join(" ")}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-gray-500 text-xs font-medium uppercase">
          {alt.charAt(0) || "?"}
        </span>
      )}
    </div>
  );
}
