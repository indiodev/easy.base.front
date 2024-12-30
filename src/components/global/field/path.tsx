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
import { useTable } from '@hooks/use-table';
import { useFormContext } from 'react-hook-form';

export function PathField() {
	const form = useFormContext();

	const { findOneTableByCollection } = useTable();

	const collection = findOneTableByCollection(
		form.watch('config.relation.collection'),
	);

	return (
		<FormField
			control={form.control}
			name="config.relation.path"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Coluna exibida</FormLabel>
					<Select
						onValueChange={(value) => {
							const column = collection?.columns.find((c) => c._id === value);

							field.onChange(value);
							form.setValue('config.relation.slug', column!.slug!);
						}}
						defaultValue={field.value}
					>
						<FormControl>
							<SelectTrigger className="border border-blue-200 placeholder:text-blue-400 text-blue-600 focus-visible:ring-blue-600 bg-white">
								<SelectValue
									placeholder="Selecione uma tabela para relacionar"
									className="placeholder:text-gray-100"
								/>
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							{form.watch('config.relation.collection') &&
								collection?.columns.map((column) => (
									<SelectItem
										key={column._id}
										value={column._id}
									>
										{column.title}
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
