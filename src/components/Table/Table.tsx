import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { makeData, User } from "../../data/makeData";
import { Dialog, Button } from "@radix-ui/themes";
import { SearchIcon } from "../Icons/Icons";
import Input from "../Input";

const Table = () => {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [data, setData] = React.useState(makeData(10));
  const rerender = () => setData(makeData(10));
  const [position, setPosition] = React.useState("bottom");

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      cell: (info) => info.getValue(),
      header: "Name",
      footer: (props) => props.column.id,
    },
    {
      accessorKey: "email",
      cell: (info) => (
        <span className="text-base font-normal">
          {info.row.original.email.charAt(0).toLowerCase()}
          {info.row.original.email.slice(1)}
        </span>
      ),
      header: "Email",
      footer: (props) => props.column.id,
      enableSorting: false,
    },
    {
      accessorKey: "role",
      header: "Role",
      footer: (props) => props.column.id,
    },
    {
      accessorKey: "status",
      header: "Status",
      footer: (props) => props.column.id,
      enableSorting: false,
    },
    {
      id: "editButton", // New column identifier
      header: "Action",
      footer: (props) => props.column.id,
      cell: (info) => (
        <Dialog.Root>
          <Dialog.Trigger>
            <Button color="indigo" variant="soft">
              Edit
            </Button>
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Description>Clicked!</Dialog.Description>
          </Dialog.Content>
        </Dialog.Root>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="p-2 max-w-5xl mx-auto">
      <div className="flex items-center mb-6">
        <SearchIcon />
        <Input
          value={globalFilter ?? ""}
          onChange={(value: any) => setGlobalFilter(String(value))}
          className="p-2 bg-transparent outline-none border-b-2 w-1/5 focus:w-1/3 duration-300 border-indigo-500"
          placeholder="Search all columns..."
        />
      </div>
      <table className="w-full border-collapse border-gray-700 rounded">
        <thead className="bg-indigo-500 text-white rounded-t-lg">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  onClick={header.column.getToggleSortingHandler()}
                  className="p-4 text-left text-white font-semibold italic cursor-pointer hover:bg-indigo-300 "
                >
                  {header.isPlaceholder ? null : (
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : "",
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row, i) => (
              <tr
                key={row.id}
                className={`
                ${i % 2 === 0 ? "bg-slate-200" : "bg-slate-1ss00"}
              `}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`py-2 px-4 border-b ${
                      cell.column.id === "status"
                        ? cell.row.original.status === "Inactive"
                          ? "text-red-600"
                          : "text-green-600"
                        : ""
                    } ${
                      cell.column.id === "role"
                        ? cell.row.original.role === "Admin"
                          ? "font-medium"
                          : ""
                        : ""
                    }`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr className="text-center h-32">
              <td colSpan={12} className="py-4">
                No Record Found!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
