"use client";

import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableViewOptions } from "@/components/ui/data-table/data-table-column-toggle";
import { DataTableDynamicFacetedFilter } from "@/components/ui/data-table/data-table-dynamic-faceted-filter";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { Input } from "@/components/ui/input";
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import React from "react";
import { columnInitialVisibility } from "./columns-Initial-visibility";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function TableComponent<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(columnInitialVisibility);
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div>
      <div className="flex flex-col gap-4 py-4 md:flex-row">
        <div className="flex flex-wrap items-center gap-4 md:flex-nowrap">
          <Input
            placeholder="Search description..."
            value={table.getColumn("description")?.getFilterValue() as string}
            onChange={(event) =>
              table.getColumn("description")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {columns.map((column) => {
            return !!column.filterFn ? (
              <DataTableDynamicFacetedFilter
                key={column!.id}
                column={table.getColumn(column!.id as string)}
              />
            ) : null;
          })}
        </div>
        <div className="flex items-center gap-4 self-end md:ml-auto md:self-auto">
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div className="rounded-md border">
        <DataTable table={table} />
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
