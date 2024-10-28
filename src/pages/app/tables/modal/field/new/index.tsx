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

import { Separator } from '@components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { tanstack } from '@libs/tanstack';
import { COLUMN_TYPE, QUERY } from '@models/base.model';
import { useColumnCreateMutation } from '@mutation/column/new.mutation';
import { useTableListQuery } from '@query/table/list.query';
import { LoaderCircle, Plus, Trash } from 'lucide-react';
import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { Schema, Type } from './schema';
const NewField = React.forwardRef<
	React.ElementRef<typeof DialogTrigger>,
	React.ComponentPropsWithoutRef<typeof DialogTrigger>
>(({ ...props }, ref) => {
	const [open, setOpen] = React.useState(false);

	const params = useParams();

	const form = useForm<Type>({
		resolver: zodResolver(Schema),
	});

	const { data: table_list, status: table_list_status } = useTableListQuery();

	const { append, fields, remove } = useFieldArray({
		control: form.control,
		name: 'config.options',
	});

	const { mutateAsync: create_column, status: create_column_status } =
		useColumnCreateMutation({
			onSuccess() {
				tanstack.refetchQueries({
					queryKey: [QUERY.TABLE_SHOW, params.id],
				});

				tanstack.refetchQueries({
					queryKey: [QUERY.COLUMN_FIND_MANY_BY_TABLE_ID, params.id],
				});

				form.reset();
				setOpen((state) => !state);
			},
			onError(error) {
				console.error(error);
			},
		});

	const onSubmit = form.handleSubmit((data) => {
		create_column({
			column: {
				title: data.title,
				type: data.type,
				config: data.config,
			},
			tableId: params.id!,
		});
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
			<DialogContent className="py-4 px-6 max-w-3xl w-full overflow-hidden max-h-[720px] h-full">
				<DialogHeader>
					<DialogTitle className="text-lg font-medium">
						Adicionar nova coluna
					</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form
						className="space-y-4 overflow-y-auto"
						onSubmit={onSubmit}
					>
						<FormField
							control={form.control}
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
													{table_list_status === 'success'
														? table_list
																.filter((table) => table._id !== params.id)
																.map((table, index) => (
																	<SelectItem
																		key={index}
																		value={table.data_collection}
																	>
																		{table.title}
																	</SelectItem>
																))
														: table_list_status === 'pending'
															? `Carregando`
															: `Indisponivel`}
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
													{form.watch('config.relation.collection') &&
													table_list
														? table_list
																.find(
																	(table) =>
																		table.data_collection ===
																		form.watch('config.relation.collection'),
																)
																?.columns.map((column) => (
																	<SelectItem
																		key={column._id}
																		value={column._id}
																	>
																		{column.title}
																	</SelectItem>
																))
														: `Indisponivel`}
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
							defaultValue={form.watch('config.filter')}
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
							defaultValue={form.watch('config.display')}
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
							defaultValue={form.watch('config.required')}
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
									<div className="space-y-0.5">
										<FormLabel>Obrigatório</FormLabel>
										<FormDescription>Este campo é obrigatório?</FormDescription>
									</div>
									<FormControl>
										<div className="inline-flex space-x-2">
											<span className="text-sm">Não</span>
											<Switch
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
								disabled={create_column_status === 'pending'}
							>
								{create_column_status === 'pending' && (
									<LoaderCircle className="w-6 h-6 animate-spin" />
								)}
								{!(create_column_status === 'pending') && (
									<span>Adicionar</span>
								)}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
});

NewField.displayName = 'NewField';

export { NewField };
