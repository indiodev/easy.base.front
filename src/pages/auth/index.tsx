import { Button } from '@components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@components/ui/form';
import { Input } from '@components/ui/input';
import { useToast } from '@components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSignInMutation } from '@mutation/auth/sign-in.mutation';
import { AuthStore } from '@store/auth.store';
import { LoaderCircle } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { SignIn, SignInSchema } from './schema';

export function Auth(): React.ReactElement {
	const navigate = useNavigate();
	const auth = AuthStore();
	const { toast } = useToast();

	const form = useForm<SignIn>({
		resolver: zodResolver(SignInSchema),
	});

	const { status, mutateAsync: signIn } = useSignInMutation({
		onSuccess(data) {
			auth.append(data);
			navigate('/app/dashboard');
			toast({
				title: 'Login realizado',
				description: 'Seja bem-vindo(a)!',
				className: 'bg-green-500 text-white',
			});
		},
		onError(error) {
			// if (
			// 	error instanceof AxiosError &&
			// 	error.response?.data.code === 'INVALID_CREDENTIAL'
			// ) {
			// 	form.setError('password', {
			// 		message: error.response?.data.message,
			// 	});
			// 	return;
			// }

			toast({
				title: 'Erro ao fazer login',
				description: 'Ops, algo deu errado. Tente novamente mais tarde.',
				className: 'bg-red-500 text-white',
			});
			console.error(error);
		},
	});

	const onSignIn = form.handleSubmit((data) => {
		signIn(data);
	});
	return (
		<section className="flex flex-1 flex-col w-full h-screen items-center justify-center">
			<Form {...form}>
				<form
					onSubmit={onSignIn}
					className="max-w-[32.5rem] w-full flex flex-col gap-4 shadow-2xl p-8 rounded-2xl"
				>
					<div className="flex justify-center pt-4 pb-2">
						<img
							src="/logo.png"
							alt="Logo Easy Base"
							className="w-56 object-cover"
							loading="lazy"
						/>
					</div>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>E-mail</FormLabel>
								<FormControl>
									<Input
										placeholder="johndoe@gmail.com"
										{...field}
									/>
								</FormControl>
								<FormMessage className="text-right" />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Senha</FormLabel>
								<FormControl>
									<Input
										type="password"
										placeholder="********************"
										{...field}
									/>
								</FormControl>

								<FormMessage className="text-right" />
							</FormItem>
						)}
					/>
					<Button
						type="submit"
						className="w-full bg-indigo-500 hover:bg-indigo-600"
						disabled={status === 'pending'}
					>
						{status === 'pending' && (
							<LoaderCircle className="w-6 h-6 animate-spin" />
						)}
						{!(status === 'pending') && <span>Entrar</span>}
					</Button>
				</form>
			</Form>
		</section>
	);
}
