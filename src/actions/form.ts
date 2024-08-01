import { FormType } from "@/contexts/types"
import api from "@/utils/api"

export async function GetFormById(id: string) {

    //check user is logged in

    await api.get(`/form/${id}`).then((response) => {
        return response.data as FormType
    }).catch((error) => {
        throw Error(error.response.data.message)
    })

    return {} as FormType

}