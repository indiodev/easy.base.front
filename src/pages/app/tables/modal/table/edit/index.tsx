/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@components/ui/dialog';

import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { Button } from '@components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
} from '@components/ui/form';
import { Input } from '@components/ui/input';
import { Switch } from '@components/ui/switch';
import { Textarea } from '@components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { tanstack } from '@libs/tanstack';
import { cn } from '@libs/utils';
import { QUERY } from '@models/base.model';
import { Table } from '@models/table.model';
import { useTableUpdateMutation } from '@mutation/table/update.mutation';
import { LoaderCircle, PencilLine } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Schema, Type } from './schema';

const EditTable = React.forwardRef<
	React.ElementRef<typeof DialogTrigger>,
	React.ComponentPropsWithoutRef<typeof DialogTrigger>
>(({ ...props }, ref) => {
	const [open, setOpen] = React.useState(false);
	const params = useParams();

	const location = useLocation();
	const navigate = useNavigate();

	const table = tanstack
		.getQueryData<Table[]>([QUERY.TABLE_LIST])
		?.find((table) => table._id === params.id);

	const [fileImage, setFileImage] = React.useState<string | undefined>();

	const fileInputRef = React.useRef<HTMLInputElement>(null);

	const form = useForm<Type>({
		resolver: zodResolver(Schema),
		defaultValues: {
			title: table?.title || '',
			description: table?.description || '',
			// logo: table_state?.logo || '',
		},
	});

	const { mutateAsync: update_table, status: update_table_status } =
		useTableUpdateMutation({
			onError(error) {
				console.error(error);
			},
			onSuccess(data) {
				tanstack.refetchQueries({
					queryKey: [QUERY.TABLE_LIST],
				});
				navigate(
					{ pathname: location.pathname },
					{
						state: {
							...location.state,
							table: data,
						},
					},
				);
				setOpen((state) => !state);
			},
		});

	const onSubmit = form.handleSubmit(({ logo, ...data }) => {
		console.info({
			logo,
		});

		update_table({
			_id: table?._id,
			...table,
			...data,
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
			<DialogContent className="py-4 px-6">
				<DialogHeader>
					<DialogTitle className="text-lg font-medium">
						Editar tabela
					</DialogTitle>
					<DialogDescription className="sr-only">
						Editar tabela
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

						<div className="w-full flex-col gap-1 flex justify-center items-center">
							<Avatar className="rounded-lg shadow-sm border object-cover w-32 h-32 relative overflow-visible">
								{!fileImage && (
									<AvatarImage className="rounded-lg object-cover " />
								)}

								{fileImage && (
									<AvatarImage
										className="rounded-lg object-cover "
										src={fileImage}
									/>
								)}

								<AvatarFallback className="rounded-lg">Logo</AvatarFallback>
								<Button
									onClick={() => fileInputRef?.current?.click()}
									type="button"
									className="w-8 h-8 z-50 absolute bottom-1 right-1 rounded-full bg-gray-100 p-0 hover:bg-gray-100 border"
								>
									<PencilLine
										className="w-4 h-4 text-blue-500"
										strokeWidth={3}
									/>
								</Button>
							</Avatar>

							<Input
								type="file"
								ref={fileInputRef}
								onChange={(event) => {
									if (!event?.target?.files?.length) return;

									form.setValue('logo', event.target.files![0]);

									setFileImage(URL.createObjectURL(event.target.files![0]));
									form.clearErrors('logo');
								}}
								className="hidden bg-gray-50 focus-visible:ring-blue-500 focus-visible:ring-1"
							/>

							{form.formState.errors?.logo?.message && (
								<span className="text-red-500 text-xs">
									{form.formState.errors?.logo?.message}
								</span>
							)}
						</div>

						<FormField
							control={form.control}
							name="title"
							defaultValue={table?.title ?? ''}
							render={({ field }) => {
								const hasError = !!form.formState.errors.title;
								return (
									<FormItem className="space-y-1">
										<FormLabel>Nome</FormLabel>
										<FormControl>
											<Input
												defaultValue={table?.title ?? ''}
												placeholder="Insira o nome da tabela"
												className={cn(
													'focus-visible:ring-blue-300 focus-visible:ring-0',
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

						<FormField
							control={form.control}
							name="description"
							defaultValue={table?.description || ''}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Descrição</FormLabel>
									<FormControl>
										<Textarea
											defaultValue={table?.description || ''}
											placeholder="Uma descrição aqui"
											// className="resize-none"
											{...field}
										/>
									</FormControl>

									{/* <FormMessage /> */}
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="config.layout"
							// defaultValue={!!(table_state?.config?.layout === 'grid')}
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
									<div className="space-y-0.5">
										<FormLabel>Layout padrão da tabela</FormLabel>
										<FormDescription>
											Defina um layout padrão para a tabela
										</FormDescription>
									</div>
									<FormControl>
										<div className="inline-flex space-x-2">
											<span className="text-sm">Lista</span>
											<Switch
												defaultChecked={!!(table?.config?.layout === 'grid')}
												onCheckedChange={(value) => {
													// if (!value) {
													// 	form.setValue('config.layout', 'list');
													// } else form.setValue('config.layout', 'grid');

													field.onChange(value);
												}}
												aria-readonly
											/>
											<span className="text-sm">Grid</span>
										</div>
									</FormControl>
								</FormItem>
							)}
						/>

						<div className="inline-flex justify-end w-full gap-4 pt-4">
							<Button className="bg-blue-700 hover:bg-blue-600 border border-transparent py-2 px-3 rounded-lg text-neutral-50 max-w-40 w-full">
								{update_table_status === 'pending' && (
									<LoaderCircle className="w-6 h-6 animate-spin" />
								)}
								{!(update_table_status === 'pending') && <span>Atualizar</span>}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
});

EditTable.displayName = 'EditTable';

export { EditTable };
