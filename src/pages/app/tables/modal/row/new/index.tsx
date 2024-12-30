/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { DateField } from '@components/global/row/date';
import { DropdownField } from '@components/global/row/dropdown';
import { FileField } from '@components/global/row/file';
import { LongTextField } from '@components/global/row/long-text';
import { MultiRelationalField } from '@components/global/row/multi-relational';
import { RelationalField } from '@components/global/row/relational';
import { ShortTextField } from '@components/global/row/short-text';
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
import { useQueryStore } from '@hooks/use-query';
import { useTable } from '@hooks/use-table';
import { tanstack } from '@libs/tanstack';
import { cn } from '@libs/utils';
import { COLUMN_TYPE, QUERY } from '@models/base.model';
import { useRowCreateMutation } from '@mutation/row/new.mutation';

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
	const { query } = useQueryStore();

	const { findManyColumnByTableId } = useTable();
	const columns = findManyColumnByTableId(params.id!);

	const hasMoreThanFiveColumns = columns?.length! > 5;

	const { mutateAsync: create_row, status: create_row_status } =
		useRowCreateMutation({
			onError(error) {
				console.error(error);
			},
			onSuccess(data) {
				tanstack.refetchQueries({
					queryKey: [QUERY.ROW_PAGINATE, params?.id!, query],
				});
				console.info({ data });
				setOpen(false);
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

		create_row({ data, id: params?.id! });
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
			<DialogContent className="py-4 px-6 max-w-4xl w-full overflow-hidden max-h-[720px]">
				<DialogHeader>
					<DialogTitle className="text-lg font-medium">
						Crie um registro
					</DialogTitle>

					<DialogDescription className="sr-only">
						Crie um registro
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={onSubmit}
						className="flex flex-col gap-4"
					>
						<div
							className={cn(
								hasMoreThanFiveColumns && 'grid grid-cols-2 gap-4',
								!hasMoreThanFiveColumns && 'flex flex-col gap-4',
							)}
						>
							{columns?.map((column) => {
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
										<ShortTextField
											key={column._id}
											column={column}
										/>
									);

								if (column?.type === COLUMN_TYPE.FILE) {
									return (
										<FileField
											key={column._id}
											column={column}
										/>
									);
								}
							})}
						</div>

						<div className="flex justify-end gap-4 w-full ">
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
			</DialogContent>
		</Dialog>
	);
});

export { NewRow };
