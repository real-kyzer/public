"use client";

import { entryTable } from "@/db/schema";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { DataTableColumnHeader } from "../ui/data-table/data-table-column-header";

const filterFn = (
  row: Row<Omit<typeof entryTable.$inferSelect, "internalNotes">>,
  id: string,
  value: any,
) => {
  return value.includes(row.getValue(id)) as boolean;
};

export const columns: ColumnDef<
  Omit<typeof entryTable.$inferSelect, "internalNotes">
>[] = [
  {
    id: "uuid",
    accessorKey: "uuid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="UUID" />
    ),
  },
  {
    id: "type",
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
  },
  {
    id: "description",
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
  },
  {
    id: "userId",
    accessorKey: "userId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="UserID" />
    ),
  },
  {
    id: "createdOn",
    accessorKey: "createdOn",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const original = row.original;
      return original.createdOn.toLocaleString("en-AU");
    },
  },
  {
    id: "updatedOn",
    accessorKey: "updatedOn",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated" />
    ),
    cell: ({ row }) => {
      const original = row.original;
      return original.updatedOn.toLocaleString("en-AU");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <Button variant={"outline"} asChild>
          <a href={`/${data.type}/${data.uuid}`}>Open</a>
        </Button>
      );
    },
  },
];
