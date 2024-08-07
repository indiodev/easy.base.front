"use client";

import { Navbar } from "flowbite-react";

export function TopNavbar() {
  const user = {
    name: "John Doe",
  };

  const name = user.name.split(" ")[0] ?? "User";

  return (
    <Navbar>
      <Navbar.Brand>
        <span className="self-end whitespace-nowrap text-lg font-semibold dark:text-white">
          Olá, {name}
        </span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link href="#">Remover Tabela</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
