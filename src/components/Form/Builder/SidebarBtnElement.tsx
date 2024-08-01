import { Button } from "flowbite-react";
import { FormElement } from "./FormElements";
import { useDraggable } from "@dnd-kit/core";

export function SidebarBtnElement({ formElement }: { formElement: FormElement }) {

    const { label, icon: Icon } = formElement.desingerBtnElement

    const draggable = useDraggable({
        id: `designer-btn-${formElement.type}`,
        data: {
            type: formElement.type,
            isDesignerBtnElement: true
        }

    })

    return (
        <Button
            ref={draggable.setNodeRef}
            draggable={true}
            color="gray"
            className="w-full py-3 cursor-grab"
            {...draggable.listeners}
            {...draggable.attributes}>
            <div className={"flex flex-col items-center justify-center " + (draggable.isDragging && "ring-2 ring-primary")}>
                <Icon className="h-6 w-6" />
                <p className="text-sm">
                    {label}
                </p>
            </div>

        </Button>
    )
}

export function SidebarBtnElementDragOverlay({ formElement }: { formElement: FormElement }) {

    const { label, icon: Icon } = formElement.desingerBtnElement


    return (
        <Button
            draggable={true}
            color="gray">
            <div className="flex flex-col items-center justify-center ">
                <Icon className="h-6 w-6" />
                <p className="text-sm">
                    {label}
                </p>
            </div>

        </Button>
    )
}