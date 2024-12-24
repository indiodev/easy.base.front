import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@components/ui/form';
import { Textarea } from '@components/ui/textarea';
import { cn } from '@libs/utils';
import { Column } from '@models/column.model';
import { useFormContext } from 'react-hook-form';

export function LongTextField({
	column,
	defaultValue,
}: {
	column: Partial<Column>;
	defaultValue?: unknown;
}) {
	const form = useFormContext();
	// form.setValue(String(column?.slug), defaultValue);

	return (
		<FormField
			key={column._id}
			control={form.control}
			name={column.slug || ''}
			defaultValue={defaultValue || ''}
			render={({ field }) => {
				const hasError = !!form.formState.errors[column.slug!];
				return (
					<FormItem>
						<FormLabel>{column.title}</FormLabel>
						<FormControl>
							<Textarea
								placeholder={column.title}
								className={cn(
									'focus-visible:ring-blue-300',
									hasError && 'border-red-500',
								)}
								{...field}
							/>
						</FormControl>
						<FormMessage className="text-right" />
					</FormItem>
				);
			}}
		/>
	);
}
