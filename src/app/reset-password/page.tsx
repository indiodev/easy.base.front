"use client";

import logo from "@/assets/logo.svg";
import { API } from "@/utils/api";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const router = useRouter();

  function send() {
    setLoading(true);

    API.post("/reset-password", {
      email,
    })
      .then((data) => {
        if (data.data.erro)
          toast.error("Não foi possível recuperar sua senha!");
        else {
          toast.success("Senha redefinida com sucesso. Verifique seu e-mail!");

          router.replace("/login");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(
          "Não foi possivel recuperar sua senha. Tente novamente mais tarde."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <main className="flex flex-1 w-screen h-screen items-center justify-center bg-gray-100 ">
      <div className="max-w-xl py-6 px-8 mt-20 bg-white rounded shadow-xl">
        <div className="my-6 flex items-center justify-center">
          <Link href="/login">
            <Image alt="Logo" className="h-10" src={logo} priority />
          </Link>
        </div>
        <form action="">
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-800 font-bold">
              E-mail:
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              name="email"
              id="email"
              placeholder="email@cett.dev"
              className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
            />
          </div>

          <a
            href="#!"
            type="button"
            onClick={() => !loading && send()}
            className="flex cursor-pointer py-2 px-4 items-center justify-center mt-6 bg-blue-500 hover:bg-blue-400 text-white font-bold w-full text-center rounded"
          >
            {!loading ? (
              "Redefinir senha"
            ) : (
              <ThreeDots
                visible={true}
                height="30"
                width="30"
                color="white"
                radius="9"
                ariaLabel="three-dots-loading"
              />
            )}
          </a>

          <Link
            href="/login"
            className="text-base text-center w-full text-gray-800 mt-2 inline-block hover:text-indigo-600"
          >
            Voltar
          </Link>
        </form>
      </div>
    </main>
  );
}
