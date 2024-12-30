import { Option } from '@components/ui/expansion/multiple-selector';
import {
	MultiSelector,
	MultiSelectorContent,
	MultiSelectorInput,
	MultiSelectorItem,
	MultiSelectorList,
	MultiSelectorTrigger,
} from '@components/ui/extension/multi-select';
import {
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@components/ui/form';
import { Column } from '@models/column.model';
import { useFormContext } from 'react-hook-form';

export function DropdownField({
	column,
	defaultValue,
}: {
	column: Partial<Column>;
	defaultValue?: Option[];
}) {
	const form = useFormContext();
	// const MAX_SELECTED = column?.config?.multiple
	// 	? column?.config?.options?.length
	// 	: 1;

	return (
		<FormField
			control={form.control}
			name={column.slug!}
			defaultValue={defaultValue ?? []}
			render={({ field }) => {
				// const hasError = !!form.formState.errors[column!.slug!];

				return (
					<FormItem className="w-full">
						<FormLabel>{column?.title}</FormLabel>
						<MultiSelector
							loop
							onValuesChange={field.onChange}
							values={field.value}
							// className={cn(hasError && 'border-red-500')}
						>
							<MultiSelectorTrigger>
								<MultiSelectorInput placeholder={`Selecione opção`} />
							</MultiSelectorTrigger>
							<MultiSelectorContent>
								<MultiSelectorList>
									{column?.config?.options?.map((option) => (
										<MultiSelectorItem
											key={option.value}
											value={option.value}
										>
											<span>{option.label}</span>
										</MultiSelectorItem>
									))}
								</MultiSelectorList>
							</MultiSelectorContent>
						</MultiSelector>
						<FormMessage className="text-right" />
					</FormItem>
				);
			}}
		/>
	);
}
