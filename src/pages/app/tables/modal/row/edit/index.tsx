/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
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
import { COLUMN_TYPE, MetaResponse, QUERY } from '@models/base.model';
import { useRowUpdateMutation } from '@mutation/row/update.mutation';

import { DateField } from '@components/global/date';
import { DropdownField } from '@components/global/dropdown';
import { LongTextField } from '@components/global/long-text';
import { MultiRelationalField } from '@components/global/multi-relational';
import { RelationalField } from '@components/global/relational';
import { ShortTextField } from '@components/global/short-text';
import { useQueryStore } from '@hooks/use-query';
import { cn } from '@libs/utils';
import { Row } from '@models/row.model';
import { Table } from '@models/table.model';
import { LoaderCircle } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';

const EditRow = React.forwardRef<
	React.ElementRef<typeof DialogTrigger>,
	React.ComponentPropsWithoutRef<typeof DialogTrigger>
>(({ ...props }, ref) => {
	const location = useLocation();
	const params = useParams();
	const { query } = useQueryStore();

	const [searchParams, setSearchParams] = useSearchParams(
		new URLSearchParams(location?.search),
	);

	const row_id = searchParams.get('row_id');

	const rows = tanstack.getQueryData<MetaResponse<Row['value'][]>>([
		QUERY.ROW_PAGINATE,
		params.id,
		query,
	])?.data;

	const columns = tanstack
		.getQueryData<Table[]>([QUERY.TABLE_LIST])
		?.find((table) => table._id === params.id)?.columns;

	const row = rows?.find((row) => row._id === row_id);

	const hasMoreThanFiveColumns = (columns?.length ?? 0) > 5;

	const [open, setOpen] = React.useState(false);

	const { mutateAsync: update_row, status: update_row_status } =
		useRowUpdateMutation({
			onError(error) {
				console.error(error);
			},
			onSuccess() {
				setOpen((state) => !state);
				tanstack.refetchQueries({
					queryKey: [QUERY.TABLE_SHOW, params.id],
				});

				if (searchParams.has('row_id')) {
					setSearchParams((state) => {
						state.delete('row_id');
						return state;
					});
				}

				form.reset();
			},
		});

	const form = useForm();

	const onSubmit = form.handleSubmit((data) => {
		for (const column of columns ?? []) {
			if (column.config?.required && !data[column.slug]) {
				form.setError(column.slug, {
					// message: 'Este campo é obrigatório',
					message: column?.title.concat(' é obrigatório'),
				});
			}
		}

		const entries = Object.entries(data);
		const existEmpty = entries.some(([, value]) => !value || value === '');

		if (existEmpty) return;

		const payload = new FormData();

		for (const [key, value] of entries) {
			const isArray = Array.isArray(value);

			if (isArray) for (const v of value) payload.append(`${key}[]`, v);

			if (!isArray) payload.append(key, value);
		}

		update_row({
			data: payload,
			tableId: params?.id!,
			id: row_id!,
		});
	});

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

					<DialogDescription className="sr-only">
						Edite os valores de cada coluna
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						className={cn(
							hasMoreThanFiveColumns && 'grid grid-cols-2 gap-4',
							!hasMoreThanFiveColumns && 'flex flex-col gap-4',
						)}
						onSubmit={onSubmit}
					>
						{columns?.map((column) => {
							let defaultValue = row?.[column.slug!];

							if (column?.type === COLUMN_TYPE.RELATIONAL) {
								if (!defaultValue) defaultValue = [];
								else
									defaultValue = [
										{
											label: defaultValue[column.config?.relation?.slug!],
											value: defaultValue._id,
										},
									];

								return (
									<RelationalField
										key={column._id}
										column={column}
										defaultValue={defaultValue}
									/>
								);
							}

							if (column?.type === COLUMN_TYPE.MULTI_RELATIONAL) {
								if (!defaultValue) defaultValue = [];
								else
									defaultValue = Array.from(defaultValue).map((c: any) => ({
										label: c?.[column.config?.relation?.slug!],
										value: c?._id,
									}));

								return (
									<MultiRelationalField
										key={column._id}
										column={column}
										defaultValue={defaultValue}
									/>
								);
							}

							if (column.type === COLUMN_TYPE.DATE) {
								return (
									<DateField
										key={column._id}
										column={column}
										defaultValue={defaultValue}
									/>
								);
							}

							if (column.type === COLUMN_TYPE.LONG_TEXT)
								return (
									<LongTextField
										key={column._id}
										column={column}
										defaultValue={defaultValue}
									/>
								);

							if (column.type === COLUMN_TYPE.DROPDOWN)
								return (
									<DropdownField
										key={column._id}
										column={column}
									/>
								);

							return (
								<ShortTextField
									key={column._id}
									column={column}
									defaultValue={row?.[column.slug!]}
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
								{update_row_status === 'pending' && (
									<LoaderCircle className="w-6 h-6 animate-spin" />
								)}
								{!(update_row_status === 'pending') && <span>Confirmar</span>}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
});

export { EditRow };
