import { CATEGORY_LABEL } from "@/lib/events";
import type { EventCategory, EventStatus } from "@/lib/events";

export function StatusBadge({ status }: { status: EventStatus }) {
  const m = {
    upcoming: "bg-blue-500/20 text-blue-300 ring-blue-500/30",
    ongoing: "bg-green-500/20 text-green-300 ring-green-500/30",
    past: "bg-gray-500/20 text-gray-300 ring-gray-500/30",
  } as const;
  return (
    <span className={`text-xs px-2 py-1 rounded-full ring-1 ${m[status]}`}>
      {status === "upcoming" ? "Mendatang" : status === "ongoing" ? "Berlangsung" : "Selesai"}
    </span>
  );
}

export function CategoryBadge({ cat }: { cat: EventCategory }) {
  const color = {
    music: "bg-purple-500/20 text-purple-300 ring-purple-500/30",
    competition: "bg-red-500/20 text-red-300 ring-red-500/30",
    workshop: "bg-blue-500/20 text-blue-300 ring-blue-500/30",
    festival: "bg-pink-500/20 text-pink-300 ring-pink-500/30",
    community: "bg-green-500/20 text-green-300 ring-green-500/30",
    sports: "bg-orange-500/20 text-orange-300 ring-orange-500/30",
    tech: "bg-cyan-500/20 text-cyan-300 ring-cyan-500/30",
    art: "bg-violet-500/20 text-violet-300 ring-violet-500/30",
    food: "bg-yellow-500/20 text-yellow-300 ring-yellow-500/30",
    other: "bg-gray-500/20 text-gray-300 ring-gray-500/30",
  } as const;
  return (
    <span className={`text-xs px-2 py-1 rounded-full ring-1 ${color[cat]}`}>
      {CATEGORY_LABEL[cat]}
    </span>
  );
}
