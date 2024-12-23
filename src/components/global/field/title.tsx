import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@components/ui/form';
import { Input } from '@components/ui/input';
import { useFormContext } from 'react-hook-form';

interface Props {
	defaultValue?: string;
}

export function TitleField({ defaultValue = '' }: Props) {
	const form = useFormContext();

	return (
		<FormField
			control={form.control}
			name="title"
			defaultValue={defaultValue}
			render={({ field }) => (
				<FormItem>
					<FormLabel>Nome</FormLabel>
					<FormControl>
						<Input
							className="focus-visible:ring-0 border border-blue-200 placeholder:text-blue-400 text-blue-600 focus-visible:ring-blue-600 bg-white"
							{...field}
						/>
					</FormControl>
					<FormMessage className="text-right" />
				</FormItem>
			)}
		/>
	);
}
