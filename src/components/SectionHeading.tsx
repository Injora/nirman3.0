import EyebrowLabel from "@/components/EyebrowLabel";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "right";
}) {
  return (
    <div className={align === "right" ? "text-right" : "text-left"}>
      <EyebrowLabel>{eyebrow}</EyebrowLabel>
      <h2 className="mt-3 font-display uppercase leading-[0.88] text-4xl sm:text-6xl lg:text-7xl break-words">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 max-w-2xl text-base sm:text-lg text-paper/70 leading-relaxed">
          {description}
        </p>
      ) : null}
      <div className="mt-8 h-[3px] w-full bg-paper" />
    </div>
  );
}
