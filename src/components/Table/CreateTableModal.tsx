"use client";

import { DATA_TYPES } from "@/contexts/types";
import { API } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { HiTrash } from "react-icons/hi";
import { ThreeDots } from "react-loader-spinner";
import { toast } from "react-toastify";
import { z } from "zod";

export type TableModalType = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const createTableSchema = z.object({
  title: z.string(),
  columns: z.array(z.any().nullable()),
});

type CreateTableSchema = z.infer<typeof createTableSchema>;

export function CreateTableModal({ open, setOpen }: TableModalType) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { control, register, handleSubmit, setValue, getValues, watch, reset } =
    useForm<CreateTableSchema>({
      resolver: zodResolver(createTableSchema),
    });

  const { append, remove, update, fields } = useFieldArray({
    control,
    name: "columns",
  });

  watch("title");

  const dataTypes = [DATA_TYPES.TEXT, DATA_TYPES.DATE, DATA_TYPES.SELECT];

  function handleCreate(data: CreateTableSchema) {
    console.log(data);

    setLoading(true);

    API.post("/tables", {
      data,
    })
      .then((data) => {
        if (data.data.erro) toast.error("Erro ao tentar criar tabela!");
        else {
          toast.success("Tabela criada com sucesso!");
          reset();
          router.push(`/app/table/${data.data.id}`);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(
          "Não foi possivel criar a tabela. Tente novamente mais tarde."
        );
      })
      .finally(() => {
        setLoading(false);
        onCloseModal();
      });
  }

  function onCloseModal() {
    setOpen(false);
  }

  function addColumn() {
    append({ title: "", type: "" });
  }
  function rmColumn(index: number) {
    remove(index);
  }

  function addOption(index: number) {
    var val = getValues("columns")[index];

    const aux = {
      ...val,
      config: {
        options: val.config?.options
          ? [...val.config.options, { name: "" }]
          : [{ name: "" }],
      },
    };

    var cols = getValues("columns");
    cols[index] = aux;

    setValue("columns", cols);
  }

  function rmOption(index: number, opc: number) {
    var val = getValues("columns")[index];

    val.config.options.splice(opc, 1);

    update(index, val);
  }

  return (
    <>
      <Modal show={open} size="xl" onClose={onCloseModal} popup>
        <Modal.Header />

        <Modal.Body>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Crie uma tabela
          </h3>
          <div className="space-y-2">
            <form
              name="form"
              onSubmit={handleSubmit(handleCreate)}
              className="flex flex-col gap-4"
            >
              <div>
                <Label htmlFor="title" value="Título" />
                <TextInput
                  placeholder="Insira o nome da tabela"
                  required
                  {...register("title")}
                />
              </div>

              <div className="flex gap-2 flex-row justify-between">
                <Label htmlFor="title" value="Colunas" />
                <Button
                  color="light"
                  size="xs"
                  className="self-start"
                  onClick={addColumn}
                >
                  Adicionar coluna
                </Button>
              </div>

              {fields.map((column, ind) => (
                <div key={column.id} className="gap-2 flex flex-col">
                  <div className="flex flex-row gap-2">
                    <TextInput
                      className="w-full"
                      placeholder="Titulo"
                      {...register(`columns.${ind}.title`)}
                    />
                    <Select
                      id="columnType"
                      className="w-full"
                      {...register(`columns.${ind}.type`)}
                    >
                      {dataTypes.map((type, index) => (
                        <option key={index} value={type.id}>
                          {type.title}
                        </option>
                      ))}
                    </Select>
                    {
                      <Button color="failure" onClick={() => rmColumn(ind)}>
                        <HiTrash className="h-5 w-5" />
                      </Button>
                    }
                  </div>

                  {watch(`columns.${ind}.type`) == "selectcell" && (
                    <div className="flex flex-col gap-2 p-2 border-gray-400 border rounded-lg shadow-sm">
                      <div className="flex gap-2 flex-row justify-between">
                        <Label htmlFor="title" value="Opções" />
                        <Button
                          color="light"
                          size="xs"
                          className="self-start"
                          onClick={() => addOption(ind)}
                        >
                          Adicionar Opcao
                        </Button>
                      </div>

                      {column.config?.options?.map(
                        (option: any, opc: number) => (
                          <div key={opc} className="flex flex-row gap-2">
                            <TextInput
                              className="w-full"
                              placeholder="Nome"
                              {...register(
                                `columns.${ind}.config.options.${opc}.name`
                              )}
                            />
                            <Button
                              color="failure"
                              onClick={() => rmOption(ind, opc)}
                            >
                              <HiTrash className="h-5 w-5" />
                            </Button>
                          </div>
                        )
                      )}

                      {/* <TextInput type="number" step={1} defaultValue={1} className="w-full" placeholder="Id" {...register(`columns.${ind}.config.id`)} /> */}
                      {/* <TextInput className="w-full" placeholder="Cor" {...register(`columns.${ind}.config.color`)} /> */}
                    </div>
                  )}
                </div>
              ))}

              <div className="flex justify-end gap-4">
                <Button color="gray" onClick={onCloseModal}>
                  Cancelar
                </Button>
                <Button color="blue" disabled={loading} type="submit">
                  {!loading ? (
                    "Confirmar"
                  ) : (
                    <ThreeDots
                      visible={true}
                      height="30"
                      width="30"
                      color="white"
                      radius="9"
                      ariaLabel="three-dots-loading"
                    />
                  )}
                </Button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
