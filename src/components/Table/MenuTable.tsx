"use client";

import { API } from "@/utils/api";
import {
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Button, Card, Label, TextInput, Tooltip } from "flowbite-react";
import { useParams, useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { toast } from "react-toastify";
import { CreateFormBtn } from "../Modal/CreateFormBtn";
import { DeleteModal } from "../Modal/DeleteModal";
import { NewRowModal } from "./NewRowModal";

const MenuTable = ({
  columnFilters,
  setColumnFilters,
  fields,
  globalFilter,
  setGlobalFilter,
  reload,
  tableName,
  tableId,
}: any) => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>() || { id: null };
  const [newRowModal, setNewRowModal] = useState(false);
  const [deleteTableModal, setDeleteTableModal] = useState(false);

  const onFilterChange = (id: any, value: any) =>
    setColumnFilters((prev: any) =>
      prev
        .filter((f: any) => f.id !== id)
        .concat({
          id,
          value,
        })
    );

  function handleNewRow() {
    setNewRowModal(true);
  }

  function handleDeleteTable() {
    setDeleteTableModal(true);
  }

  function handleEditTable() {
    toast.info("Ação em manutenção! Tente novamente mais tarde.");
  }

  function handleDelete() {
    API.delete(`/tables/${id}`, {
      data: { id },
    })
      .then((data) => {
        if (data.data.erro) toast.error("Erro ao tentar remover tabela!");
        else {
          // console.log(data.data)
          toast.success("Tabela removida com sucesso!");

          startTransition(() => {
            router.replace(`/app/dashboard`);
          });

          router.refresh();
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(
          "Não foi possivel remover a tabela. Tente novamente mais tarde."
        );
      })
      .finally(() => {
        setDeleteTableModal(false);
      });
  }

  return (
    <Card>
      <NewRowModal
        onReload={reload}
        fields={fields}
        setOpen={setNewRowModal}
        open={newRowModal}
      />

      <DeleteModal
        confirm={handleDelete}
        open={deleteTableModal}
        setOpen={setDeleteTableModal}
      />

      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center gap-4">
          <Label htmlFor="filter">Filtro Global: </Label>
          <TextInput
            type="text"
            name="filter"
            placeholder="Pesquisa"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Tooltip content="Criar formulario">
            <CreateFormBtn
              tableId={tableId}
              tableName={tableName}
            ></CreateFormBtn>
          </Tooltip>

          <Tooltip content="Novo registro">
            <Button onClick={handleNewRow} color="blue">
              <PlusCircleIcon height="20" width="20" />
            </Button>
          </Tooltip>

          <Tooltip content="Editar tabela">
            <Button color="gray">
              <PencilSquareIcon
                height="20"
                width="20"
                onClick={handleEditTable}
              />
            </Button>
          </Tooltip>

          <Tooltip content="Remover tabela">
            <Button onClick={handleDeleteTable} color="red">
              <TrashIcon height="20" width="20" />
            </Button>
          </Tooltip>
        </div>
      </div>
      {/* <FilterPopover
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
        /> */}
    </Card>
  );
};
export default MenuTable;
