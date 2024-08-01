"use client"

import { FormElementInstance } from "@/components/Form/Builder/FormElements"
import { createContext, ReactNode, useState } from "react"

type DesignerContextType = {
    elements: FormElementInstance[]
    addElements: (index: number, element: FormElementInstance) => void
}

export const DesignerContext = createContext<DesignerContextType | null>(null)

export function DesignerContextProvider({ children }: { children: ReactNode }) {

    const [elements, setElements] = useState<FormElementInstance[]>([])

    function addElements(index: number, element: FormElementInstance) {
        setElements((prev) => {
            const newArray = [...prev]
            newArray.splice(index, 0, element)
            return newArray
        })

    }

    return <DesignerContext.Provider value={{ elements, addElements }}>{children}</DesignerContext.Provider>
}