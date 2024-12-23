import { Button } from '@components/ui/button';
import { Calendar } from '@components/ui/calendar';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@components/ui/form';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@components/ui/popover';
import { cn } from '@libs/utils';
import { Column } from '@models/column.model';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

export function FilterDateField({ column }: { column: Partial<Column> }) {
	const form = useFormContext();

	const initial = column?.slug?.concat('-initial');
	const final = column?.slug?.concat('-final');

	return (
		<section className="flex flex-col space-y-4">
			<span className="text-sm font-medium">{column.title}</span>
			<div className="flex flex-col space-y-4">
				<FormField
					control={form.control}
					name={initial || ''}
					// defaultValue={defaultValue || ''}
					render={({ field }) => {
						const hasError = !!form.formState.errors[initial!];
						return (
							<FormItem className="flex flex-col w-full">
								<FormLabel>Inicio</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant={'outline'}
												className={cn(
													'w-full pl-3 text-left font-normal',
													!field?.value && 'text-muted-foreground',
													hasError && 'border-red-500',
												)}
											>
												{field?.value ? (
													format(
														field?.value,
														column?.config?.format || 'dd/MM/yyyy',
													)
												) : (
													<span>Selecione uma data</span>
												)}
												<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent
										className="w-auto p-0"
										align="start"
									>
										<Calendar
											locale={ptBR}
											mode="single"
											selected={field.value}
											onSelect={field.onChange}
											disabled={(date) =>
												date > new Date() || date < new Date('1900-01-01')
											}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
							</FormItem>
						);
					}}
				/>

				<FormField
					control={form.control}
					name={final || ''}
					// defaultValue={defaultValue || ''}
					render={({ field }) => {
						const hasError = !!form.formState.errors[final!];
						return (
							<FormItem className="flex flex-col w-full">
								<FormLabel>Fim</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant={'outline'}
												className={cn(
													'w-full pl-3 text-left font-normal',
													!field?.value && 'text-muted-foreground',
													hasError && 'border-red-500',
												)}
											>
												{field?.value ? (
													format(
														field?.value,
														column?.config?.format || 'dd/MM/yyyy',
													)
												) : (
													<span>Selecione uma data</span>
												)}
												<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent
										className="w-auto p-0"
										align="start"
									>
										<Calendar
											locale={ptBR}
											mode="single"
											selected={field.value}
											onSelect={field.onChange}
											disabled={(date) =>
												date > new Date() || date < new Date('1900-01-01')
											}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
							</FormItem>
						);
					}}
				/>
			</div>
		</section>
	);
}
