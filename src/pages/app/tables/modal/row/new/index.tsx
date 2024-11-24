/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { DateField } from '@components/global/date';
import { DropdownField } from '@components/global/dropdown';
import { LongTextField } from '@components/global/long-text';
import { MultiRelationalField } from '@components/global/multi-relational';
import { RelationalField } from '@components/global/relational';
import { Loading } from '@components/loading';
import { Button } from '@components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@components/ui/dialog';
import { Form } from '@components/ui/form';
import { tanstack } from '@libs/tanstack';
import { cn } from '@libs/utils';
import { COLUMN_TYPE, QUERY } from '@models/base.model';
import { useRowCreateMutation } from '@mutation/row/new.mutation';
import { useColumnFindManyByTableIdQuery } from '@query/column/find-many-by-table-id';

import { LoaderCircle } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

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
				console.error(error);
			},
			onSuccess(data) {
				tanstack.refetchQueries({
					queryKey: [QUERY.TABLE_SHOW, params?.id!],
				});
				console.info(data);
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
			const isArray = Array.isArray(value);

			if (isArray) for (const v of value) payload.append(`${key}[]`, v);

			if (!isArray) payload.append(key, value);
		}

		create_row({ data: payload, id: params?.id! });
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
								if (column?.type === COLUMN_TYPE.RELATIONAL) {
									return (
										<RelationalField
											column={column}
											key={column._id}
										/>
									);
								}

								if (column?.type === COLUMN_TYPE.MULTI_RELATIONAL) {
									return (
										<MultiRelationalField
											column={column}
											key={column._id}
										/>
									);
								}

								if (column?.type === COLUMN_TYPE.DATE) {
									return (
										<DateField
											key={column._id}
											column={column}
										/>
									);
								}

								if (column?.type === COLUMN_TYPE.DROPDOWN)
									return (
										<DropdownField
											column={column}
											key={column._id}
										/>
									);

								if (column?.type === COLUMN_TYPE.LONG_TEXT)
									return (
										<LongTextField
											key={column._id}
											column={column}
										/>
									);

								if (column?.type === COLUMN_TYPE.SHORT_TEXT)
									return (
										<LongTextField
											key={column._id}
											column={column}
										/>
									);
							})}

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

export { NewRow };
