import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@components/ui/form';
import MultipleSelector, { Option } from '@components/ui/multiple-selector';
import { USER_FIND_MANY_DEBOUNCE } from '@debounces/user/find-many.debouce';
import { cn } from '@libs/utils';
import { LoaderCircle } from 'lucide-react';
import React from 'react';
import { useFormContext } from 'react-hook-form';

export function AdministratorField({
	defaultValue,
}: {
	defaultValue?: Option[];
}): React.ReactElement {
	const form = useFormContext();

	const [options, setOptions] = React.useState<Option[]>(defaultValue || []);

	const getOptions = React.useCallback(async () => {
		const response = await USER_FIND_MANY_DEBOUNCE({});

		setOptions(response);
	}, []);

	React.useEffect(() => {
		getOptions();
	}, [getOptions]);

	return (
		<FormField
			control={form.control}
			name={'config.administrators'}
			defaultValue={defaultValue}
			render={({ field }) => {
				const hasError = !!form.formState.errors['config.administrators'];
				return (
					<FormItem>
						<FormLabel>Administradores</FormLabel>
						<FormControl>
							<MultipleSelector
								onChange={(options) => {
									const values = options.flatMap((option) => option.value);
									field.onChange(values);
								}}
								onSearch={async () => {
									return await USER_FIND_MANY_DEBOUNCE({});
								}}
								defaultOptions={options}
								value={defaultValue}
								options={options}
								triggerSearchOnFocus
								placeholder={'Selecione os administradores'}
								loadingIndicator={
									<div className="py-1 text-center text-lg leading-10 text-muted-foreground inline-flex items-center justify-center w-full space-x-6">
										<span>Buscando registros</span>
										<LoaderCircle className="w-5 h-5 animate-spin stroke-blue-500" />
									</div>
								}
								emptyIndicator={
									<p className="py-1 text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
										Nenhum registro encontrado
									</p>
								}
								className={cn(hasError && 'border-red-500')}
							/>
						</FormControl>
						<FormMessage className="text-right" />
					</FormItem>
				);
			}}
		/>
	);
}
