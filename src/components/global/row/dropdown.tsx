import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@components/ui/form';
import MultipleSelector, { Option } from '@components/ui/multiple-selector';
import { cn } from '@libs/utils';
import { Column } from '@models/column.model';
import { LoaderCircle } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

export function DropdownField({
	column,
	defaultValue,
}: {
	column: Partial<Column>;
	defaultValue?: Option[];
}) {
	console.log({ defaultValue });
	const form = useFormContext();
	const MAX_SELECTED = column?.config?.multiple
		? column?.config?.options?.length
		: 1;
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
								maxSelected={MAX_SELECTED}
								onChange={field.onChange}
								onSearch={async () => {
									return Promise.all(
										(column?.config?.options as Option[])?.filter(
											(option: Option) => option.value,
										) || [],
									);
								}}
								defaultOptions={defaultValue}
								// defaultOptions={options}
								// value={defaultValue}

								options={column?.config?.options}
								triggerSearchOnFocus
								placeholder={`Selecione um item de ${column.slug}`}
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
							/>
						</FormControl>
						<FormMessage className="text-right" />
					</FormItem>
				);
			}}
		/>
	);
}
