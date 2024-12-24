import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@components/ui/form';
import {
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@components/ui/select';
import { COLUMN_TYPE_LIST } from '@libs/constant';
import { COLUMN_TYPE } from '@models/base.model';
import { Select } from '@radix-ui/react-select';
import { useFormContext } from 'react-hook-form';

interface Props {
	defaultValue?: COLUMN_TYPE;
}
export function TypeField({ defaultValue = COLUMN_TYPE.SHORT_TEXT }: Props) {
	const form = useFormContext();
	// form.setValue('type', defaultValue);

	return (
		<FormField
			control={form.control}
			name="type"
			defaultValue={defaultValue}
			render={({ field }) => (
				<FormItem>
					<FormLabel>Tipo</FormLabel>
					<Select
						onValueChange={(value) => {
							if (value !== COLUMN_TYPE.DROPDOWN) {
								form.resetField('config.options');
							}

							field.onChange(value);
						}}
						defaultValue={field.value}
					>
						<FormControl>
							<SelectTrigger className="focus:ring-0 border border-blue-200 placeholder:text-blue-400 text-blue-600 focus-visible:ring-blue-600 bg-white">
								<SelectValue
									placeholder="Selecione um tipo para a coluna"
									className="placeholder:text-gray-100"
								/>
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							{COLUMN_TYPE_LIST.map((col) => (
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
