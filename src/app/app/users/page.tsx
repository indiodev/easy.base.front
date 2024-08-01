"use client"

import { Container } from "@/components/Container/Container";
import { Title } from "@/components/Container/Title";
import { UserType } from "@/contexts/types";
import api from "@/utils/api";
import { Button, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { PencilSquareIcon, PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

export default function Users() {

    const [users, setUsers] = useState([])
    const [roles, setRoles] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!loading) {
            loadUsers()
            loadRoles()
        }
    }, [])


    function loadUsers() {
        setLoading(true)

        api.get('/users').then((res) => {
            setUsers(res.data)
            console.log(res.data)
        }).catch(err => {
            console.log(err)
        }).finally(() => {
            setLoading(false)
        })
    }

    function loadRoles() {
        setLoading(true)
        api.get('/roles').then((res) => {
            setRoles(res.data)
            console.log(res.data)
        }).catch(err => {
            console.log(err)
        }).finally(() => {
            setLoading(false)
        })

    }

    function manutencao() {
        toast.info('Ação em manutenção! Tente novamente mais tarde.');
    }

    function addUser() {
        manutencao()
    }

    function removeUser(user: UserType) {
        manutencao()
    }

    function editUser(user: UserType) {
        manutencao()
    }


    return (
        <Container className="h-full flex flex-col gap-2">
            <Title>
                Usuários
            </Title>

            <div className="flex w-full justify-end">
                <Button color="blue" onClick={addUser}>
                    <PlusCircleIcon width={20} height={20} />
                    Adicionar
                </Button>
            </div>

            <div>
                <Table>
                    <Table.Head>
                        <Table.HeadCell>ID</Table.HeadCell>
                        <Table.HeadCell>Nome</Table.HeadCell>
                        <Table.HeadCell>E-mail</Table.HeadCell>
                        <Table.HeadCell>Grupo</Table.HeadCell>
                        <Table.HeadCell>Função</Table.HeadCell>
                        <Table.HeadCell>Reviews</Table.HeadCell>
                        <Table.HeadCell>Ações</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {users.map((user: UserType, index: number) =>
                            <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell>{index}</Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {user.name}
                                </Table.Cell>
                                <Table.Cell>{user.email}</Table.Cell>
                                <Table.Cell>{user.group?.title}</Table.Cell>
                                <Table.Cell>{user.role ?? "Indefinido"}</Table.Cell>
                                <Table.Cell>{user.reviews?.length}</Table.Cell>
                                <Table.Cell className="gap-2 flex flex-row">
                                    <Button color="cyan" onClick={() => editUser(user)}>
                                        <PencilSquareIcon width={20} height={20} />
                                    </Button>
                                    <Button color="red" onClick={() => removeUser(user)}>
                                        <TrashIcon width={20} height={20} />
                                    </Button>
                                </Table.Cell>
                            </Table.Row>)}


                    </Table.Body>
                </Table>


            </div>
        </Container>

    )
}