"use client";

import Link from "next/link";
import { Navbar } from "flowbite-react";
import { useCookies } from "next-client-cookies";
import { useEffect } from "react";


export function TopNavbar() {

    const cookies = useCookies()
    const user = cookies.get('gbd-user') as any
    const name = JSON.parse(user).name.split(" ")[0]

    return (
        <Navbar >
            <Navbar.Brand>
                <span className="self-end whitespace-nowrap text-lg font-semibold dark:text-white">Olá, {name}</span>
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse>
                <Navbar.Link href="#">Remover Tabela</Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
}
