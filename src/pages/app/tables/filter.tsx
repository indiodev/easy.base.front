import { Button } from '@components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@components/ui/form';
import { Input } from '@components/ui/input';
import { tanstack } from '@libs/tanstack';
import { QUERY } from '@models/base.model';
import { useColumnFindManyByTableIdQuery } from '@query/column/find-many-by-table-id';
import { Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router-dom';

export function Filter() {
	const params = useParams();

	const [searchParams, setSearchParams] = useSearchParams(
		new URLSearchParams(location.search),
	);

	const { data: columns, status: columns_status } =
		useColumnFindManyByTableIdQuery({
			tableId: params?.id || '',
		});

	const form = useForm();

	const onSubmit = form.handleSubmit((data) => {
		const payload = Object.entries(data).filter(([, value]) => value !== '');

		for (const [key, value] of payload) {
			setSearchParams((state) => {
				state.set(key, value);
				return state;
			});
		}

		tanstack.refetchQueries({
			queryKey: [QUERY.TABLE_SHOW, params.id],
		});
	});

	return (
		<Form {...form}>
			<section className="flex flex-col space-y-2 p-4 max-w-xs w-full bg-blue-100/30 animate-fade-in-left rounded-lg">
				<h2 className="text-lg font-semibold text-blue-600">Filtros</h2>
				<form
					className="flex flex-col space-y-3 h-auto"
					onSubmit={onSubmit}
				>
					{columns_status === 'success' &&
						columns?.map(
							(col) =>
								col?.config?.filter && (
									<FormField
										key={col.slug}
										control={form.control}
										name={col.slug}
										defaultValue={searchParams.get(col.slug) || ''}
										render={({ field }) => (
											<FormItem>
												<FormLabel>{col.title}</FormLabel>
												<FormControl>
													<div className="inline-flex items-center relative max-w-96 w-full">
														<Search
															className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-blue-600"
															strokeWidth={1.5}
														/>
														<Input
															className="pl-9 border border-blue-200 placeholder:text-blue-400 text-blue-600 focus-visible:ring-blue-600 bg-white"
															onChange={(event) => {
																if (event.target.value === '') {
																	setSearchParams((state) => {
																		state.delete(col?.slug);
																		return state;
																	});

																	tanstack.refetchQueries({
																		queryKey: [QUERY.TABLE_SHOW, params.id],
																	});
																}

																field.onChange(event.target.value);
															}}
														/>
													</div>
												</FormControl>
											</FormItem>
										)}
									/>
								),
						)}

					<Button className="bg-blue-600 hover:bg-blue-500">Pesquisar</Button>
				</form>
			</section>
		</Form>
	);
}
