/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Loading } from '@components/loading';
import { Button } from '@components/ui/button';
import { Calendar } from '@components/ui/calendar';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@components/ui/form';
import { Input } from '@components/ui/input';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@components/ui/popover';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@components/ui/select';
import { Textarea } from '@components/ui/textarea';
import { tanstack } from '@libs/tanstack';
import { cn } from '@libs/utils';
import { COLUMN_TYPE, QUERY } from '@models/base.model';
import { useRowCreateMutation } from '@mutation/row/new.mutation';
import { useColumnFindManyByTableIdQuery } from '@query/column/find-many-by-table-id';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { CalendarIcon, LoaderCircle } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { Relational } from '../field/relational';

const NewRow = React.forwardRef<
	React.ElementRef<typeof DialogTrigger>,
	React.ComponentPropsWithoutRef<typeof DialogTrigger>
>(({ ...props }, ref) => {
	const [open, setOpen] = React.useState(false);
	const params = useParams();

	const { data: columns, status: columns_status } =
		useColumnFindManyByTableIdQuery({
			tableId: params?.id || '',
		});

	const { mutateAsync: create_row, status: create_row_status } =
		useRowCreateMutation({
			onError(error) {
				console.log(error);
			},
			onSuccess(data) {
				tanstack.refetchQueries({
					queryKey: [QUERY.TABLE_SHOW, params?.id!],
				});
				console.log(data);
				setOpen(false);
			},
		});

	const form = useForm();

	const onSubmit = form.handleSubmit((data) => {
		const entries = Object.entries(data);
		const existEmpty = entries.some(([, value]) => !value || value === '');

		for (const [key, value] of entries) {
			if (!value) {
				form.setError(key, {
					message: 'Este campo é obrigatório',
				});
			}
		}

		if (existEmpty) return;

		const payload = new FormData();

		for (const [key, value] of entries) {
			payload.append(key, value);
		}

		create_row({ data: payload, id: params?.id! });
	});

	const formHasError = Object.keys(form.formState.errors).length > 0;

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
						Crie um registro
					</DialogTitle>

					<DialogDescription className="sr-only">
						Crie um registro
					</DialogDescription>
				</DialogHeader>

				{columns_status === 'pending' && (
					<Loading className="flex justify-center items-center h-auto flex-1" />
				)}
				{columns_status === 'success' && !(columns.length > 0) && (
					<h2 className="font-semibold text-center">
						Necessário adicionar campos (colunas) à sua tabela
					</h2>
				)}
				{columns_status === 'success' && columns.length > 0 && (
					<Form {...form}>
						<form
							className={cn(
								columns.length > 5 && 'grid grid-cols-2 gap-4',
								!(columns.length > 5) && 'flex flex-col gap-4',
							)}
							onSubmit={onSubmit}
						>
							{columns.map((column) => {
								if (column?.type === COLUMN_TYPE.DATE) {
									return (
										<FormField
											key={column._id}
											control={form.control}
											name={column.slug}
											defaultValue={new Date()}
											render={({ field }) => {
												const hasError = !!form.formState.errors[column.slug];
												return (
													<FormItem className="flex flex-col w-full">
														<FormLabel>{column.title}</FormLabel>
														<Popover>
															<PopoverTrigger asChild>
																<FormControl>
																	<Button
																		variant={'outline'}
																		className={cn(
																			'w-full pl-3 text-left font-normal',
																			!field.value && 'text-muted-foreground',
																			hasError && 'border-red-500',
																		)}
																	>
																		{field.value ? (
																			format(field.value, 'PPP')
																		) : (
																			<span>Selecione uma data</span>
																		)}
																		<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
																	</Button>
																</FormControl>
															</PopoverTrigger>
															<PopoverContent
																className="w-auto p-0"
																align="start"
															>
																<Calendar
																	locale={ptBR}
																	mode="single"
																	selected={field.value}
																	onSelect={field.onChange}
																	disabled={(date) =>
																		date > new Date() ||
																		date < new Date('1900-01-01')
																	}
																	initialFocus
																/>
															</PopoverContent>
														</Popover>

														{/* <FormMessage /> */}
													</FormItem>
												);
											}}
										/>
									);
								}

								if (column?.type === COLUMN_TYPE.LONG_TEXT)
									return (
										<FormField
											key={column._id}
											control={form.control}
											name={column.slug}
											render={({ field }) => {
												const hasError = !!form.formState.errors[column.slug];
												return (
													<FormItem>
														<FormLabel>{column.title}</FormLabel>
														<FormControl>
															<Textarea
																placeholder={column.title}
																className={cn(
																	'focus-visible:ring-blue-300',
																	hasError && 'border-red-500',
																)}
																{...field}
															/>
														</FormControl>

														{/* <FormMessage /> */}
													</FormItem>
												);
											}}
										/>
									);

								// if (column.type === COLUMN_TYPE.FILE)
								// 	return (
								// 		<FormField
								// 			key={column.id}
								// 			control={form.control}
								// 			name={column.slug}
								// 			render={() => {
								// 				const hasError = !!form.formState.errors[column.slug];
								// 				return (
								// 					<FormItem className="space-y-1">
								// 						<FormLabel>{column.title}</FormLabel>
								// 						<FormControl>
								// 							<Input
								// 								onChange={(event) => {
								// 									if (event.target.files?.length === 0) {
								// 										form.setValue(column.slug, undefined);
								// 										return;
								// 									}
								// 									form.setValue(
								// 										column.slug,
								// 										event.target.files![0],
								// 									);
								// 									form.clearErrors(column.slug);
								// 								}}
								// 								type="file"
								// 								placeholder={column.title}
								// 								className={cn(
								// 									'focus-visible:ring-blue-300',
								// 									hasError && 'border-red-500',
								// 								)}
								// 								// {...field}
								// 							/>
								// 						</FormControl>
								// 					</FormItem>
								// 				);
								// 			}}
								// 		/>
								// 	);

								if (column?.type === COLUMN_TYPE.DROPDOWN)
									return (
										<FormField
											key={column._id}
											control={form.control}
											name={column.slug}
											render={({ field }) => {
												const hasError = !!form.formState.errors[column.slug];
												return (
													<FormItem>
														<FormLabel>{column.title}</FormLabel>
														<Select
															onValueChange={field.onChange}
															defaultValue={field.value}
														>
															<FormControl>
																<SelectTrigger
																	className={cn(hasError && 'border-red-500')}
																>
																	<SelectValue placeholder="Selecione uma opção" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																{column.config?.options?.map(
																	(option, index) => (
																		<SelectItem
																			key={index}
																			value={option.name}
																		>
																			{option.name}
																		</SelectItem>
																	),
																)}
															</SelectContent>
														</Select>

														{/* <FormMessage /> */}
													</FormItem>
												);
											}}
										/>
									);

								if (
									column?.type === COLUMN_TYPE.RELATIONAL ||
									column?.type === COLUMN_TYPE.MULTIRELATIONAL
								)
									return (
										<Relational
											key={column._id}
											column={column}
										/>
									);
								// return (
								// 	<FormField
								// 		key={column._id}
								// 		control={form.control}
								// 		name={column.slug}
								// 		render={({ field }) => {
								// 			const hasError = !!form.formState.errors[column.slug];
								// 			return (
								// 				<FormItem>
								// 					<FormLabel>{column.title}</FormLabel>
								// 					<Select
								// 						onValueChange={field.onChange}
								// 						defaultValue={field.value}
								// 					>
								// 						<FormControl>
								// 							<SelectTrigger
								// 								className={cn(hasError && 'border-red-500')}
								// 							>
								// 								<SelectValue placeholder="Selecione uma opção" />
								// 							</SelectTrigger>
								// 						</FormControl>
								// 						<SelectContent>
								// 							{/* {column.config?.options?.map(
								// 								(option, index) => (
								// 									<SelectItem
								// 										key={index}
								// 										value={option.name}
								// 									>
								// 										{option.name}
								// 									</SelectItem>
								// 								),
								// 							)} */}
								// 						</SelectContent>
								// 					</Select>

								// 					{/* <FormMessage /> */}
								// 				</FormItem>
								// 			);
								// 		}}
								// 	/>
								// );

								return (
									<FormField
										key={column._id}
										control={form.control}
										name={column.slug}
										render={({ field }) => {
											const hasError = !!form.formState.errors[column.slug];
											return (
												<FormItem className="space-y-1">
													<FormLabel>{column.title}</FormLabel>
													<FormControl>
														<Input
															placeholder={column.title}
															className={cn(
																'focus-visible:ring-blue-300',
																hasError && 'border-red-500',
															)}
															{...field}
														/>
													</FormControl>
												</FormItem>
											);
										}}
									/>
								);
							})}
							{formHasError && (
								<div className="inline-flex">
									<span className="text-sm text-red-500">
										* os campos em vermelho são obrigatórios
									</span>
								</div>
							)}

							<div className="flex justify-end gap-4">
								<DialogClose asChild>
									<Button
										className="bg-transparent shadow-none border border-red-200 text-red-500 hover:bg-red-50"
										onClick={() => form.reset()}
									>
										Cancelar
									</Button>
								</DialogClose>
								<Button className="bg-blue-500 text-neutral-50 hover:bg-blue-600">
									{create_row_status === 'pending' && (
										<LoaderCircle className="w-6 h-6 animate-spin" />
									)}
									{!(create_row_status === 'pending') && <span>Confirmar</span>}
								</Button>
							</div>
						</form>
					</Form>
				)}
			</DialogContent>
		</Dialog>
	);
});

NewRow.displayName = 'NewRow';

export { NewRow };
