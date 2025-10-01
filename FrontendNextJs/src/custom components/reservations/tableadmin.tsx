"use client"
import { toast } from "@/components/ui/use-toast"
import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import { format } from 'date-fns';
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import DatePickerFormUpdate from "./UpdateReservationForm"
import { Icons } from "@/constants"
import { useLoading } from "../LoadingContext"
import { useProgressLoading } from "../ProgressLoadingContext"
import { ProgressTable } from "../progresstable"

export async function fetchData(): Promise<Reservation[]> {
  const url = "/api/reservations";

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Rethrow the error so it can be caught elsewhere if needed.
  }
}

export type Reservation = {
  id: string
  customer_id: string
  payed: boolean
  vehicle_id: string
  start_date: string
  end_date: string
}


export default function DataTable() {
  const { loading, loadingRowId, setGlobalLoading} = useLoading();
  const { progressLoading, setProgressGlobalLoading } = useProgressLoading();
  const updateReservation = (updatedReservation: Reservation) => {
    // Find the index of the reservation in data array
    const updatedIndex = data.findIndex((r) => r.id === updatedReservation.id);

    if (updatedIndex !== -1) {
      // Update the reservation in data array
      const updatedData = [...data];
      updatedData[updatedIndex] = updatedReservation;

      setFetchedData(updatedData);
    }
  };

  const columns: ColumnDef<Reservation>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "payed",
      header: "Paid",
      cell: ({ row }) => (
        <div className={row.getValue("payed") ? 'paid' : 'unpaid'}>
          {row.getValue("payed")!.toString()}
        </div>
      ),
    },
    {
      accessorKey: "customer_id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Customer Id
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="">{row.getValue("customer_id")}</div>,
    },
    {
      accessorKey: "vehicle_id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Vehicle Id
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="">{row.getValue("vehicle_id")}</div>,
    },
    {
      accessorKey: "start_date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Start Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="lowercase">{format(new Date(row.getValue("start_date")), 'yyyy-MM-dd')}</div>,
    },
    {
      accessorKey: "end_date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            End Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="lowercase">{format(new Date(row.getValue("end_date")), 'yyyy-MM-dd')}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const reservation = row.original

        return (

          <Dialog>

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                {loading && loadingRowId === row.original.id ? (<Icons.spinner className="h-8 w-8 animate-spin p-0"/>)
                  :
                  <Button variant="ghost" className="h-8 w-8 p-0" disabled={loading} >
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                }
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => makeDeleteRequest(reservation.id)}>
                  Delete
                </DropdownMenuItem>
                <DialogTrigger asChild>
                  <DropdownMenuItem>
                    Update
                  </DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <DatePickerFormUpdate
              reservation={reservation}
              onUpdateSuccess={updateReservation}
            />
          </Dialog>
        )
      },
    },
  ]

  const makeDeleteRequest = async (id: string) => {
    setGlobalLoading(true, id);

    const url = `/api/reservations/${id}`;
  
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const updatedData = data.filter((reservation) => reservation.id !== id);
        setFetchedData(updatedData);
        toast({
          title: "Reservation Deleted!",
        });
      } else {
        toast({
          title: "Reservation Delete Failed!",
        });
        throw new Error('Failed to delete the resource');
      }
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error('There was a problem with the DELETE request:', error);
    } finally {
      setGlobalLoading(false, "");
    }
  };



  const [fetchedData, setFetchedData] = useState<Reservation[] | null>(null);

  useEffect(() => {
    async function fetchDataAndStore() {
      try {
        setProgressGlobalLoading(true);
        const data = await fetchData();
        setFetchedData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setProgressGlobalLoading(false);
    }

    fetchDataAndStore();
  }, []);

  const data: Reservation[] = fetchedData || [];
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className=" w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter customerId..."
          value={(table.getColumn("customerId")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("customerId")?.setFilterValue(event.target.value)
          }
          className=" max-w-xs"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          {progressLoading ? (
            <TableBody>
             <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <ProgressTable />
                  </div>
                </TableCell>
             </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
