import { Button } from '@components/ui/button';
import {
	Dialog,
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
	FormMessage,
} from '@components/ui/form';

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
import { TypeField } from '@components/global/field/type';
import MultipleSelector from '@components/ui/multiple-selector';
import { zodResolver } from '@hookform/resolvers/zod';
import { COLUMN_TYPE } from '@models/base.model';
import { useColumnCreateMutation } from '@mutation/column/new.mutation';
import { LoaderCircle } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
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

	const { mutateAsync: create_column, status: create_column_status } =
		useColumnCreateMutation({
			onSuccess() {
				// tanstack.refetchQueries({
				// 	queryKey: [QUERY.TABLE_LIST],
				// });

				form.reset();
				setOpen((state) => !state);
				// REVER UMA FORMA MELHOR PARA QUE
				// SE LISTE A NOVA COLUNA NA TABELA
				location.reload();
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

					<DialogDescription className="sr-only">
						Adicionar nova coluna
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						className="space-y-4 overflow-y-auto"
						onSubmit={onSubmit}
					>
						<TitleField />
						<TypeField />

						{form.watch('type') === COLUMN_TYPE.DROPDOWN && (
							<ColumnOptionField />
						)}

						{form.watch('type') === COLUMN_TYPE.DATE && <DateFormatField />}

						{form.watch('type') === COLUMN_TYPE.SHORT_TEXT && (
							<ShortTextFormatField />
						)}

						{form.watch('type') === COLUMN_TYPE.SHORT_TEXT && (
							<ShortTextDefaultField />
						)}

						{form.watch('type') === COLUMN_TYPE.LONG_TEXT && (
							<LongTextDefaultField />
						)}

						{[COLUMN_TYPE.RELATIONAL, COLUMN_TYPE.MULTI_RELATIONAL].includes(
							form.watch('type'),
						) && (
							<>
								<CollectionField />
								<PathField />
							</>
						)}

						{COLUMN_TYPE.FILE && (
							<FormField
								control={form.control}
								name="config.accept"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tipos de arquivo aceitos</FormLabel>
										<FormControl>
											<MultipleSelector
												{...field}
												defaultOptions={[
													{
														label: 'PDF',
														value: 'pdf',
													},
													{
														label: 'JPEG',
														value: 'jpeg',
													},
													{
														label: 'PNG',
														value: 'png',
													},
												]}
												placeholder="Selecione um tipo de arquivo aceito"
												emptyIndicator={
													<p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
														Nenhuma opção encontrada
													</p>
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}
						{[COLUMN_TYPE.DROPDOWN, COLUMN_TYPE.FILE].includes(
							form.watch('type'),
						) && <MultipleField />}

						{![COLUMN_TYPE.LIKE].includes(form.watch('type')) && (
							<FilterField />
						)}

						<DisplayField />

						{![COLUMN_TYPE.LIKE, COLUMN_TYPE.RATING].includes(
							form.watch('type'),
						) && <RequiredField />}

						<div className="inline-flex flex-1 justify-end w-full">
							<Button
								className="bg-blue-600 hover:bg-blue-500"
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
