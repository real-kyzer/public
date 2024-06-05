import { getFilesByEntry } from "@/db/get-files-by-entry";
import { convertBytes } from "@/lib/utils";
import { FileImageIcon, FileTextIcon } from "lucide-react";
import { Suspense } from "react";

type Props = {
  uuid: string;
};

async function List({ uuid }: Props) {
  const data = await getFilesByEntry(uuid);
  if (!data || data.length <= 0) {
    return <p>No files currently uploaded for this entry</p>;
  }
  return (
    <>
      {data.map((file: (typeof data)[0]) => (
        <a
          key={file.key}
          href={`/file/${file.key}`}
          target="_blank"
          className="link-clip flex flex-wrap items-center gap-2 bg-secondary-muted p-6 text-lg  hover:bg-secondary md:flex-nowrap"
        >
          <span className="w-full font-medium md:w-auto">
            {file.key.split("/").reverse()[0]}
          </span>
          <span className="text-sm text-muted-foreground">
            {file.updatedOn.toLocaleString("en-AU")}
          </span>
          <span className="ml-auto flex items-center gap-2 text-nowrap text-sm">
            {convertBytes(+file.size)}
            {(file.key as string).includes(".pdf") ? (
              <FileTextIcon />
            ) : (
              <FileImageIcon />
            )}
          </span>
        </a>
      ))}
    </>
  );
}

export function ListEntryFiles({ uuid }: Props) {
  return (
    <Suspense fallback={<p>Loading files...</p>}>
      <List uuid={uuid} />
    </Suspense>
  );
}
