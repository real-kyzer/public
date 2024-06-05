import { AutoBreadcrumb } from "@/components/breadcrumb/auto-breadcrumb";
import { FileAddButton } from "@/components/files/add-button";
import { ListEntryFiles } from "@/components/files/list-files";
import { getEntry } from "@/db/get-entry";
import { notFound } from "next/navigation";

export const runtime = "edge";

export default async function Page({ params }: { params: { uuid: string } }) {
  const data = await getEntry(params.uuid);

  if (!data || !data[0]?.uuid) {
    return notFound();
  }
  const entry = data[0];
  return (
    <main className="mb-8 flex flex-col gap-8">
      <section className="w-full  bg-secondary-muted">
        <h1 className="mx-auto max-w-screen-xl text-balance px-4 py-12 text-5xl">
          {entry.description}
        </h1>
      </section>
      <section className="mx-auto w-full border-b-2 border-secondary text-lg">
        <div className="mx-auto max-w-screen-xl space-y-2 px-4">
          <AutoBreadcrumb />
        </div>
      </section>
      <section className="mx-auto w-full max-w-screen-xl text-lg">
        <div className="w-full max-w-screen-lg space-y-2 px-4">
          <p className="text-sm text-muted-foreground">{entry.uuid}</p>
          <p className="text-sm">{entry.createdOn.toLocaleString("en-AU")}</p>
        </div>
      </section>
      <section className="mx-auto w-full max-w-screen-xl text-lg">
        <div className="w-full max-w-screen-lg space-y-2 px-4">
          <h2 className="text-4xl">Internal notes</h2>
          <p className="whitespace-pre-line">
            {entry.internalNotes ?? (
              <span className="text-muted-foreground">No internal notes</span>
            )}
          </p>
        </div>
      </section>
      <section className="mx-auto w-full max-w-screen-xl text-lg">
        <div className="w-full max-w-screen-lg space-y-2 px-4">
          <h2 className="text-4xl">Files</h2>
          <ListEntryFiles uuid={params.uuid} />
        </div>
      </section>
      <section className="mx-auto w-full max-w-screen-xl text-lg">
        <div className="flex w-full justify-between space-y-2 px-4">
          <FileAddButton type={"general"} uuid={params.uuid} />
        </div>
      </section>
    </main>
  );
}
