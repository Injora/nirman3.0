import Button from "@/components/Button";
import EyebrowLabel from "@/components/EyebrowLabel";
import PosterCard from "@/components/PosterCard";
import SectionHeading from "@/components/SectionHeading";
import { ABOUT_POINTS, EVENT_NAME, ORG_FULL, ORG_SHORT, RULES, TIMELINE } from "@/lib/constants";

export default function HomePage() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-void bg-dots">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="inline-block border-2 border-paper bg-volt px-4 py-2">
            <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.3em] text-paper">
              {`${ORG_SHORT} // STUDENT DEVELOPER CLUB`}
            </p>
          </div>

          <h1 className="mt-8 font-display uppercase leading-[0.85] text-6xl sm:text-8xl lg:text-[9.5rem] break-words">
            NIRMAAN
            <br />
            <span className="inline-block bg-paper px-3 text-volt shadow-[8px_8px_0_0_#1e3aff]">
              3.0
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-base sm:text-lg text-paper/70 leading-relaxed">
            A solo hackathon conducted by {ORG_SHORT} ({ORG_FULL}) as part of its student intake.
            One builder, one machine, one shot to prove what you can ship.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="/register">Register Now →</Button>
            <Button href="/#rules" variant="outline">
              Read the rules
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 border-t-2 border-paper/15 pt-8">
            {[
              ["SOLO", "Format"],
              ["NST 1ST YR", "Eligibility"],
              ["300+", "Capacity"],
              ["NST-SDC", "Organizer"],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="font-display text-2xl sm:text-3xl uppercase text-volt">{value}</p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/50">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="scroll-mt-20 border-t-2 border-paper/15 bg-void">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
          <SectionHeading
            eyebrow="ABOUT // NIRMAAN 3.0"
            title={
              <>
                Built solo.
                <br />
                Judged on merit.
              </>
            }
            description={`${EVENT_NAME} is ${ORG_SHORT}'s flagship solo hackathon — a compressed build sprint designed to surface serious individual builders from NST's first-year cohort for the club's student intake.`}
          />

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {ABOUT_POINTS.map((point, i) => (
              <PosterCard
                key={point.title}
                label={point.label}
                title={point.title}
                rotate={i % 2 === 0 ? "-rotate-1" : "rotate-1"}
              >
                {point.body}
              </PosterCard>
            ))}
          </div>
        </div>
      </section>

      {/* HACKATHON / FORMAT */}
      <section id="hackathon" className="scroll-mt-20 border-t-2 border-paper/15 bg-volt text-void">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
          <EyebrowLabel tone="paper">CAMPUS POSTER WALL // FORMAT</EyebrowLabel>
          <h2 className="mt-3 font-display uppercase leading-[0.85] text-4xl sm:text-6xl lg:text-7xl break-words">
            How Nirmaan
            <br />
            runs.
          </h2>
          <div className="mt-8 h-[3px] w-full bg-void" />

          <div className="mt-12 grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-2 border-2 border-void bg-void text-paper p-7 shadow-[8px_8px_0_0_#060606]">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-acid">
                Identity verified // Solo only
              </p>
              <p className="mt-4 font-display uppercase text-3xl leading-tight">
                One account.
                <br />
                One registration.
              </p>
              <p className="mt-4 text-sm text-paper/70 leading-relaxed">
                Sign in with your @adypu.edu.in Google account. There are no teams, no invites,
                and no way to register twice — your Google identity is the registration.
              </p>
            </div>

            <div className="lg:col-span-3 grid sm:grid-cols-3 gap-6">
              {[
                ["Sign in with Google", "Continue with your institutional Google account — nothing else is accepted."],
                ["Verify eligibility", "Only @adypu.edu.in accounts pass verification, enforced at the database."],
                ["Fill your profile", "Confirm your name, student ID, phone, and year."],
              ].map(([title, body]) => (
                <div key={title} className="border-2 border-void bg-paper p-5">
                  <p className="font-display uppercase text-lg leading-tight">{title}</p>
                  <p className="mt-2 text-sm text-void/70 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RULES */}
      <section id="rules" className="scroll-mt-20 border-t-2 border-paper/15 bg-void">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
          <SectionHeading
            eyebrow="RULEBOOK // READ BEFORE REGISTERING"
            title="The rules."
          />

          <ol className="mt-12 divide-y-2 divide-paper/15 border-y-2 border-paper/15">
            {RULES.map((rule, i) => (
              <li key={rule} className="flex gap-6 py-5 sm:py-6">
                <span className="font-mono text-sm text-volt shrink-0 w-8">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm sm:text-base text-paper/80 leading-relaxed">{rule}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="border-t-2 border-paper/15 bg-void">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
          <SectionHeading eyebrow="TIMELINE // WHAT'S NEXT" title="The roadmap." />

          <div className="mt-12 grid gap-4">
            {TIMELINE.map((item) => (
              <div
                key={item.tag}
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8 border-2 border-paper/20 px-5 sm:px-7 py-5"
              >
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-volt shrink-0 sm:w-28">
                  {item.tag}
                </span>
                <span className="font-display uppercase text-xl sm:text-2xl shrink-0 sm:w-72">
                  {item.title}
                </span>
                <span className="text-sm text-paper/60 leading-relaxed">{item.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REGISTER CTA */}
      <section className="border-t-2 border-paper/15 bg-void bg-grid">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-28 text-center">
          <EyebrowLabel>REGISTRATION // NOW OPEN</EyebrowLabel>
          <h2 className="mt-4 font-display uppercase leading-[0.85] text-4xl sm:text-7xl lg:text-8xl break-words">
            Ready to
            <br />
            <span className="text-volt">build solo?</span>
          </h2>
          <p className="mt-6 mx-auto max-w-lg text-paper/70 text-base sm:text-lg">
            Only @adypu.edu.in accounts are eligible. Sign in with Google to lock in your spot.
          </p>
          <div className="mt-10">
            <Button href="/register" className="mx-auto">
              Register Now →
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
