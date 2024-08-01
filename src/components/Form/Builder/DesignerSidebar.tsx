import { FormElements } from "./FormElements";
import { SidebarBtnElement } from "./SidebarBtnElement";

export function DesignerSidebar() {
    return (
        <aside className="w-[400px] max-w-[400px] flex flex-col flex-grow gap-2 border-l-2 border-muted p-4 bg-white overflow-y-auto h-full">
            Elementos
            <div className="grid grid-cols-2">
                <SidebarBtnElement formElement={FormElements.TextField} />
            </div>
        </aside>
    )
}