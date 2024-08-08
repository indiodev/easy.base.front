"use client";

import { TableType } from "@/contexts/types";
import { API } from "@/utils/api";
import { Sidebar } from "flowbite-react";
import { useCookies } from "next-client-cookies";
import { useParams, useRouter } from "next/navigation";
import { memo, useEffect, useState } from "react";
import {
  HiOutlineAdjustments,
  HiOutlineDatabase,
  HiOutlineHome,
  HiOutlineInbox,
  HiOutlineLogout,
  HiOutlinePlusSm,
  HiOutlineTable,
  HiOutlineUser,
  HiOutlineViewGrid,
} from "react-icons/hi";
import { CreateTableModal } from "../Table/CreateTableModal";

export const SidebarMenu = memo(function () {
  const router = useRouter();

  const [createTableModal, setCreateTableModal] = useState(false);

  const [tables, setTables] = useState<TableType[]>([]);
  const [loading, setLoading] = useState(false);

  const cookies = useCookies();

  const params = useParams<{ id: string }>();
  const tableId = params?.id;

  useEffect(() => {
    if (!loading) loadTables();
  }, []);

  function loadTables() {
    setLoading(false);

    API.get("/tables")
      .then((res) => {
        setTables(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleCreateTable() {
    setCreateTableModal(true);
  }

  function logout() {
    router.replace("/login");
  }

  return (
    <>
      <Sidebar aria-label="Menu Lateral" className="h-screen">
        <Sidebar.Logo href="#" img="/logo.png" imgAlt="logo"></Sidebar.Logo>
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Item href="/app/dashboard" icon={HiOutlineHome}>
              Início
            </Sidebar.Item>
            <Sidebar.Collapse
              open
              label="Tabelas"
              title="Tabelas"
              icon={HiOutlineDatabase}
            >
              <Sidebar.Item
                href="#"
                icon={HiOutlinePlusSm}
                className="text-sm"
                onClick={handleCreateTable}
              >
                Criar Tabela
              </Sidebar.Item>
              {tables.map((table: TableType, index: number) => (
                <Sidebar.Item
                  className={
                    tableId ? tableId == table.id && "bg-gray-200" : ""
                  }
                  key={index}
                  href={`/app/table/${table.id}`}
                  icon={HiOutlineTable}
                >
                  {table.title}
                </Sidebar.Item>
              ))}
            </Sidebar.Collapse>
            <Sidebar.Item href="/app/forms" icon={HiOutlineViewGrid}>
              Formulários
            </Sidebar.Item>
            <Sidebar.Item
              href="/app/notifications"
              icon={HiOutlineInbox}
              label="0"
            >
              Notificações
            </Sidebar.Item>
          </Sidebar.ItemGroup>

          <Sidebar.ItemGroup>
            <Sidebar.Item href="/app/users" icon={HiOutlineUser}>
              Usuários
            </Sidebar.Item>
            <Sidebar.Item href="/app/settings" icon={HiOutlineAdjustments}>
              Configurações
            </Sidebar.Item>
          </Sidebar.ItemGroup>

          <Sidebar.ItemGroup>
            <Sidebar.Item href="/app/profile" icon={HiOutlineUser}>
              Perfil
            </Sidebar.Item>
            <Sidebar.Item
              icon={HiOutlineLogout}
              onClick={logout}
              className="cursor-pointer"
            >
              Sair
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>

      <CreateTableModal open={createTableModal} setOpen={setCreateTableModal} />
    </>
  );
});
