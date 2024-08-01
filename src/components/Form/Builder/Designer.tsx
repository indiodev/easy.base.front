"use client"

import { useDroppable } from "@dnd-kit/core"
import { DesignerSidebar } from "./DesignerSidebar"
import { FormElementInstance } from "./FormElements"
import { useState } from "react"
import useDesigner from "@/components/hooks/useDesigner"

export function Designer() {

    const { elements, addElements } = useDesigner()

    const droppable = useDroppable({
        id: "designer-drop-area",
        data: {
            isDesignerDropArea: true
        }
    })

    return (
        <div className="flex w-full h-full">
            <div className="p-4 w-full">
                <div
                    ref={droppable.setNodeRef}
                    className={"bg-white max-w-[920px] p-2 h-full m-auto rounded-xl flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto " + (droppable.isOver && "ring-2  ring-blue-200")}>

                    {
                        !droppable.isOver && (
                            <p className="text-3xl text-muted-foreground flex flex-grow items-center font-medium">
                                Arraste e solte aqui
                            </p>
                        )
                    }
                    {
                        droppable.isOver && (
                            <div className="h-[120px] rounded-md w-full bg-gray-100"></div>
                        )
                    }
                </div>


            </div>
            <DesignerSidebar />
        </div>
    )
}