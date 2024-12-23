import { Button } from '@components/ui/button';
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@components/ui/form';
import { Input } from '@components/ui/input';
import { Separator } from '@components/ui/separator';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';

export function ColumnOptionField() {
	const form = useFormContext();

	const { append, fields, remove } = useFieldArray({
		control: form.control,
		name: 'config.options',
	});

	return (
		<section className="flex w-full flex-col space-y-2 py-4">
			<Separator />
			<div className="inline-flex justify-between items-start">
				<h2>Opções</h2>
				<Button
					type="button"
					className="bg-transparent hover:bg-transparent hover:text-blue-600 text-blue-600 shadow-none border-blue-500 border hover:border-blue-600 px-2 py-0 h-8"
					onClick={() => {
						append({
							name: '',
						});
					}}
				>
					<PlusIcon className="w-4 h-4" />
					<span>Adicionar</span>
				</Button>
			</div>

			<div className="h-full flex-1 overflow-y-auto space-y-2">
				{fields.map((field, index) => {
					return (
						<div className="px-2 inline-flex w-full gap-2 items-center">
							<FormField
								key={field.id}
								control={form.control}
								name={`config.options.${index}.name`}
								render={({ field }) => (
									<FormItem className="flex-1">
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

							<Button
								type="button"
								onClick={() => remove(index)}
								className="bg-transparent hover:bg-transparent border border-red-500 text-red-500 shadow-none px-2 py-0"
							>
								<TrashIcon className="w-4 h-4" />
							</Button>
						</div>
					);
				})}
			</div>
			<Separator />
		</section>
	);
}
