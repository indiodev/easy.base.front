"use client"

import { Card, FileInput } from "flowbite-react";
import { Container } from "@/components/Container/Container";
import { useState } from "react";
import { Title } from "@/components/Container/Title";

export default function Settings() {

    const [logo, setLogo] = useState('')


    return (
        <Container className="h-full">
            <Title>Configurações</Title>

            <div className="">
                <h5>Logotipo da aplicação</h5>
                <FileInput
                    value={logo}
                    onChange={(e) => setLogo(e.target.value)}
                    accept=".png, .jpg, .jpeg, .svg"
                    className="w-full h-full overflow-hidden text-ellipsis text-nowrap text-sm bg-transparent py-2"
                />
            </div>

            <h6>
                Em desenvolvimento.
            </h6>
        </Container>
    )
}   