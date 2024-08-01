import { Active, DragOverlay, useDndMonitor } from "@dnd-kit/core"
import { useState } from "react"
import { SidebarBtnElementDragOverlay } from "./SidebarBtnElement"
import { ElementsType, FormElements } from "./FormElements"

export function DragOverlayWrapper() {

    const [draggedItem, setDraggdItem] = useState<Active | null>(null)

    useDndMonitor({
        onDragStart: (event) => {
            setDraggdItem(event.active)
        },
        onDragCancel: () => {
            setDraggdItem(null)
        },
        onDragEnd: () => {
            setDraggdItem(null)
        },
    })

    if (!draggedItem) return null

    let node = <div>No drag overlay</div>
    const isSidebarBtnElement = draggedItem?.data?.current?.isDesignerBtnElement

    if (isSidebarBtnElement) {
        const type = draggedItem?.data?.current?.type as ElementsType
        node = <SidebarBtnElementDragOverlay formElement={FormElements[type]} />
    }
    return (
        <DragOverlay>{node}</DragOverlay>
    )
}

export default DragOverlayWrapper