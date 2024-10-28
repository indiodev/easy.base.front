/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@components/ui/dialog';

import { Button } from '@components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@components/ui/form';
import { Input } from '@components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { tanstack } from '@libs/tanstack';
import { cn } from '@libs/utils';
import { QUERY } from '@models/base.model';
import { useTableCreateMutation } from '@mutation/table/new.mutation';
import { LoaderCircle } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Schema, Type } from './schema';

const NewTable = React.forwardRef<
	React.ElementRef<typeof DialogTrigger>,
	React.ComponentPropsWithoutRef<typeof DialogTrigger>
>(({ ...props }, ref) => {
	const [open, setOpen] = React.useState(false);

	const navigate = useNavigate();
	const form = useForm<Type>({
		resolver: zodResolver(Schema),
	});

	const { mutateAsync: create_table, status: create_table_status } =
		useTableCreateMutation({
			onError(error) {
				console.error(error);
			},
			onSuccess(data) {
				form.reset({
					title: '',
				});
				tanstack.refetchQueries({
					queryKey: [QUERY.TABLE_LIST],
				});
				setOpen((state) => !state);
				navigate({
					pathname: `/app/tables/${data._id}`,
				});
			},
		});

	const onSubmit = form.handleSubmit((data) => {
		create_table(data);
	});

	return (
		<Dialog
			modal
			open={open}
			onOpenChange={(o) => {
				form.reset();
				setOpen(o);
			}}
		>
			<DialogTrigger
				className="hidden"
				ref={ref}
				{...props}
			/>
			<DialogContent className="py-4 px-6">
				<DialogHeader>
					<DialogTitle className="text-lg font-medium">
						Crie uma nova tabela
					</DialogTitle>

					<DialogDescription className="sr-only">
						Crie uma nova tabela
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={onSubmit}
						className="flex flex-col gap-4 w-full"
					>
						<span className="text-sm font-normal text-red-400">
							* os campos em vermelho são obrigatórios
						</span>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => {
								const hasError = !!form.formState.errors.title;
								return (
									<FormItem className="space-y-1">
										<FormLabel>Nome</FormLabel>
										<FormControl>
											<Input
												placeholder="Insira o nome da tabela"
												className={cn(
													'focus-visible:ring-indigo-300 focus-visible:ring-0',
													hasError && 'border-red-500',
												)}
												{...field}
											/>
										</FormControl>
										{/* <FormMessage className="text-right" /> */}
									</FormItem>
								);
							}}
						/>

						<div className="inline-flex justify-end w-full gap-4 pt-4">
							<Button className="bg-indigo-700 hover:bg-indigo-600 border border-transparent py-2 px-3 rounded-lg text-neutral-50 max-w-40 w-full">
								{create_table_status === 'pending' && (
									<LoaderCircle className="w-6 h-6 animate-spin" />
								)}
								{!(create_table_status === 'pending') && <span>Criar</span>}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
});

NewTable.displayName = 'NewTable';

export { NewTable };
