"use client"

import { rSuiteComponents } from "@react-form-builder/components-rsuite";
import { FormViewer, BuilderView } from "@react-form-builder/core";

import initialTestForm from "./initialTestForm.json"

export default function DynamicFormViewer() {

    const components = rSuiteComponents.map(c => c.build())

    const builderView = new BuilderView(components)

    const formName = "Dynamic Form Viewer"

    async function getForm(name?: string) {
        return JSON.stringify(initialTestForm)
    }


    return <FormViewer view={builderView} formName={formName} getForm={getForm} />
}