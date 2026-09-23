import { redirect } from "next/navigation";
import AdminTable from "@/components/admin/AdminTable";
import EyebrowLabel from "@/components/EyebrowLabel";
import { createClient } from "@/lib/supabase/server";
import type { Registration } from "@/lib/supabase/types";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/register");
  }

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    redirect("/");
  }

  const { data: registrations, error } = await supabase
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Registration[]>();

  const rows = registrations ?? [];
  const registeredCount = rows.filter((r) => r.registration_status === "registered").length;

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
      <EyebrowLabel>ORGANIZER // NST-SDC</EyebrowLabel>
      <h1 className="mt-3 font-display uppercase leading-[0.88] text-4xl sm:text-6xl break-words">
        Registrations
      </h1>

      <div className="mt-8 flex flex-wrap gap-6">
        <div className="border-2 border-paper bg-void-soft px-6 py-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50">
            Total registrations
          </p>
          <p className="mt-1 font-display text-4xl text-volt">{rows.length}</p>
        </div>
        <div className="border-2 border-paper bg-void-soft px-6 py-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/50">
            Confirmed
          </p>
          <p className="mt-1 font-display text-4xl text-acid">{registeredCount}</p>
        </div>
      </div>

      {error ? (
        <div className="mt-10 border-2 border-paper bg-void-soft p-6">
          <p className="text-sm text-paper/70">
            Couldn&apos;t load registrations right now. Please refresh the page.
          </p>
        </div>
      ) : (
        <div className="mt-10">
          <AdminTable registrations={rows} />
        </div>
      )}
    </section>
  );
}
