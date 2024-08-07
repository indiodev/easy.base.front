"use client";

import { CreateFormBtnProps, formSchema } from "@/schemas/form";
import { API } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Label, Modal, TextInput, Textarea } from "flowbite-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { MdAssignmentAdd } from "react-icons/md";
import { toast } from "react-toastify";
import * as z from "zod";

type formSchemaType = z.infer<typeof formSchema>;

export function CreateFormBtn({ tableId, tableName }: CreateFormBtnProps) {
  const { id } = useParams<{ id: string }>() || { id: null };

  const [open, setOpen] = useState(false);

  const { handleSubmit, register, getValues, formState, setValue } =
    useForm<formSchemaType>({
      resolver: zodResolver(formSchema),
    });

  function onSubmit(values: formSchemaType) {
    try {
      API.post("/forms", {
        data: {
          ...values,
          tableId,
        },
      }).then((data) => {
        if (data.data.erro) toast.error("Erro ao tentar criar formulario!");
        else {
          toast.success("Formulario criado com sucesso!");
          // Redirect to form id where data.id is the id of the form created
          setOpen(false);
        }
      });
    } catch (error) {
      console.error(error);
      toast.error("Não criar o formulario. Tente novamente mais tarde");
    }
  }

  return (
    <>
      <Button color="gray" onClick={() => setOpen(true)}>
        <MdAssignmentAdd size={20} />
      </Button>
      <Modal show={open} size="md" onClose={() => setOpen(false)} popup>
        <Modal.Header>+ Criar formulario</Modal.Header>
        <Modal.Body>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div>
              <div className="mb-2 block">
                <Label htmlFor="title" value="Titulo" />
              </div>
              <TextInput
                {...register("title")}
                id="title"
                type="text"
                placeholder={"Formulario de " + tableName}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="description" value="Descrição" />
              </div>
              <Textarea
                {...register("description")}
                id="description"
                placeholder="Escreva uma descrição..."
                required
                rows={4}
              />
            </div>
            <div className="flex justify-between gap-4">
              <Button
                color="blue"
                type="submit"
                disabled={formState.isSubmitting}
              >
                Confirmar
                {formState.isSubmitting && (
                  <div className="loader loader-white ml-2"></div>
                )}
                {!formState.isSubmitting && "Confirmar"}
              </Button>
              <Button color="gray" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
