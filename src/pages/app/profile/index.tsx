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

	return (
		<div className="container max-w-full space-y-3 flex-1 w-full border border-indigo-100 bg-indigo-50/50 p-10 rounded-lg shadow-md flex flex-col gap-6 justify-center items-center">
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
								className="bg-indigo-600 hover:bg-indigo-500"
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
