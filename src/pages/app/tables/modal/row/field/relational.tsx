import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@components/ui/select';
import { cn } from '@libs/utils';
import { Column } from '@models/column.model';
import { useRowFindManyQuery } from '@query/row/find-many.query';
import React from 'react';
import { useFormContext } from 'react-hook-form';

// export const Relational = React.forwardRef<
//   React.ElementRef<typeof >
// >
export function Relational({
	column,
}: {
	column: Partial<Column>;
}): React.ReactElement {
	const form = useFormContext();
	console.log({ column });

	const { data: row_list, status: row_list_status } = useRowFindManyQuery({
		collection: column.config!.relation!.collection!,
		columnId: column.config!.relation!.visible!,
	});

	console.log({ row_list, row_list_status, column });

	return (
		<FormField
			// key={column._id}
			control={form.control}
			name={column!.slug!}
			render={({ field }) => {
				const hasError = !!form.formState.errors[column!.slug!];
				return (
					<FormItem>
						<FormLabel>{column.title} (Relacionamento)</FormLabel>
						<Select
							onValueChange={field.onChange}
							defaultValue={field.value}
						>
							<FormControl>
								<SelectTrigger className={cn(hasError && 'border-red-500')}>
									<SelectValue placeholder="Selecione uma opção" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								{row_list_status === 'success' &&
									row_list?.map(
										(option: { _id: string; [key: string]: string }) => {
											const field = Object.keys(option).find(
												(key) => key !== '_id',
											);

											if (!field) return null;

											return (
												<SelectItem
													key={option._id}
													value={option[field]}
												>
													{option[field]}
												</SelectItem>
											);
										},
									)}
							</SelectContent>
						</Select>

						{/* <FormMessage /> */}
					</FormItem>
				);
			}}
		/>
	);
}
