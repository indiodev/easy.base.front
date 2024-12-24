import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@components/ui/select';
import { COLUMN_DATE_FORMAT_LIST } from '@libs/constant';
import { COLUMN_FORMAT } from '@models/base.model';
import { useFormContext } from 'react-hook-form';

interface Props {
	defaultValue?: COLUMN_FORMAT;
}
export function DateFormatField({
	defaultValue = COLUMN_FORMAT['DD_MM_YYYY'],
}: Props) {
	const form = useFormContext();
	// form.setValue('config.format', defaultValue);
	return (
		<FormField
			control={form.control}
			name="config.format"
			defaultValue={defaultValue}
			render={({ field }) => (
				<FormItem>
					<FormLabel>Formato</FormLabel>
					<Select
						onValueChange={field.onChange}
						defaultValue={field.value}
					>
						<FormControl>
							<SelectTrigger className="border border-blue-200 placeholder:text-blue-400 text-blue-600 focus-visible:ring-blue-600 bg-white">
								<SelectValue
									placeholder="Selecione um tipo para a coluna"
									className="placeholder:text-gray-100"
								/>
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							{COLUMN_DATE_FORMAT_LIST.map((col) => (
								<SelectItem
									key={col.type}
									value={col.type}
								>
									{col.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<FormMessage className="text-right" />
				</FormItem>
			)}
		/>
	);
}
