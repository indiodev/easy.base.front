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

export function CollectionField() {
	const form = useFormContext();

	const { tables } = useTable();

	return (
		<FormField
			control={form.control}
			name="config.relation.collection"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Tabela Base</FormLabel>
					<Select
						onValueChange={field.onChange}
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
							{tables
								// ?.filter((table) => table._id !== params.id)
								?.map((table) => (
									<SelectItem
										key={table._id}
										value={table.data_collection}
									>
										{table.title}
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
