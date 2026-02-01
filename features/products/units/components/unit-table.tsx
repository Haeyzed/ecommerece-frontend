"use client";

/**
 * Unit Table Component
 * Paginated table with actions
 */

import { useUnits, useDeleteUnit } from "../api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import Link from "next/link";

export function UnitTable() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, isSessionLoading } = useUnits({ page, per_page: 10 });
  const deleteMutation = useDeleteUnit();

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch {
        // Error toast is handled in the mutation
      }
    }
  };

  if (isSessionLoading || isLoading) {
    return <div>Loading units...</div>;
  }

  if (error) {
    return <div>Error loading units: {error.message}</div>;
  }

  const units = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Units</h2>
        <Link href="/dashboard/units/new">
          <Button>Create Unit</Button>
        </Link>
      </div>

      {units.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No units found. Create your first unit to get started.
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Base Unit</TableHead>
                <TableHead>Conversion</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {units.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell className="font-medium">{unit.code}</TableCell>
                  <TableCell>{unit.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {unit.base_unit_relation?.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {unit.operator && unit.operation_value != null
                      ? `${unit.operator} ${unit.operation_value}`
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        unit.is_active
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                      }`}
                    >
                      {unit.is_active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Link href={`/dashboard/units/${unit.id}/edit`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(unit.id, unit.name)}
                        disabled={deleteMutation.isPending}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {meta && meta.last_page > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {meta.current_page} of {meta.last_page}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                disabled={page === meta.last_page}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
