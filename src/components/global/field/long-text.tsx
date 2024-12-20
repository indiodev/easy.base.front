import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@components/ui/form';
import { Textarea } from '@components/ui/textarea';
import { useFormContext } from 'react-hook-form';

export function LongTextDefaultField() {
	const form = useFormContext();
	return (
		<FormField
			control={form.control}
			name="config.default"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Valor padrão</FormLabel>
					<FormControl>
						<Textarea
							className=" border border-blue-200 placeholder:text-blue-400 text-blue-600 focus-visible:ring-blue-600 bg-white"
							{...field}
						/>
					</FormControl>
					<FormMessage className="text-right" />
				</FormItem>
			)}
		/>
	);
}
