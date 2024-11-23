import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@components/ui/form';
import MultipleSelector, { Option } from '@components/ui/multiple-selector';
import { ROW_FIND_MANY_DEBOUNCE } from '@debounces/row/find-many.debounce';
import { cn } from '@libs/utils';
import { Column } from '@models/column.model';
import { LoaderCircle } from 'lucide-react';
import React from 'react';
import { useFormContext } from 'react-hook-form';

export function RelationalField({
	column,
	// defaultValue,
}: {
	column: Partial<Column>;
	defaultValue?: Option[];
}): React.ReactElement {
	const form = useFormContext();

	// const [options, setOptions] = React.useState<Option[]>(defaultValue || []);
	const [options, setOptions] = React.useState<Option[]>([]);

	const getOptions = React.useCallback(async () => {
		const response = await ROW_FIND_MANY_DEBOUNCE({
			collection: column.config!.relation!.collection!,
			columnId: column.config!.relation!.path!,
		});

		setOptions(response);
	}, [column.config]);

	React.useEffect(() => {
		getOptions();
	}, [getOptions]);

	return (
		<FormField
			control={form.control}
			name={column!.slug!}
			render={({ field }) => {
				const hasError = !!form.formState.errors[column!.slug!];
				return (
					<FormItem>
						<FormLabel>{column.title}</FormLabel>
						<FormControl>
							<MultipleSelector
								onChange={(options) => {
									const [option] = options;
									field.onChange(option.value);
								}}
								maxSelected={1}
								onSearch={async () => {
									return await ROW_FIND_MANY_DEBOUNCE({
										collection: column.config!.relation!.collection!,
										columnId: column.config!.relation!.path!,
									});
								}}
								defaultOptions={options}
								triggerSearchOnFocus
								placeholder={'Selecione '.concat(column.title!)}
								loadingIndicator={
									<div className="py-1 text-center text-lg leading-10 text-muted-foreground inline-flex items-center justify-center w-full space-x-6">
										<span>Buscando registros</span>
										<LoaderCircle className="w-5 h-5 animate-spin stroke-blue-500" />
									</div>
								}
								emptyIndicator={
									<p className="py-1 text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
										Nenhum registro encontrado
									</p>
								}
								className={cn(hasError && 'border-red-500')}
								// {...field}
							/>
						</FormControl>
						<FormMessage className="text-right" />
					</FormItem>
				);
			}}
		/>
	);
}
