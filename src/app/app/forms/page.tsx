"use client";

import { Container } from "@/components/Container/Container";
import { Title } from "@/components/Container/Title";
import { FormType } from "@/contexts/types";
import { API } from "@/utils/api";
import { CheckIcon, CircleStackIcon } from "@heroicons/react/24/outline";
import { Badge, Button, Card } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { toast } from "react-toastify";

export default function Forms() {
  const router = useRouter();

  const [forms, setForms] = useState<FormType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  function fetchForms() {
    API.get("/form")
      .then((response) => {
        setForms(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchForms();
  }, []);

  function publish(id: string) {
    // to do
    //toast.info("Funcionalidade em construção")
    create(id);
  }

  function create(id: string) {
    console.log(id);
    router.push(`/app/builder/${id}`);
    toast.dark("Redirecionando");
  }

  function viewSubmissions(id: string) {
    // to do
    toast.info("Funcionalidade em construção");
  }

  return (
    <Container className="h-full flex flex-col gap-2">
      <Title>Formulários</Title>

      {/* <div className="flex w-full justify-end gap-2">
                <Button color="gray" href="/form">
                    <EyeIcon width={20} height={20} color="gray" />
                    Visualizar (Estático)
                </Button>
                <Button color="blue" href="/app/forms/new">
                    <PlusCircleIcon width={20} height={20} />
                    Novo
                </Button>
            </div> */}
      {!loading && (
        <div className="grid gap-4 grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {forms.map((form) => (
            <Card key={form.id}>
              <h6 className="text-xl flex flex-row justify-between gap-2 font-semibold leading-4 tracking-tight text-gray-900 dark:text-white truncate">
                {form.title}

                {form.published && (
                  <Badge
                    icon={CheckIcon}
                    className="pr-2 rounded-full"
                    color="info"
                  >
                    {form.submissions}{" "}
                  </Badge>
                )}
              </h6>
              <Link
                href={`/app/table/${form.tableId}`}
                className="font-normal bg-blue-50 self-start p-1 rounded-md leading-3 text-blue-700 dark:text-blue-200 truncate flex flex-row gap-1 items-center"
              >
                <CircleStackIcon width={20} height={20} color="blue-700" />{" "}
                {form.table?.title}
              </Link>
              <p className="font-normal text-sm text-gray-700 dark:text-gray-400 truncate line-clamp-2">
                {form.description}
              </p>

              {!form.published && (
                <Button
                  onClick={() => publish(form.id)}
                  color="info"
                  pill
                  size="sm"
                >
                  Publicar
                </Button>
              )}
              {form.published && (
                <Button
                  onClick={() => viewSubmissions(form.id)}
                  color="green"
                  pill
                  size="sm"
                >
                  Ver submissões
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}
      {loading && (
        <div className="flex w-full h-full flex-1 justify-center items-center">
          <ThreeDots
            visible={true}
            height="100"
            width="100"
            color="#549eff"
            radius="9"
            ariaLabel="three-dots-loading"
          />
        </div>
      )}
    </Container>
  );
}
