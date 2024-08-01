"use client"

import dynamic from "next/dynamic"

export default function Form() {

    const DynamicFormViewer = dynamic(async () => import("@/components/Form/DynamicFormViewer"), {
        ssr: false
    })

    return (
        <main className="flex flex-1 w-screen h-screen items-center justify-center bg-gray-100 ">
            <div className="max-w-2xl py-6 px-8 mt-20 bg-white rounded shadow-xl overflow-y-auto">
                <DynamicFormViewer />
            </div>
        </main>
    )
}