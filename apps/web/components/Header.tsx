"use client";

import { useState } from "react";
import { Bell, Plus } from "lucide-react";
import { MobileSidebarTrigger } from "./Sidebar";
import NotificationsDrawer from "./NotificationsDrawer";
import { useAuth } from "./auth/AuthProvider";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const Header = () => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { user } = useAuth();
  const firstName =
    user?.name?.trim().split(/\s+/)[0] ||
    user?.email?.split("@")[0] ||
    "there";

  return (
    <>
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
      <header className="flex h-16 items-center justify-between border-b border-app-border px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <MobileSidebarTrigger />
          <div className="hidden md:block">
            <h2 className="text-xl font-semibold">
              {greeting()}, {firstName} 👋
            </h2>
            <p className="text-xs text-zinc-500">
              Run your entire business from one intelligent workspace
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 rounded-lg border border-app-border bg-app-card px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-app-card-hover">
            <Plus size={16} /> Create
          </button>
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="relative rounded-full p-2 text-zinc-400 hover:bg-app-card hover:text-white"
          >
            <Bell size={20} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-primary ring-2 ring-app-bg"></span>
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
