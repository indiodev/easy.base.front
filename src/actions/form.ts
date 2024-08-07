import { FormType } from "@/contexts/types";
import { API } from "@/utils/api";

export async function GetFormById(id: string) {
  //check user is logged in

  await API.get(`/form/${id}`)
    .then((response) => {
      return response.data as FormType;
    })
    .catch((error) => {
      throw Error(error.response.data.message);
    });

  return {} as FormType;
}
