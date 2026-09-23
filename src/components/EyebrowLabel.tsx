export default function EyebrowLabel({
  children,
  tone = "volt",
}: {
  children: React.ReactNode;
  tone?: "volt" | "acid" | "paper";
}) {
  const toneClass = tone === "volt" ? "text-volt" : tone === "acid" ? "text-acid" : "text-paper/70";

  return (
    <p className={`font-mono text-[11px] sm:text-xs uppercase tracking-[0.28em] ${toneClass}`}>
      {children}
    </p>
  );
}
