"use client"

import { rSuiteComponents } from "@react-form-builder/components-rsuite";
import { BuilderView, FormBuilder } from "@react-form-builder/designer";

import initialTestForm from "./initialTestForm.json"

export default function DynamicFormBuilder() {

    const components = rSuiteComponents.map(c => c.build())

    const builderView = new BuilderView(components)

    const formName = "Dynamic Form"

    async function getForm(name?: string) {
        return JSON.stringify(initialTestForm)
    }


    return <FormBuilder view={builderView} formName={formName} getForm={getForm} />
}