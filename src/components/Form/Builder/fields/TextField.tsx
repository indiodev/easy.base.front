"use client"

import { ElementsType, FormElement } from "../FormElements"
import { MdTextFields } from "react-icons/md"

const type: ElementsType = "TextField"

export const TextFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id,
        type,
        extraAttributes: {
            label: "Campo de Texto",
            helperText: "Texto de ajuda",
            required: false,
            placeHolder: "Digite algo aqui..."
        },
    }),
    desingerBtnElement: {
        icon: MdTextFields,
        label: "Campo de Texto"
    },
    desinerComponent: () => <div>Designer Component</div>,
    formComponent: () => <div>Designer Component</div>,
    propertiesComponents: () => <div>Designer Component</div>

}