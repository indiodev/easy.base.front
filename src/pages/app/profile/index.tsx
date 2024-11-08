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
import { useUserProfileQuery } from '@query/user/profile.query';
import { useForm } from 'react-hook-form';

export function Profile(): React.ReactElement {
	const { data: user, status: user_status } = useUserProfileQuery();
	const form = useForm();

	if (user_status === 'error') {
		return (
			<div className="container max-w-full flex-1 w-full border border-blue-100 bg-blue-50/50 p-10 rounded-lg shadow-md flex flex-col space-y-1 justify-center items-center">
				<h2 className="font-bold text-blue-500 text-xl">
					Houve um erro ao buscar dados do seu perfil
				</h2>
				<p className="font-semibold text-blue-500 text-xl">
					Tente novamente, mais tarde.
				</p>
			</div>
		);
	}

	return (
		<div className="container max-w-full space-y-3 flex-1 w-full border border-blue-100 bg-blue-50/50 p-10 rounded-lg shadow-md flex flex-col gap-6 justify-center items-center">
			{user_status === 'success' && (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit((data) => console.log(data))}
						className="w-2/3 space-y-6"
					>
						<FormField
							control={form.control}
							defaultValue={user?.name}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nome</FormLabel>
									<FormControl>
										<Input
											placeholder="shadcn"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							defaultValue={user?.email}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>E-mail</FormLabel>
									<FormControl>
										<Input
											placeholder="shadcn"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="inline-flex justify-end">
							<Button
								type="submit"
								className="bg-blue-600 hover:bg-blue-500"
							>
								Editar
							</Button>
						</div>
					</form>
				</Form>
			)}
		</div>
	);
}
