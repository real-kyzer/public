import { getEntriesByType } from "@/db/get-entries-by-type";
import { columns } from "./columns";
import { TableComponent } from "./table-component";

type Props = {
  type: string;
};

export async function Table({ type }: Props) {
  const entries: any[] = []; // await getEntriesByType(type);
  return <TableComponent columns={columns} data={entries} />;
}
