import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline" | "outline-dark";

const base =
  "inline-flex items-center justify-center gap-3 border-2 px-6 py-3.5 font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.15em] transition-transform duration-150 disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-volt text-paper border-paper shadow-[5px_5px_0_0_#f4f1e8] hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#f4f1e8] active:translate-y-0 active:shadow-[3px_3px_0_0_#f4f1e8]",
  outline:
    "bg-transparent text-paper border-paper hover:bg-paper hover:text-void",
  "outline-dark":
    "bg-void text-paper border-void hover:bg-paper hover:text-void",
};

type CommonProps = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & {
  href: string;
};

export default function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", className = "", children, ...rest } = props;
  const classes = `${base} ${variants[variant]} ${className}`;

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
