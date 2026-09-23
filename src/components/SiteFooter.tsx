import { EVENT_NAME, ORG_FULL, ORG_SHORT } from "@/lib/constants";

export default function SiteFooter() {
  return (
    <footer className="border-t-2 border-paper/15 bg-void">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display uppercase text-2xl leading-none">
            {ORG_SHORT} <span className="text-volt">{EVENT_NAME}</span>
          </p>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-paper/50">
            {ORG_FULL}
          </p>
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-paper/40">
          Solo hackathon // ADYPU institutional accounts only
        </p>
      </div>
    </footer>
  );
}
