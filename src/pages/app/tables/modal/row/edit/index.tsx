/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Loading } from '@components/loading';
import { Button } from '@components/ui/button';
import { Calendar } from '@components/ui/calendar';
import {
	Dialog,
	DialogClose,
	DialogContent,
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
import { useRowUpdateMutation } from '@mutation/row/update.mutation';
import { useColumnFindManyByTableIdQuery } from '@query/column/find-many-by-table-id';
import { useRowShowQuery } from '@query/row/show.query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { CalendarIcon, LoaderCircle } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router-dom';
import { Relational } from '../field/relational';

const EditRow = React.forwardRef<
	React.ElementRef<typeof DialogTrigger>,
	React.ComponentPropsWithoutRef<typeof DialogTrigger>
>(({ ...props }, ref) => {
	const [open, setOpen] = React.useState(false);
	const [searchParams, setSearchParams] = useSearchParams(
		new URLSearchParams(location.search),
	);

	const params = useParams();

	const { data: row, status: row_status } = useRowShowQuery({
		tableId: params?.id || '',
		id: searchParams.get('row_id') || '',
	});

	const { data: columns, status: columns_status } =
		useColumnFindManyByTableIdQuery({
			tableId: params?.id || '',
		});

	const { mutateAsync: update_row, status: update_row_status } =
		useRowUpdateMutation({
			onError(error) {
				console.log(error);
			},
			onSuccess() {
				setOpen((state) => !state);
				tanstack.refetchQueries({
					queryKey: [QUERY.TABLE_SHOW, params.id],
				});
				tanstack.refetchQueries({
					queryKey: [QUERY.COLUMN_FIND_MANY_BY_TABLE_ID, params.id],
				});
				tanstack.refetchQueries({
					queryKey: [QUERY.ROW_SHOW, searchParams?.get('row_id'), params.id],
				});

				form.reset();
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

		update_row({
			data: payload,
			tableId: params?.id!,
			id: searchParams.get('row_id')!,
		});
	});

	const formHasError = Object.keys(form.formState.errors).length > 0;

	return (
		<Dialog
			modal
			open={open}
			onOpenChange={(o) => {
				form.reset();

				if (searchParams.has('row_id')) {
					setSearchParams((state) => {
						state.delete('row_id');
						return state;
					});
				}

				setOpen(o);
			}}
		>
			<DialogTrigger
				className="hidden"
				ref={ref}
				{...props}
			/>
			<DialogContent className="py-4 px-6 max-w-3xl w-full overflow-hidden max-h-[720px]">
				<DialogHeader>
					<DialogTitle className="text-lg font-medium">
						Editar registro
					</DialogTitle>
				</DialogHeader>

				{row_status === 'pending' && (
					<Loading className="flex justify-center items-center h-auto flex-1" />
				)}

				{row_status === 'success' && columns_status === 'success' && (
					<Form {...form}>
						<form
							className={cn(
								columns?.length > 5 && 'grid grid-cols-2 gap-4',
								!(columns?.length > 5) && 'flex flex-col gap-4',
							)}
							onSubmit={onSubmit}
						>
							{columns?.map((column) => {
								if (column.type === COLUMN_TYPE.DATE) {
									return (
										<FormField
											key={column._id}
											control={form.control}
											name={column.slug || ''}
											defaultValue={new Date(row?.value[column.slug]!)}
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
													</FormItem>
												);
											}}
										/>
									);
								}

								if (column.type === COLUMN_TYPE.LONG_TEXT)
									return (
										<FormField
											key={column._id}
											control={form.control}
											name={column.slug || ''}
											defaultValue={row?.value[column.slug] || ''}
											render={({ field }) => {
												const hasError = !!form.formState.errors[column.slug];
												return (
													<FormItem>
														<FormLabel>{column.title}</FormLabel>
														<FormControl>
															<Textarea
																placeholder={column.title}
																className={cn(
																	'focus-visible:ring-indigo-300',
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

								if (column.type === COLUMN_TYPE.DROPDOWN)
									return (
										<FormField
											key={column._id}
											control={form.control}
											name={column.slug || ''}
											defaultValue={row?.value[column.slug] || ''}
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
													</FormItem>
												);
											}}
										/>
									);

								if (column?.type === COLUMN_TYPE.RELATIONAL || column?.type === COLUMN_TYPE.MULTIRELATIONAL)
									return (
										<Relational
											key={column._id}
											column={column}
										/>
									);

								return (
									<FormField
										key={column._id}
										control={form.control}
										name={column.slug || ''}
										defaultValue={row?.value[column.slug] || ''}
										render={({ field }) => {
											const hasError = !!form.formState.errors[column.slug];
											return (
												<FormItem className="space-y-1">
													<FormLabel>{column.title}</FormLabel>
													<FormControl>
														<Input
															placeholder={column.title}
															className={cn(
																'focus-visible:ring-indigo-300',
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
								<Button className="bg-indigo-500 text-neutral-50 hover:bg-indigo-600">
									{update_row_status === 'pending' && (
										<LoaderCircle className="w-6 h-6 animate-spin" />
									)}
									{!(update_row_status === 'pending') && <span>Confirmar</span>}
								</Button>
							</div>
						</form>
					</Form>
				)}
			</DialogContent>
		</Dialog>
	);
});

EditRow.displayName = 'EditRow';

export { EditRow };
