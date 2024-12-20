import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@components/ui/form';
import { Input } from '@components/ui/input';
import { cn } from '@libs/utils';
import { Column } from '@models/column.model';
import { useFormContext } from 'react-hook-form';

export function ShortTextField({
	column,
	defaultValue,
}: {
	column: Partial<Column>;
	defaultValue?: unknown;
}) {
	const form = useFormContext();

	return (
		<FormField
			key={column._id}
			control={form.control}
			name={column.slug || ''}
			defaultValue={defaultValue || ''}
			render={({ field }) => {
				const hasError = !!form.formState.errors[column.slug!];
				return (
					<FormItem className="space-y-1">
						<FormLabel>{column.title}</FormLabel>
						<FormControl>
							<Input
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
