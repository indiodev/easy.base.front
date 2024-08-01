import { SidebarMenu } from "@/components/Sidebar/Sidebar";
import Image from "next/image";
import bg from '@/assets/fundo.svg'

export default function Dashboard() {
    return (
        <div className="flex w-full h-full flex-1 bg-gray-200 p-4 items-center justify-center">
            <Image src={bg} alt="bg" priority />
        </div>

    )
}