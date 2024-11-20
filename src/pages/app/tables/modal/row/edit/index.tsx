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
import { cn } from '@libs/utils';
import { COLUMN_TYPE, QUERY } from '@models/base.model';
import { Column } from '@models/column.model';
import { useRowUpdateMutation } from '@mutation/row/update.mutation';

import { Option } from '@components/ui/multiple-selector';
import { LoaderCircle } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { DateField } from '../components/date';
import { DropdownField } from '../components/dropdown';
import { LongTextField } from '../components/long-text';
import { MultiRelationalField } from '../components/multi-relational';
import { RelationalField } from '../components/relational';
import { TextField } from '../components/text';

const EditRow = React.forwardRef<
	React.ElementRef<typeof DialogTrigger>,
	React.ComponentPropsWithoutRef<typeof DialogTrigger>
>(({ ...props }, ref) => {
	const location = useLocation();

	const field_state = location?.state?.row as {
		id: string;
		data: {
			path: string;
			value: unknown;
			column: Column;
		}[];
	};

	const [open, setOpen] = React.useState(false);
	const [searchParams, setSearchParams] = useSearchParams(
		new URLSearchParams(location.search),
	);

	const params = useParams();

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
			id: field_state.id,
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

					<DialogDescription className="sr-only">
						Edite os valores de cada coluna
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						className={cn(
							field_state?.data?.length > 5 && 'grid grid-cols-2 gap-4',
							!(field_state?.data?.length > 5) && 'flex flex-col gap-4',
						)}
						onSubmit={onSubmit}
					>
						{field_state?.data?.map(({ column, value }) => {
							if (column?.type === COLUMN_TYPE.RELATIONAL) {
								const options = Array.from(value as object[])
									.map((v) => {
										const field = Object.entries(v).find(
											([key]) =>
												key !== '_id' &&
												key !== 'createdAt' &&
												key !== 'updatedAt',
										);

										if (!field) return;

										return { label: field[1], value: field[0] } as Option;
									})
									.filter((item) => item !== undefined);

								return (
									<RelationalField
										key={column._id}
										column={column}
										defaultValue={options}
									/>
								);
							}

							if (column?.type === COLUMN_TYPE.MULTI_RELATIONAL) {
								const options = Array.from(value as object[])
									.map((v) => {
										const field = Object.entries(v).find(
											([key]) =>
												key !== '_id' &&
												key !== 'createdAt' &&
												key !== 'updatedAt',
										);

										if (!field) return;

										return { label: field[1], value: field[0] } as Option;
									})
									.filter((item) => item !== undefined);

								return (
									<MultiRelationalField
										key={column._id}
										column={column}
										defaultValue={options}
									/>
								);
							}

							if (column.type === COLUMN_TYPE.DATE) {
								return (
									<DateField
										key={column._id}
										column={column}
										defaultValue={value}
									/>
								);
							}

							if (column.type === COLUMN_TYPE.LONG_TEXT)
								return (
									<LongTextField
										key={column._id}
										column={column}
										defaultValue={value}
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
								<TextField
									key={column._id}
									column={column}
									defaultValue={value}
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

EditRow.displayName = 'EditRow';

export { EditRow };
