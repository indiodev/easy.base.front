import { FormType } from "@/contexts/types";
import { Designer } from "./Designer";
import { DndContext } from "@dnd-kit/core";
import DragOverlayWrapper from "./DragOverlayWrapper";

export function FormBuilder({ form }: { form: FormType }) {
    return (
        <DndContext>
            <div className="flex w-full flex-grow items-center justify-center relative overflow-y-auto h-full bg-gray-200 bg-[url(/bg-builder.svg)]">
                <Designer />
            </div>
            <DragOverlayWrapper />
        </DndContext>
    )
}