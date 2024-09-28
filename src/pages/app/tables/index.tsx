import { Loading } from '@components/loading';
import { Separator } from '@components/ui/separator';
import { useTableShowQuery } from '@query/table/show.query';
import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Filter } from './filter';
import { Header } from './header';
import { Table } from './table';

export function Tables(): React.ReactElement {
	const params = useParams();

	const [searchParams] = useSearchParams(new URLSearchParams(location?.search));

	const { data: table, status: table_status } = useTableShowQuery({
		id: params?.id || '',
	});

	return (
		<section className="flex h-auto flex-1 flex-col gap-4">
			{table_status === 'pending' && (
				<Loading className="flex justify-center items-center h-screen flex-1" />
			)}

			{table_status === 'success' && (
				<React.Fragment>
					<div className="flex-1 w-full bg-neutral-50 p-10 rounded-lg shadow-md flex flex-col gap-6">
						<div className="inline-flex items-center justify-between">
							<h2 className="text-3xl font-medium text-indigo-600">
								{table?.title}
							</h2>
							{/* <Button
								className="bg-indigo-700 hover:bg-indigo-600 border border-transparent py-2 px-3 rounded-lg"
								disabled={table?.columns?.length === 0}
				
							>
								<Plus className="w-5 h-5" />
								<span>Adicionar</span>
							</Button> */}
						</div>

						<Separator />

						<Header />

						<section className="inline-flex space-x-6">
							{searchParams.has('filtered') && <Filter />}
							<Table
								columns={table?.columns}
								rows={table.rows}
							/>
						</section>
					</div>
				</React.Fragment>
			)}
		</section>
	);
}
