'use client';

import { useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation";
import { z } from 'zod';
// import { GetServerSidePropsContext } from "next";
// import { getServerSession } from "next-auth";



import { Logo } from "@/assets";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { api } from "@/lib/api";
import { authOptions } from "./api/auth/[...nextauth]";

// export async function getServerSideProps(ctx: GetServerSidePropsContext) {
//   const session = await getServerSession(ctx.req, ctx.res, authOptions);

//   if (session) {
//     return {
//       redirect: {
//         destination: "/home",
//         permanent: false,
//       },
//     };
//   }
// }

const formSchema = z.object({
  username: z.string({ required_error: 'O username é obrigatório.' }),
  password: z.string({ required_error: 'A senha é obrigatória.' }),
});

export default function Home() {
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const router = useRouter();

  async function handleSubmit(data: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      const response = await api.post('/sessions', data)

      console.log(response.data)

      router.push('/home')
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  async function handleRegister() {
    router.push('/register')
  }

  return (
    <main className="flex h-screen">
      <div className="w-1/2 h-full flex flex-col justify-center items-center gap-5">
        <Image src={Logo} alt="Logo Y" />

        <h2 className="text-lg  text-center">
          <span className="text-blue-400 font-bold">Y</span>? because everything is <span className="text-blue-400 font-bold">connected</span>
        </h2>
      </div>
      <div className="w-1/2 flex justify-center items-center">
        <div className="flex flex-col justify-center items-center border-2 p-20 rounded-md">
          <Image src={Logo} alt="Logo Y" height={75} />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="w-64 h-64 flex flex-col justify-center items-center gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <button className="w-full text-sm p-2 font-bold text-white bg-blue-400 rounded-full" type="submit" disabled={loading}>Login</button>
            </form>
          </Form>

          <p className="text-sm">Não tem conta? <span className='text-blue-400 font-bold hover:cursor-pointer' onClick={handleRegister}>Cadastre-se</span></p>
        </div>
      </div>
    </main >
  )
}
