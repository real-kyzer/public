import { AutoBreadcrumb } from "@/components/breadcrumb/auto-breadcrumb";
import { EntryAddButton } from "@/components/entries/add-button";
import { Table } from "@/components/entries/table";

export const runtime = "edge";

export default async function Page() {
  return (
    <main className="mb-8 flex flex-col gap-8">
      <section className="w-full bg-secondary-muted">
        <h1 className="mx-auto max-w-screen-xl px-4 py-12 text-5xl">
          WSUD Entries
        </h1>
      </section>
      <section className="mx-auto w-full border-b-2 border-secondary text-lg">
        <div className="mx-auto max-w-screen-xl px-4">
          <AutoBreadcrumb />
        </div>
      </section>
      <section className="mx-auto w-full max-w-screen-xl text-lg">
        <div className="flex w-full justify-between px-4">
          <EntryAddButton type="wsud" />
        </div>
      </section>
      <section className="mx-auto w-full max-w-screen-xl text-lg">
        <div className="w-full px-4">
          <Table type="wsud" />
        </div>
      </section>
    </main>
  );
}
