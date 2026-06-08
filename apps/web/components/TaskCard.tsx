import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  MessageSquare,
  MoreVertical,
  Edit,
  Eye,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import DeleteModal from "./DeleteModal";
import { useRouter } from "next/navigation";

export type Priority = "Low" | "Medium" | "High";

export interface TaskCardProps {
  priority: Priority;
  date: string;
  title: string;
  description: string;
  progress: number; // 0 to 100
  assignees?: string[]; // Array of image URLs
  comments?: number;
  image?: string; // Optional cover image URL
  progressColor?: string;
  style?: React.CSSProperties; // Add style for drag and drop
  className?: string; // Add className for drag and drop
  onPointerDown?: (e: React.PointerEvent) => void; // Add onPointerDown for drag and drop
}

const getPriorityStyles = (priority: Priority) => {
  switch (priority) {
    case "Low":
      return "bg-[#354A3A] text-[#A6DDB0]";
    case "Medium":
      return "bg-[#595941] text-[#FCFF96]";
    case "High":
      return "bg-[#523A3A] text-[#FF7676]";
    default:
      return "bg-zinc-800 text-zinc-400";
  }
};

export default function TaskCard({
  priority = "Medium",
  date,
  title,
  description,
  progress,
  assignees = [],
  comments = 0,
  image,
  progressColor = "bg-linear-to-r from-cyan-400 to-blue-500", // Default
  style,
  className,
  onPointerDown,
}: TaskCardProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      style={style}
      className={`flex flex-col gap-3 group relative w-full cursor-pointer overflow-visible rounded-lg bg-[#161616] p-2 text-white shadow ring-1 ring-white/5 transition-all duration-300 hover:bg-[#232323] hover:shadow-cyan-500/10 hover:ring-white/10 ${className}`}
      onPointerDown={onPointerDown}
      onClick={() => router.push(`/projects/cloud-migration-suite`)}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span
            className={`rounded-sm p-1 text-[8px] font-medium tracking-wide ${getPriorityStyles(
              priority,
            )}`}
          >
            {priority}
          </span>
          <span className="rounded-sm bg-zinc-800/80 p-1 text-[8px] font-medium text-zinc-400 transition-colors group-hover:bg-zinc-700/80 group-hover:text-zinc-300">
            {date}
          </span>
        </div>
      </div>

      {/* Optional Cover Image */}
      {image && (
        <div className="relative h-18 w-full overflow-hidden rounded-lg bg-zinc-800/50">
          <Image
            src={image}
            alt={title}
            fill
            className="transform object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      {/* Content */}
      <div className="space-y-2">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug tracking-tight text-white/90 transition-colors group-hover:text-white">
          {title}
        </h3>
        <p className="line-clamp-3 text-xs leading-relaxed text-zinc-500 transition-colors group-hover:text-zinc-400">
          {description}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className={`relative h-full rounded-full transition-all duration-500 ease-out group-hover:shadow-[0_0_10px_rgba(34,211,238,0.4)] ${progressColor}`}
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/5 pt-5 relative">
        {/* Assignees (Stacked Avatars) */}
        <div className="flex items-center -space-x-1">
          {assignees.map((avatar, i) => (
            <div
              key={i}
              className="relative h-3 w-3 overflow-hidden rounded-full border-2 border-[#1C1C1C] bg-zinc-800 shadow-sm transition-transform duration-300 group-hover:translate-x-1"
              style={{ zIndex: assignees.length - i }}
            >
              <Image
                src={avatar}
                alt={`Assignee ${i + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
          {/* Add Button / Placeholder */}
          <div
            className="relative flex h-3 w-3 items-center justify-center rounded-full border-2 border-[#1C1C1C] bg-linear-to-br from-[#5B4DFF] to-[#8F84FF] text-xs font-bold text-white shadow-lg transition-transform duration-300 group-hover:translate-x-1"
            style={{ zIndex: 0 }}
          >
            +
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 text-zinc-500 relative">
          <div className="flex items-center gap-0.5 transition-colors group-hover:text-zinc-300">
            <MessageSquare size={12} strokeWidth={2} />
            <span className="text-xs font-medium">{comments}</span>
          </div>
          <button
            ref={buttonRef}
            onClick={(e) => {
              e.stopPropagation(); // Prevent drag start
              e.preventDefault(); // Prevent default link behavior if any
              setIsMenuOpen(!isMenuOpen);
            }}
            onPointerDown={(e) => e.stopPropagation()} // Important for dnd-kit
            className="rounded-full p-1 transition-colors hover:bg-white/10 hover:text-white"
          >
            <MoreVertical size={12} />
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div
              ref={menuRef}
              className="absolute right-0 bottom-full mb-2 w-48 rounded-xl bg-[#1C1C1C] border border-white/10 p-1 shadow-2xl z-50 overflow-hidden"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
              onPointerDown={(e) => e.stopPropagation()}
            >
              <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
                <Edit size={16} /> Edit
              </button>
              <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
                <Eye size={16} /> View details
              </button>
              <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
                <MoreHorizontal size={16} /> More
              </button>
              <div className="my-1 h-px bg-white/10" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
              >
                <Trash2 size={16} /> Delete task
              </button>
            </div>
          )}
        </div>
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          // Handle delete logic here
        }}
        title="Are you sure you want to delete this task?"
      />
    </div>
  );
}
