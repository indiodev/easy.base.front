/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Button } from '@components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@components/ui/dialog';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@components/ui/form';
import { Input } from '@components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@components/ui/select';
import { Switch } from '@components/ui/switch';
import {
	COLUMN_DATE_FORMAT_LIST,
	COLUMN_TEXT_SHORT_FORMAT_LIST,
	COLUMN_TYPE_LIST,
} from '@libs/constant';

import { Loading } from '@components/loading';
import { Separator } from '@components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { tanstack } from '@libs/tanstack';
import { COLUMN_FORMAT, COLUMN_TYPE, QUERY } from '@models/base.model';
import { Column } from '@models/column.model';
import { useColumnUpdateMutation } from '@mutation/column/update.mutation';
import { useColumnShowQuery } from '@query/column/show';
import { LoaderCircle, Plus, Trash } from 'lucide-react';
import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router-dom';
import { Schema, Type } from './schema';
import { useTableListQuery } from '@query/table/list.query';

const EditField = React.forwardRef<
	React.ElementRef<typeof DialogTrigger>,
	React.ComponentPropsWithoutRef<typeof DialogTrigger>
>(({ ...props }, ref) => {
	const [open, setOpen] = React.useState(false);
	const params = useParams();

	const [searchParams, setSearchParams] = useSearchParams(
		new URLSearchParams(location?.search),
	);

	const { data: table_list, status: table_list_status } = useTableListQuery();

	const { data: column, status: column_status } = useColumnShowQuery({
		id: searchParams?.get('field_id') || '',
		tableId: params.id || '',
	});

	const form = useForm<Type>({
		resolver: zodResolver(Schema),
	});

	const { append, fields, remove } = useFieldArray({
		control: form.control,
		name: 'config.options',
	});

	const { mutateAsync: update_column, status: update_column_status } =
		useColumnUpdateMutation({
			onSuccess() {
				setOpen((state) => !state);
				tanstack.refetchQueries({
					queryKey: [QUERY.TABLE_SHOW, params.id],
				});
				tanstack.refetchQueries({
					queryKey: [QUERY.COLUMN_FIND_MANY_BY_TABLE_ID, params.id],
				});
				tanstack.refetchQueries({
					queryKey: [
						QUERY.COLUMN_SHOW,
						searchParams?.get('field_id'),
						params.id,
					],
				});
				form.reset();
			},
			onError(error) {
				console.error(error);
			},
		});

	const onSubmit = form.handleSubmit((data) => {
		update_column({
			column: {
				_id: searchParams?.get('field_id')!,
				title: data.title,
				type: data.type,
				config: data.config,
			},
			tableId: params.id!,
		});
	});

	const setConfig = React.useCallback(
		(config: Column['config']) => {
			form.setValue('config.options', config.options);
			form.setValue('config.default', config.default);
			form.setValue('config.display', Boolean(config.display));
			form.setValue('config.filter', Boolean(config.filter));
			form.setValue('config.required', Boolean(config.required));
			form.setValue('config.format', config.format);
		},
		[form],
	);

	React.useEffect(() => {
		if (column_status === 'success') {
			setConfig(column.config);
		}
	}, [column, column_status, setConfig]);

	return (
		<Dialog
			modal
			open={open}
			onOpenChange={(o) => {
				form.reset();

				if (!o) {
					setSearchParams((state) => {
						state.delete('field_id');
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
						Editar coluna
					</DialogTitle>
				</DialogHeader>

				{column_status === 'pending' && (
					<Loading className="flex justify-center items-center h-auto flex-1" />
				)}

				{column_status === 'success' && (
					<Form {...form}>
						<form
							className="space-y-4 overflow-y-auto"
							onSubmit={onSubmit}
						>
							<FormField
								control={form.control}
								defaultValue={column?.title || ''}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nome</FormLabel>
										<FormControl>
											<Input
												className="focus-visible:ring-0 border border-indigo-200 placeholder:text-indigo-400 text-indigo-600 focus-visible:ring-indigo-600 bg-white"
												{...field}
											/>
										</FormControl>
										<FormMessage className="text-right" />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="type"
								defaultValue={column?.type || COLUMN_TYPE.SHORT_TEXT}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tipo</FormLabel>
										<Select
											onValueChange={(value) => {
												if (value !== COLUMN_TYPE.DROPDOWN) {
													form.resetField('config.options');
												}

												field.onChange(value);
											}}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className="focus:ring-0 border border-indigo-200 placeholder:text-indigo-400 text-indigo-600 focus-visible:ring-indigo-600 bg-white">
													<SelectValue
														placeholder="Selecione um tipo para a coluna"
														className="placeholder:text-gray-100"
													/>
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{COLUMN_TYPE_LIST.map((col) => (
													<SelectItem
														key={col.type}
														value={col.type}
													>
														{col.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>

										<FormMessage className="text-right" />
									</FormItem>
								)}
							/>

							{form.watch('type') === COLUMN_TYPE.DROPDOWN && (
								<section className="flex w-full flex-col space-y-2 py-4">
									<Separator />
									<div className="inline-flex justify-between items-start">
										<h2>Opções</h2>
										<Button
											type="button"
											className="bg-transparent hover:bg-transparent hover:text-indigo-600 text-indigo-600 shadow-none border-indigo-500 border hover:border-indigo-600 px-2 py-0 h-8"
											onClick={() => {
												append({
													name: '',
												});
											}}
										>
											<Plus className="w-4 h-4" />
											<span>Adicionar</span>
										</Button>
									</div>

									<div className="h-full flex-1 overflow-y-auto space-y-2">
										{fields.map((field, index) => {
											return (
												<div className="px-2 inline-flex w-full gap-2 items-center">
													<FormField
														key={field.id}
														control={form.control}
														name={`config.options.${index}.name`}
														render={({ field }) => (
															<FormItem className="flex-1">
																{/* <FormLabel>Opção {index + 1}</FormLabel> */}
																<FormControl>
																	<Input
																		className="focus-visible:ring-0 border border-indigo-200 placeholder:text-indigo-400 text-indigo-600 focus-visible:ring-indigo-600 bg-white"
																		{...field}
																	/>
																</FormControl>
																<FormMessage className="text-right" />
															</FormItem>
														)}
													/>

													<Button
														type="button"
														onClick={() => remove(index)}
														className="bg-transparent hover:bg-transparent border border-red-500 text-red-500 shadow-none px-2 py-0"
													>
														<Trash className="w-4 h-4" />
													</Button>
												</div>
											);
										})}
									</div>
									<Separator />
								</section>
							)}

							{form.watch('type') === COLUMN_TYPE.DATE && (
								<FormField
									control={form.control}
									defaultValue={
										column?.config?.format || COLUMN_FORMAT['AAAA-MM-DD']
									}
									name="config.format"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Formato</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger className="border border-indigo-200 placeholder:text-indigo-400 text-indigo-600 focus-visible:ring-indigo-600 bg-white">
														<SelectValue
															placeholder="Selecione um tipo para a coluna"
															className="placeholder:text-gray-100"
														/>
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{COLUMN_DATE_FORMAT_LIST.map((col) => (
														<SelectItem
															key={col.type}
															value={col.type}
														>
															{col.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>

											<FormMessage className="text-right" />
										</FormItem>
									)}
								/>
							)}

							{form.watch('type') === COLUMN_TYPE.SHORT_TEXT && (
								<FormField
									control={form.control}
									defaultValue={
										column?.config?.format || COLUMN_FORMAT.ALPHANUMERIC
									}
									name="config.format"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Formato</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger className="border border-indigo-200 placeholder:text-indigo-400 text-indigo-600 focus-visible:ring-indigo-600 bg-white">
														<SelectValue
															placeholder="Selecione um tipo para a coluna"
															className="placeholder:text-gray-100"
														/>
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{COLUMN_TEXT_SHORT_FORMAT_LIST.map((col) => (
														<SelectItem
															key={col.type}
															value={col.type}
														>
															{col.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>

											<FormMessage className="text-right" />
										</FormItem>
									)}
								/>
							)}

							{(form.watch('type') === COLUMN_TYPE.SHORT_TEXT ||
								form.watch('type') === COLUMN_TYPE.LONG_TEXT) && (
								<FormField
									control={form.control}
									defaultValue={column?.config?.default || ''}
									name="config.default"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Valor padrão</FormLabel>
											<FormControl>
												<Input
													className="border border-indigo-200 placeholder:text-indigo-400 text-indigo-600 focus-visible:ring-indigo-600 bg-white"
													{...field}
												/>
											</FormControl>
											<FormMessage className="text-right" />
										</FormItem>
									)}
								/>
							)}

							{form.watch('type') === COLUMN_TYPE.RELATIONAL && (
							<>
								<FormField
									control={form.control}
									name="config.relation.collection"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Tabela Base</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger className="border border-indigo-200 placeholder:text-indigo-400 text-indigo-600 focus-visible:ring-indigo-600 bg-white">
														<SelectValue
															placeholder="Selecione uma tabela para relacionar"
															className="placeholder:text-gray-100"
														/>
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{ table_list ?
														table_list.map((table, index) => (
															<SelectItem
																key={index}
																value={table.data_collection}
															>
																{table.title} 
															</SelectItem>
														))
														: (table_list_status === 'pending' ? `Carregando` : `Indisponivel`)
													}
												</SelectContent>
											</Select>

											<FormMessage className="text-right" />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="config.relation.visible"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Coluna exibida</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger className="border border-indigo-200 placeholder:text-indigo-400 text-indigo-600 focus-visible:ring-indigo-600 bg-white">
														<SelectValue
															placeholder="Selecione uma tabela para relacionar"
															className="placeholder:text-gray-100"
														/>
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{  form.watch('config.relation.collection') && table_list ?
														table_list
															.find((table) => table.data_collection === form.watch('config.relation.collection'))
															?.columns.map((column) => (
																<SelectItem key={column._id} value={column._id}>
																	{column.title}
																</SelectItem>
															))
														: ( `Indisponivel`)
													}
												</SelectContent>
											</Select>

											<FormMessage className="text-right" />
										</FormItem>
									)}
								/>
								</>
							)}


							<FormField
								control={form.control}
								name="config.filter"
								defaultValue={Boolean(column?.config?.filter)}
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
										<div className="space-y-0.5">
											<FormLabel>Usar no filtro</FormLabel>
											<FormDescription>
												Usar este campo para filtrar os dados?
											</FormDescription>
										</div>
										<FormControl>
											<div className="inline-flex space-x-2">
												<span className="text-sm">Não</span>
												<Switch
													defaultChecked={Boolean(column?.config?.filter)}
													checked={field.value}
													onCheckedChange={field.onChange}
													aria-readonly
												/>
												<span className="text-sm">Sim</span>
											</div>
										</FormControl>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="config.display"
								defaultValue={Boolean(column?.config?.display)}
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
										<div className="space-y-0.5">
											<FormLabel>Exibir na lista</FormLabel>
											<FormDescription>
												Usar este campo para exibir na lista?
											</FormDescription>
										</div>
										<FormControl>
											<div className="inline-flex space-x-2">
												<span className="text-sm">Não</span>
												<Switch
													defaultChecked={Boolean(column?.config?.display)}
													checked={field.value}
													onCheckedChange={field.onChange}
													aria-readonly
												/>
												<span className="text-sm">Sim</span>
											</div>
										</FormControl>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="config.required"
								defaultValue={Boolean(column?.config?.required)}
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
										<div className="space-y-0.5">
											<FormLabel>Obrigatório</FormLabel>
											<FormDescription>
												Este campo é obrigatório?
											</FormDescription>
										</div>
										<FormControl>
											<div className="inline-flex space-x-2">
												<span className="text-sm">Não</span>
												<Switch
													defaultChecked={Boolean(column?.config?.required)}
													checked={field.value}
													onCheckedChange={field.onChange}
													aria-readonly
												/>
												<span className="text-sm">Sim</span>
											</div>
										</FormControl>
									</FormItem>
								)}
							/>

							<div className="inline-flex flex-1 justify-end w-full">
								<Button
									className="bg-indigo-600 hover:bg-indigo-500"
									type="submit"
									disabled={update_column_status === 'pending'}
								>
									{update_column_status === 'pending' && (
										<LoaderCircle className="w-6 h-6 animate-spin" />
									)}
									{!(update_column_status === 'pending') && (
										<span>Atualizar</span>
									)}
								</Button>
							</div>
						</form>
					</Form>
				)}
			</DialogContent>
		</Dialog>
	);
});

export { EditField };
