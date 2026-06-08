import React, { useEffect } from "react";
import {
  X,
  CheckCircle2,
  MessageSquare,
  AlertCircle,
  Calendar,
} from "lucide-react";

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const NOTIFICATIONS = [
  {
    id: 1,
    type: "message",
    title: "New message from Sarah",
    description: "Hey, can you review the latest designs for the dashboard?",
    time: "5m ago",
    unread: true,
  },
  {
    id: 2,
    type: "alert",
    title: "Project Alpha deployment",
    description: "Deployment completed successfully to production environment.",
    time: "2h ago",
    unread: true,
  },
  {
    id: 3,
    type: "calendar",
    title: "Meeting with Design Team",
    description: "Scheduled for tomorrow at 10:00 AM.",
    time: "5h ago",
    unread: false,
  },
  {
    id: 4,
    type: "success",
    title: "Weekly report generated",
    description: "Your weekly performance report is ready to download.",
    time: "1d ago",
    unread: false,
  },
];

export default function NotificationsDrawer({
  isOpen,
  onClose,
}: NotificationsDrawerProps) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const getIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare size={16} className="text-blue-400" />;
      case "success":
        return <CheckCircle2 size={16} className="text-emerald-400" />;
      case "alert":
        return <AlertCircle size={16} className="text-amber-400" />;
      case "calendar":
        return <Calendar size={16} className="text-purple-400" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-zinc-600" />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[90%] sm:w-[380px] flex flex-col bg-[#0A0A0A] border-l border-[#272727] shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#272727] px-6 py-5">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-medium tracking-tight text-white">
              Notifications
            </h2>
            <span className="flex h-5 items-center justify-center rounded-full bg-blue-500/10 px-2 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20">
              2 new
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-all hover:bg-[#161616] hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#272727]">
          <div className="flex flex-col gap-2">
            {NOTIFICATIONS.map((notification) => (
              <div
                key={notification.id}
                className={`group relative flex items-start gap-4 rounded-2xl border border-transparent p-4 transition-all hover:bg-[#161616] cursor-pointer ${
                  notification.unread ? "bg-[#161616]/40" : ""
                }`}
              >
                {notification.unread && (
                  <span className="absolute left-1.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-blue-500 opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100" />
                )}

                <div className="flex mt-0.5 h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1A1A1A] border border-[#272727] shadow-sm">
                  {getIcon(notification.type)}
                </div>

                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-medium text-zinc-100">
                      {notification.title}
                    </span>
                    <span className="text-[11px] font-medium text-zinc-500 shrink-0 mt-0.5">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed max-w-[240px]">
                    {notification.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#272727] p-4 bg-[#0A0A0A]/95 backdrop-blur">
          <button className="w-full flex items-center justify-center rounded-xl bg-[#161616] border border-[#272727] shadow-sm py-2.5 text-sm font-medium text-zinc-300 transition-all hover:bg-[#202020] hover:text-white hover:border-[#333]">
            Mark all as read
          </button>
        </div>
      </div>
    </>
  );
}
