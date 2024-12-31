/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Button } from '@components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@components/ui/dialog';
import { Form } from '@components/ui/form';

import { CollectionField } from '@components/global/field/collection';
import { ColumnOptionField } from '@components/global/field/column-option';
import { DateFormatField } from '@components/global/field/date';
import { DisplayField } from '@components/global/field/display';
import { FilterField } from '@components/global/field/filter';
import { LongTextDefaultField } from '@components/global/field/long-text';
import { MultipleField } from '@components/global/field/multiple';
import { PathField } from '@components/global/field/path';
import { RequiredField } from '@components/global/field/required';
import {
	ShortTextDefaultField,
	ShortTextFormatField,
} from '@components/global/field/short-text';
import { TitleField } from '@components/global/field/title';
import { TreeField } from '@components/global/field/tree';
import { TypeField } from '@components/global/field/type';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTable } from '@hooks/use-table';
import { COLUMN_TYPE } from '@models/base.model';
import { useColumnUpdateMutation } from '@mutation/column/update.mutation';
import { LoaderCircle } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router-dom';
import { Schema, Type } from './schema';

const EditField = React.forwardRef<
	React.ElementRef<typeof DialogTrigger>,
	React.ComponentPropsWithoutRef<typeof DialogTrigger>
>(({ ...props }, ref) => {
	const [open, setOpen] = React.useState(false);
	const params = useParams();

	const [searchParams, setSearchParams] = useSearchParams(
		new URLSearchParams(location?.search),
	);

	const { findOneColumn, updateColumn } = useTable();

	const column = findOneColumn({
		tableId: params.id!,
		columnId: searchParams?.get('field_id')!,
	});

	const form = useForm<Type>({
		resolver: zodResolver(Schema),
	});

	const { mutateAsync: update_column, status: update_column_status } =
		useColumnUpdateMutation({
			onSuccess(data) {
				updateColumn(params.id!, data);

				setSearchParams((state) => {
					state.delete('field_id');
					return state;
				});

				form.reset();
				setOpen((state) => !state);
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

	React.useEffect(() => {
		if (column?.config && column?.config) {
			form.reset({
				config: column?.config,
			});
		}
	}, [column, form]);

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

					<DialogDescription className="sr-only">
						Edite os valores de cada coluna
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						className="space-y-4 overflow-y-auto"
						onSubmit={onSubmit}
					>
						<TitleField defaultValue={column?.title} />
						<TypeField defaultValue={column?.type} />

						{form.watch('type') === COLUMN_TYPE.TREE && <TreeField />}

						{form.watch('type') === COLUMN_TYPE.DROPDOWN && (
							<ColumnOptionField defaultValue={column?.config?.options} />
						)}

						{form.watch('type') === COLUMN_TYPE.DATE && (
							<DateFormatField defaultValue={column?.config?.format} />
						)}

						{form.watch('type') === COLUMN_TYPE.SHORT_TEXT && (
							<ShortTextFormatField defaultValue={column?.config?.format} />
						)}

						{form.watch('type') === COLUMN_TYPE.SHORT_TEXT && (
							<ShortTextDefaultField defaultValue={column?.config?.default} />
						)}

						{form.watch('type') === COLUMN_TYPE.LONG_TEXT && (
							<LongTextDefaultField defaultValue={column?.config?.default} />
						)}

						{[COLUMN_TYPE.RELATIONAL, COLUMN_TYPE.MULTI_RELATIONAL].includes(
							form.watch('type'),
						) && (
							<>
								<CollectionField />
								<PathField />
							</>
						)}

						{[COLUMN_TYPE.DROPDOWN, COLUMN_TYPE.FILE].includes(
							form.watch('type'),
						) && <MultipleField defaultValue={column?.config?.multiple} />}

						{![COLUMN_TYPE.LIKE].includes(form.watch('type')) && (
							<FilterField defaultValue={Boolean(column?.config?.filter)} />
						)}

						<DisplayField defaultValue={Boolean(column?.config?.display)} />

						{![COLUMN_TYPE.LIKE, COLUMN_TYPE.RATING].includes(
							form.watch('type'),
						) && (
							<RequiredField defaultValue={Boolean(column?.config?.required)} />
						)}

						<div className="inline-flex flex-1 justify-end w-full">
							<Button
								className="bg-blue-600 hover:bg-blue-500"
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
			</DialogContent>
		</Dialog>
	);
});

export { EditField };
