import EventCard from "@/components/EventCard";
import { getAll, EventList_metadata } from "@/lib/events";

export const metadata = EventList_metadata;

export default function EventPage() {
  const events = getAll();

  return (
    <div className="pt-6 md:pt-10 pb-[calc(env(safe-area-inset-bottom)+116px)] md:pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <header className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">Event Jakarta</h1>
          <p className="text-white/70 mt-2">Papan pengumuman acara untuk warga Jakarta.</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {events.map(ev => (
            <EventCard key={ev.slug} ev={ev} />
          ))}
          {events.length === 0 && (
            <div className="col-span-full text-center text-white/60 py-16">
              Belum ada event.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
