"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  TrendingUp,
  MessageSquare,
  Settings,
  Users,
  Search,
  Command,
  CreditCard,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  PanelLeftOpen,
  X,
} from "lucide-react";
import { FaMoneyBill } from "react-icons/fa";
import { useSidebar } from "./SidebarContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { collapsed, mobileOpen, toggleCollapsed, closeMobile } = useSidebar();

  const menuItems = [
    {
      title: "WORKSPACE",
      items: [
        { name: "Dashboard", icon: LayoutDashboard, href: "/" },
        { name: "Projects", icon: FolderKanban, href: "/projects" },
        { name: "Documents", icon: FileText, href: "/documents" },
      ],
    },
    {
      title: "OPERATIONS",
      items: [
        { name: "Invoicing & Payments", icon: CreditCard, href: "/invoicing" },
        { name: "Financials", icon: FaMoneyBill, href: "/financials" },
        { name: "Analytics", icon: TrendingUp, href: "/analytics" },
      ],
    },
    {
      title: "MANAGEMENT",
      items: [
        { name: "Teams & Workspace", icon: Users, href: "/teams", badge: 3 },
        {
          name: "Discussions",
          icon: MessageSquare,
          href: "/discussions",
          badge: 3,
        },
        { name: "Settings / Profile", icon: Settings, href: "/settings" },
      ],
    },
  ];

  const sidebarContent = (isMobile = false) => (
    <>
      {/* Logo + Collapse Button Row */}
      <div
        className={`mb-8 flex items-center px-2 ${
          collapsed && !isMobile ? "justify-center" : "justify-between"
        }`}
      >
        {(!collapsed || isMobile) && (
          <Image
            src="/assets/images/logo-no-bg.png"
            alt="Logo"
            width={80}
            height={80}
            className="object-contain"
          />
        )}

        {/* Desktop collapse toggle */}
        {!isMobile && (
          <button
            onClick={toggleCollapsed}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`group flex h-8 w-8 items-center justify-center rounded-lg border border-app-border bg-app-card text-zinc-400 transition-all duration-200 hover:border-zinc-600 hover:bg-app-card-hover hover:text-white ${
              collapsed ? "mx-auto" : "ml-auto"
            }`}
          >
            {collapsed ? (
              <ChevronRight
                size={15}
                className="transition-transform duration-200"
              />
            ) : (
              <ChevronLeft
                size={15}
                className="transition-transform duration-200"
              />
            )}
          </button>
        )}

        {/* Mobile close button */}
        {isMobile && (
          <button
            onClick={closeMobile}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-app-border bg-app-card text-zinc-400 transition-colors hover:bg-app-card-hover hover:text-white"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Search — hidden when collapsed on desktop */}
      {(!collapsed || isMobile) && (
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search"
            className="w-full rounded-lg border border-app-border bg-app-card py-2 pl-9 pr-8 text-sm text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-xs text-zinc-500 bg-app-border px-1.5 py-0.5 rounded">
            <Command size={10} /> <span>F</span>
          </div>
        </div>
      )}

      {/* Search icon only when collapsed */}
      {collapsed && !isMobile && (
        <div className="mb-8 flex justify-center">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-app-border bg-app-card text-zinc-500 hover:text-white hover:border-zinc-600 transition-colors"
            title="Search"
          >
            <Search size={16} />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-8 overflow-y-auto scrollbar-hide">
        {menuItems.map((section) => (
          <div key={section.title}>
            {/* Section label hidden when collapsed */}
            {(!collapsed || isMobile) && (
              <h3 className="mb-3 px-2 text-xs font-semibold tracking-wider text-zinc-500">
                {section.title}
              </h3>
            )}
            {collapsed && !isMobile && (
              <div className="mb-3 h-px bg-app-border" />
            )}
            <ul
              className={`space-y-1 ${collapsed && !isMobile ? "flex flex-col items-center" : ""}`}
            >
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li
                    key={item.name}
                    className={
                      collapsed && !isMobile ? "w-full flex justify-center" : ""
                    }
                  >
                    <Link
                      href={item.href}
                      onClick={isMobile ? closeMobile : undefined}
                      title={collapsed && !isMobile ? item.name : undefined}
                      className={`group flex items-center rounded-lg transition-colors ${
                        collapsed && !isMobile
                          ? "h-10 w-10 justify-center"
                          : "justify-between px-2 py-2 text-sm font-medium w-full"
                      } ${
                        isActive
                          ? "bg-app-card text-white shadow-inner shadow-white/5"
                          : "text-zinc-400 hover:bg-app-card hover:text-white"
                      }`}
                    >
                      <div
                        className={`flex items-center ${collapsed && !isMobile ? "" : "gap-3"}`}
                      >
                        <item.icon
                          size={18}
                          strokeWidth={isActive ? 2.5 : 2}
                          className={
                            isActive
                              ? "text-white"
                              : "text-zinc-500 group-hover:text-white"
                          }
                        />
                        {(!collapsed || isMobile) && <span>{item.name}</span>}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="mt-auto border-t border-app-border pt-4">
        {!collapsed || isMobile ? (
          <div className="flex items-center gap-3 rounded-lg bg-app-card p-3 transition-colors hover:bg-app-card-hover cursor-pointer group">
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-zinc-700 bg-zinc-800">
              <Image
                src="/assets/images/dummy/img1.jpg"
                alt="User"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-white">Clouds</span>
              <span className="text-xs text-zinc-500 truncate w-32">
                cloudsuites@gmail.com
              </span>
            </div>
            <MoreVertical
              className="ml-auto shrink-0 text-zinc-500 group-hover:text-white"
              size={16}
            />
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="relative h-9 w-9 overflow-hidden rounded-full border border-zinc-700 bg-zinc-800 cursor-pointer hover:border-zinc-500 transition-colors">
              <Image
                src="/assets/images/dummy/img1.jpg"
                alt="User"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}
        {(!collapsed || isMobile) && (
          <div className="mt-2 text-center text-xs text-zinc-600">
            @2025cloudstech
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside
        className={`fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-app-border bg-app-bg py-6 transition-all duration-300 ease-in-out md:flex ${
          collapsed ? "w-[68px] px-2" : "w-64 px-4"
        }`}
      >
        {sidebarContent(false)}
      </aside>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={closeMobile}
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-app-border bg-app-bg px-4 py-6 transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent(true)}
      </aside>
    </>
  );
}

// Mobile hamburger trigger — import and use this in your header/topbar
export function MobileSidebarTrigger() {
  const { toggleMobileOpen } = useSidebar();
  return (
    <button
      onClick={toggleMobileOpen}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-app-border bg-app-card text-zinc-400 transition-colors hover:bg-app-card-hover hover:text-white md:hidden"
      title="Open menu"
    >
      <PanelLeftOpen size={18} />
    </button>
  );
}
