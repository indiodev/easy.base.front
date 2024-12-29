import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@components/ui/form';
import MultipleSelector, { Option } from '@components/ui/multiple-selector';
import { useFormContext } from 'react-hook-form';

export function ColumnOptionField({
	defaultValue,
}: {
	defaultValue?: Option[];
}) {
	const form = useFormContext();

	console.log(defaultValue);

	return (
		<FormField
			control={form.control}
			name="config.options"
			defaultValue={defaultValue}
			// defaultValue={defaultValue}
			render={({ field }) => {
				// const hasError = !!form.formState.errors[column!.slug!];
				return (
					<FormItem>
						<FormLabel>Opções do dropdown</FormLabel>
						<FormControl>
							<MultipleSelector
								// onChange={(options) => {
								// 	const values = options.flatMap(
								// 		(option) => option.value,
								// 	);
								// 	field.onChange(values);
								// }}
								onChange={field.onChange}
								// onSearch={async () => {
								// 	return await ROW_FIND_MANY_DEBOUNCE({
								// 		collection: column.config!.relation!.collection!,
								// 		columnId: column.config!.relation!.path!,
								// 	});
								// }}
								defaultOptions={defaultValue}
								value={defaultValue}
								// options={options}
								creatable
								triggerSearchOnFocus
								placeholder="Escreva e adicione"
								// loadingIndicator={
								// 	<div className="py-1 text-center text-lg leading-10 text-muted-foreground inline-flex items-center justify-center w-full space-x-6">
								// 		<span>Buscando registros</span>
								// 		<LoaderCircle className="w-5 h-5 animate-spin stroke-blue-500" />
								// 	</div>
								// }
								emptyIndicator={null}
								// emptyIndicator={
								// 	<p className="py-1 text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
								// 		Nenhum registro encontrado
								// 	</p>
								// }
								// className={cn(hasError && 'border-red-500')}
							/>
						</FormControl>
						<FormMessage className="text-right" />
					</FormItem>
				);
			}}
		/>
	);
}
