"use client"

import Image from 'next/image'
import { toast } from 'react-toastify'
import logo from '@/assets/logo.svg'
import api from '@/utils/api'
import { useState } from 'react'
import { ThreeDots } from 'react-loader-spinner'
import { useRouter } from 'next/navigation'
import { useCookies } from 'next-client-cookies';
import Link from 'next/link'

export default function Login() {

    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const router = useRouter()

    const cookies = useCookies()

    function login() {

        // toast.error('Sistema em manutenção. Tente novamente mais tarde.');
        // return;

        setLoading(true)

        api.post('/login', {
            email, password
        }).then(data => {
            if (data.data.erro)
                toast.error('Credenciais inválidas!');
            else {

                cookies.set('gbd-user', JSON.stringify(data.data))
                toast.success('Autenticado com sucesso!');

                router.replace('/app/dashboard')
            }

        }).catch(err => {
            console.log(err)
            toast.error('Não foi possivel autenticar. Tente novamente mais tarde.');
        }).finally(() => {
            setLoading(false)
        });


    }

    return (
        <main className="flex flex-1 w-screen h-screen items-center justify-center bg-gray-100 ">
            <div className="max-w-xl py-6 px-8 mt-20 bg-white rounded shadow-xl">
                <div className="my-6 flex items-center justify-center">
                    <Image alt="Logo" className='h-10' src={logo} priority />
                </div>
                <form action="">
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-gray-800 font-bold">E-mail:</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" placeholder="email@cett.dev" className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600" />
                    </div>
                    <div>
                        <label htmlFor="passowrd" className="block text-gray-800 font-bold">Senha:</label>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" name="passowrd" id="passowrd" placeholder="*******" className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600" />
                        <Link href="/reset-password" className="text-sm font-thin text-gray-800 mt-2 inline-block hover:text-indigo-600">Esqueci minha senha</Link>
                    </div>
                    <a href="#!" type='button' onClick={() => !loading && login()} className="flex cursor-pointer py-2 px-4 items-center justify-center mt-6 bg-blue-500 hover:bg-blue-400 text-white font-bold w-full text-center rounded">
                        {!loading ? 'Login' : <ThreeDots
                            visible={true}
                            height="30"
                            width="30"
                            color="white"
                            radius="9"
                            ariaLabel="three-dots-loading"
                        />}
                    </a>
                </form>
            </div>
        </main>
    )
}