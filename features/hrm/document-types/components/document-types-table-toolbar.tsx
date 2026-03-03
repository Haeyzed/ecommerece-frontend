"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/ui/data-table/data-table-view-options";

import { DataTableBulkActions } from "./data-table-bulk-actions";
import { useDocumentTypes } from "../provider";

interface DocumentTypesTableToolbarProps<TData> {
  table?: Table<TData>;
}

export function DocumentTypesTableToolbar<TData>({
  table,
}: DocumentTypesTableToolbarProps<TData>) {
  const { filterParams, setFilterParams, rowSelection } = useDocumentTypes();
  const isFiltered = Object.keys(filterParams).length > 0;
  const hasSelection = Object.keys(rowSelection).length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter document types..."
          value={(filterParams.search as string) ?? ""}
          onChange={(event) =>
            setFilterParams({ ...filterParams, search: event.target.value })
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => setFilterParams({})}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {hasSelection ? <DataTableBulkActions /> : null}
        {table && <DataTableViewOptions table={table} />}
      </div>
    </div>
  );
}
