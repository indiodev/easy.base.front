"use client";

import { Container } from "@/components/Container/Container";
import { Title } from "@/components/Container/Title";
import { FormBuilder } from "@/components/Form/Builder/FormBuilder";
import { FormType } from "@/contexts/types";
import { API } from "@/utils/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BuilderPage() {
  const params = useParams<{ id: string }>();

  const [form, setForm] = useState<FormType>();

  useEffect(() => {
    if (params!.id) {
      API.get(`/form/${params!.id}`)
        .then((response) => {
          setForm(response.data as FormType);
        })
        .catch((error) => {
          throw Error(error.response.data.message);
        });
    }
  });

  return (
    <Container className="h-full truncate">
      <Title>
        Construtor de Formulário: {form?.title} -{`>`} Tabela:{" "}
        {form?.table.title}
      </Title>

      <FormBuilder form={form!} />
    </Container>
  );
}
