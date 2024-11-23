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
import { useFormContext } from 'react-hook-form';

export function DropdownField({ column }: { column: Partial<Column> }) {
	const form = useFormContext();

	return (
		<FormField
			key={column._id}
			control={form.control}
			name={column.slug || ''}
			// defaultValue={value || ''}
			render={({ field }) => {
				const hasError = !!form.formState.errors[column.slug!];
				return (
					<FormItem>
						<FormLabel>{column.title}</FormLabel>
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
								{column.config?.options?.map((option, index) => (
									<SelectItem
										key={index}
										value={option.name}
									>
										{option.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</FormItem>
				);
			}}
		/>
	);
}
