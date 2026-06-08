import { X, Copy } from "lucide-react";

interface ShareProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareProjectModal({
  isOpen,
  onClose,
}: ShareProjectModalProps) {
  if (!isOpen) return null;

  const invitedUsers = [
    {
      name: "Cloudstech",
      email: "clouds@gmail.com",
      initial: "C",
      color: "bg-blue-600",
    },
    {
      name: "Cloudstech",
      email: "clouds@gmail.com",
      initial: "C",
      color: "bg-blue-600",
    },
    {
      name: "Cloudstech",
      email: "clouds@gmail.com",
      initial: "C",
      color: "bg-blue-600",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-[450px] rounded-2xl bg-[#141414] p-6 shadow-2xl flex flex-col border border-white/5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium text-white mb-1">
              Share project
            </h2>
            <p className="text-sm text-zinc-500">
              Invite people to see about this project
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Project Link Section */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Project link
            </label>
            <div className="flex items-center justify-between rounded-xl border border-[#272727] bg-[#1a1a1a] px-3 py-2">
              <span className="text-sm text-zinc-400 truncate w-[260px]">
                cloudsuite.app/share/project/ks8H2d93f
              </span>
              <button className="rounded-lg border border-[#272727] bg-[#222222] hover:bg-[#2a2a2a] px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors">
                Copy
              </button>
            </div>
          </div>

          {/* OR Divider */}
          <div className="relative flex items-center py-2">
            <div className="grow border-t border-[#272727]"></div>
            <span className="shrink-0 px-3 text-xs text-zinc-500 bg-[#141414]">
              OR
            </span>
            <div className="grow border-t border-[#272727]"></div>
          </div>

          {/* Invite by Email Section */}
          <div>
            <h3 className="text-sm font-medium text-zinc-300 mb-4">
              Invite by email
            </h3>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Enter email
            </label>
            <div className="flex items-center justify-between rounded-xl border border-[#272727] bg-[#1a1a1a] px-3 py-2">
              <input
                type="email"
                placeholder="@gmail.com"
                className="w-full bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-none"
              />
              <button className="rounded-lg border border-[#272727] bg-[#222222] hover:bg-[#2a2a2a] px-4 py-1.5 text-xs font-medium text-zinc-300 transition-colors ml-2">
                Invite
              </button>
            </div>
          </div>

          {/* Invited List Section */}
          <div>
            <h3 className="text-sm font-medium text-zinc-300 mb-4">Invited</h3>
            <div className="space-y-4">
              {invitedUsers.map((user, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white ${user.color}`}
                  >
                    {user.initial}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-zinc-200">
                      {user.name}
                    </span>
                    <span className="text-sm text-zinc-500">{user.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-8 flex w-full gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/10 bg-[#1c1c1c] py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/5"
          >
            Close
          </button>
          <button
            onClick={() => {
              // Copy logic goes here
              onClose();
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Copy size={16} />
            Copy link
          </button>
        </div>
      </div>
    </div>
  );
}
