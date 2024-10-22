import { Loading } from '@components/loading';
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
			<section className="flex h-full flex-1 flex-col gap-4 w-full overflow-y-auto">
				<div className="flex-1 w-full border border-indigo-100 bg-indigo-50/50 p-10 rounded-lg shadow-md flex flex-col gap-6">
					<h2 className="text-3xl font-medium text-indigo-600">
						Houve um problema ao buscar dados
					</h2>
				</div>
			</section>
		);
	}

	if (user_status === 'pending') {
		return (
			<Loading className="flex justify-center items-center h-full flex-1" />
		);
	}

	return (
		<div className="container max-w-full space-y-3 flex-1 w-full border border-indigo-100 bg-indigo-50/50 p-10 rounded-lg shadow-md flex flex-col gap-6 justify-center items-center">
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
							className="bg-indigo-600 hover:bg-indigo-500"
						>
							Editar
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
