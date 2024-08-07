"use client";

import { ColumnType, DATA_TYPES } from "@/contexts/types";
import { API } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { useParams, useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { ptBR } from "date-fns/locale";
import TDatePicker, {
  registerLocale,
  setDefaultLocale,
} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ThreeDots } from "react-loader-spinner";
registerLocale("ptBr", ptBR);
setDefaultLocale("br");

export type NewRowModalType = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  fields: [];
  onReload: () => void;
};

const DatePicker = TDatePicker as any;

const newRowSchema = z.object({
  data: z.any(),
});

type newRowSchema = z.infer<typeof newRowSchema>;

export function NewRowModal({
  open,
  setOpen,
  fields,
  onReload,
}: NewRowModalType) {
  const [loading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>() || { id: null };
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { control, register, handleSubmit, setValue, getValues, watch, reset } =
    useForm<newRowSchema>({
      resolver: zodResolver(newRowSchema),
    });

  const dataTypes = [DATA_TYPES.TEXT, DATA_TYPES.DATE, DATA_TYPES.SELECT];

  function onSubmit(data: newRowSchema) {
    if (loading) return;

    setLoading(true);

    API.post(`/tables/${id}/row`, {
      ...data,
    })
      .then((data) => {
        if (data.data.erro) toast.error("Erro ao tentar criar registro!");
        else {
          // console.log(data.data)
          toast.success("Registro criado com sucesso!");
          reset();
          // startTransition(() => {
          //   router.replace(`/app/table/${id}`)
          // });
          router.refresh();
          onReload();
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(
          "Não foi possivel criar o registro. Tente novamente mais tarde."
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

  type DynamicFieldType = {
    field: ColumnType;
  };
  function GeneratedFieldInput({ field }: DynamicFieldType) {
    if (field.type == "selectcell" || field.identifier == "selectcell") {
      const options = field.config?.options.map((opt: any) => ({
        name: opt.name,
        id: opt.id || opt.name,
        color: opt.color || "blue",
      }));

      return (
        <Select id="countries" required {...register(`data.${field.slug}`)}>
          <option>Nenhum</option>
          {options?.map((status: any, index: number) => (
            <option key={index} value={status.id}>
              {status.name}
            </option>
          ))}
        </Select>
      );
    }
    if (field.type == "datecell")
      return (
        <TextInput
          type="datetime-local"
          placeholder={`Por favor, informe o: ${field.title}`}
          required
          {...register(`data.${field.slug}`)}
        />
      );

    if (field.type == "editablecell")
      return (
        <TextInput
          placeholder={`Por favor, informe o: ${field.title}`}
          required
          {...register(`data.${field.slug}`)}
        />
      );
  }

  return (
    <>
      <Modal show={open} size="xl" onClose={onCloseModal} popup>
        <Modal.Header />

        <Modal.Body>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Insira um registro
          </h3>
          <div className="space-y-2">
            <form
              name="form"
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              {fields.map((field: ColumnType, index: number) => (
                <div key={index}>
                  <Label htmlFor={`data.${field.slug}`} value={field.title} />

                  <GeneratedFieldInput field={field} />
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
