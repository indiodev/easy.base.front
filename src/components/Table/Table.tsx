"use client";

import SortIcon from "@/components/Icons/SortIcon";
import { getDataType, getFilterVariant } from "@/contexts/functions";
import { API } from "@/utils/api";
import {
  CheckCircleIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button, Pagination, Table } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { DeleteModal } from "../Modal/DeleteModal";
import { FilterColumn } from "./FilterColumn";
import MenuTable from "./MenuTable";

export type TableComponentType = {
  id?: string;
  tableData?: any;
  reload: () => any;
};

export function TableComponent({ id, tableData, reload }: TableComponentType) {
  const router = useRouter();
  console.log(id, tableData);

  const [loading, setLoading] = useState(false);

  const [globalFilter, setGlobalFilter] = useState("");
  const [data, setData] = useState(
    tableData.rows?.map((row: any) => row.value)
  );
  const [dataBkp, setDataBkp] = useState(
    tableData.rows?.map((row: any) => row.value)
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [toBeSaved, setToBeSaved] = useState<number[]>([]);

  const columns = tableData.columns?.map((col: any) => ({
    accessorKey: col.slug.toLowerCase(),
    header: col.title,
    size: 225,
    cell: getDataType(col.type),
    enableSorting: true,
    enableColumnFilter: col.type == "selectcell",
    filterFn: col.type != "datecell" ? "includesString" : "includesString",
    meta: {
      filterVariant: getFilterVariant(col.type),
    },
  }));

  const onPageChange = (page: number) =>
    page > table.getState().pagination.pageIndex
      ? table.nextPage()
      : table.previousPage();

  function dismissChange(rowIndex: number) {
    // rollback changes
    setData((prev: any[]) => {
      var data = [...prev];
      data[rowIndex] = dataBkp[rowIndex];
      return data;
    });

    // remove from tobesaved array
    setToBeSaved((prev) => prev.filter((row: any) => row != rowIndex));
  }

  function addToBeSaved(rowIndex: number) {
    setToBeSaved((prev) => [...prev, rowIndex]);
  }

  function saveChange(rowIndex: number) {
    dismissChange(rowIndex);
    //call to api update change of rowIndex data
    const id = tableData.rows[rowIndex].id;

    API.put(`/tables/${id}/row`, {
      ...data[rowIndex],
      id: id,
    })
      .then((data) => {
        if (data.data.erro) toast.error("Erro ao tentar atualizar registro!");
        else {
          toast.success("Registro atualizado com sucesso!");
          router.refresh();
          reload();
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(
          "Não foi possivel atualizar o registro. Tente novamente mais tarde."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function dismissAllChanges() {
    setToBeSaved([]);
  }

  function saveAllChanges() {
    console.log("Saving all data...");
  }

  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: { pageSize: 10 },
    },
    state: {
      columnFilters,
      globalFilter: globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(), // client-side faceting
    getFacetedUniqueValues: getFacetedUniqueValues(), // generate unique values for select filter/autocomplete
    getFacetedMinMaxValues: getFacetedMinMaxValues(), // generate min/max
    columnResizeMode: "onChange",
    meta: {
      updateData: (rowIndex: number, columnId: any, value: any) => {
        addToBeSaved(rowIndex);
        return setData((prev: any[]) =>
          prev.map((row: any, index: any) =>
            index === rowIndex
              ? {
                  ...prev[rowIndex],
                  [columnId]: value,
                }
              : row
          )
        );
      },

      selectOptions: tableData.columns,
    },
  });

  function getRowId(rowId: any) {
    const row = table.getRow(rowId);
    const item = tableData.rows?.find(
      (item: any) => JSON.stringify(item.value) == JSON.stringify(row.original)
    ).id;
    // console.log(item)
    return item;
  }

  function openDeleteModal() {
    setDeleteModalOpen(true);
  }
  function closeDeleteModal() {
    setDeleteModalOpen(false);
  }

  async function deleteRow() {
    await API.delete(`/tables/${id}/row`, {
      data: {
        id: getRowId(selectedRow),
      },
    })
      .then((data) => {
        if (data.data.erro) toast.error("Erro ao tentar remover o registro!");
        else {
          // console.log(data.data)
          toast.success("Registro removido com sucesso!");

          router.refresh();
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(
          "Não foi possivel remover o registro. Tente novamente mais tarde."
        );
      })
      .finally(() => {
        closeDeleteModal();
      });
  }

  function handleDeleteRow(row: any) {
    setSelectedRow(row);
    openDeleteModal();
  }

  return (
    <div className="flex flex-1 flex-col w-full tw-h-screen gap-4">
      <MenuTable
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        fields={tableData.columns}
        reload={reload}
        tableId={tableData.id}
        tableName={tableData.title}
      />
      <DeleteModal
        confirm={deleteRow}
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
      ></DeleteModal>

      <section className="bg-gray-50 rounded-lg tw-flex-1 flex flex-col gap-2">
        <div className="pl-4 pt-4 font-semibold">
          <h2>{tableData?.title}</h2>
        </div>

        <Table className="w-full bg-transparent">
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Head key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.HeadCell key={header.id}>
                  <div className="flex flex-row gap-2 py-2">
                    {header.column.columnDef.header as any}
                    {header.column.getCanSort() && (
                      <SortIcon
                        className="h-4 w-4 cursor-pointer"
                        onClick={header.column.getToggleSortingHandler()}
                      />
                    )}
                  </div>
                  <div
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className={`resizer ${
                      header.column.getIsResizing() ? "isResizing" : ""
                    }`}
                  />
                  <div>
                    <FilterColumn column={header.column} />
                  </div>
                </Table.HeadCell>
              ))}
              <Table.HeadCell>
                <div className="flex gap-2 w-full h-10 text-center items-center justify-items-center">
                  Ações
                </div>
                <div className="h-8"></div>
              </Table.HeadCell>
            </Table.Head>
          ))}
          <Table.Body>
            {table
              .getRowModel()
              .rows.map(
                (row: {
                  id: any;
                  getVisibleCells: () => any[];
                  index: number;
                }) => (
                  <Table.Row key={row.id}>
                    {row.getVisibleCells().map(
                      (cell: {
                        column: {
                          getSize: () => any;
                          columnDef: { cell: any };
                        };
                        id: any;
                        getContext: () => any;
                      }) => (
                        <Table.Cell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </Table.Cell>
                      )
                    )}
                    <Table.Cell align="center">
                      <div className="flex gap-2 min-w-52">
                        {toBeSaved.includes(row.index) && (
                          <div className="flex gap-2">
                            <Button
                              color="green"
                              onClick={() => saveChange(row.index)}
                            >
                              <CheckCircleIcon height="20" width="20" />
                            </Button>
                            <Button
                              color="gray"
                              onClick={() => dismissChange(row.index)}
                            >
                              <XCircleIcon height="20" width="20" />
                            </Button>
                          </div>
                        )}

                        <Button
                          onClick={() => handleDeleteRow(row.id)}
                          color="red"
                        >
                          <TrashIcon height="20" width="20" />
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                )
              )}
          </Table.Body>
        </Table>
      </section>

      <div className="flex flex-col w-full h-full justify-end items-end pb-4">
        <br />
        <h4>
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount()}
        </h4>

        <Pagination
          layout="navigation"
          currentPage={table.getState().pagination.pageIndex + 1}
          totalPages={table.getPageCount()}
          onPageChange={onPageChange}
          nextLabel="Próximo"
          previousLabel="Anterior"
          showIcons
        />
      </div>
    </div>
  );
}
export default TableComponent;
