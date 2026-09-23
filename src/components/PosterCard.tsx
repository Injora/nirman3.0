export default function PosterCard({
  label,
  title,
  children,
  rotate = "-rotate-1",
}: {
  label: string;
  title: string;
  children: React.ReactNode;
  rotate?: string;
}) {
  return (
    <div className={`${rotate} transition-transform duration-200 hover:rotate-0`}>
      <div className="border-2 border-void bg-paper text-void p-6 sm:p-7 shadow-[8px_8px_0_0_#1e3aff]">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-volt-dim">{label}</p>
        <h3 className="mt-3 font-display uppercase text-2xl sm:text-3xl leading-[0.95]">{title}</h3>
        <div className="mt-4 h-[2px] w-12 bg-void" />
        <p className="mt-4 text-sm sm:text-base leading-relaxed text-void/80">{children}</p>
      </div>
    </div>
  );
}
