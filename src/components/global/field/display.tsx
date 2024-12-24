import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
} from '@components/ui/form';
import { Switch } from '@components/ui/switch';
import { useFormContext } from 'react-hook-form';

interface Props {
	defaultValue?: boolean;
}
export function DisplayField({ defaultValue = false }: Props) {
	const form = useFormContext();
	// form.setValue('config.display', defaultValue);
	return (
		<FormField
			control={form.control}
			name="config.display"
			defaultValue={defaultValue}
			render={({ field }) => (
				<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
					<div className="space-y-0.5">
						<FormLabel>Exibir na lista</FormLabel>
						<FormDescription>
							Usar este campo para exibir na lista?
						</FormDescription>
					</div>
					<FormControl>
						<div className="inline-flex space-x-2">
							<span className="text-sm">Não</span>
							<Switch
								checked={field.value}
								onCheckedChange={field.onChange}
								aria-readonly
							/>
							<span className="text-sm">Sim</span>
						</div>
					</FormControl>
				</FormItem>
			)}
		/>
	);
}
