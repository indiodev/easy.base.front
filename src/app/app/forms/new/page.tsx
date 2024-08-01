"use client"

import { Container } from "@/components/Container/Container";
import { Title } from "@/components/Container/Title";
import dynamic from 'next/dynamic'

export default function NewForm() {

    const DynamicFormBuilder = dynamic(() => import('@/components/Form/DynamicFormBuilder'), {
        ssr: false
    })

    return (
        <Container className="h-full overflow-y-auto">
            <Title>Novo Formulario</Title>

            <DynamicFormBuilder />
        </Container>

    )
}