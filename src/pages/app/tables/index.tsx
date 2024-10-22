import { Loading } from '@components/loading';
import { Button } from '@components/ui/button';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
} from '@components/ui/pagination';
import { Separator } from '@components/ui/separator';
import { useTableShowQuery } from '@query/table/show.query';
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from 'lucide-react';
import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Filter } from './filter';
import { Header } from './header';
import { Grid } from './layout/grid';
import { List } from './layout/list';

export function Tables(): React.ReactElement {
	const params = useParams();

	const [searchParams] = useSearchParams(new URLSearchParams(location?.search));

	const { data: table, status: table_status } = useTableShowQuery({
		id: params?.id || '',
	});

	const filterActive =
		searchParams.has('filtered') && searchParams.get('filtered') !== 'false';

	const layoutListActive =
		searchParams.has('view-layout') &&
		searchParams.get('view-layout') === 'list';

	const LayoutGridActive =
		searchParams.has('view-layout') &&
		searchParams.get('view-layout') === 'grid';

	if (table_status === 'pending') {
		return (
			<Loading className="flex justify-center items-center h-full flex-1" />
		);
	}

	if (table_status === 'error') {
		return (
			<section className="flex h-full flex-1 flex-col gap-4 w-full overflow-y-auto">
				<div className="flex-1 w-full border border-indigo-100 bg-indigo-50/50 p-10 rounded-lg shadow-md flex flex-col gap-6">
					<h2 className="text-3xl font-medium text-indigo-600">
						Tabela não encontrada
					</h2>
				</div>
			</section>
		);
	}

	return (
		<div className="flex-1 w-full border border-indigo-100 bg-indigo-50/50 p-10 rounded-lg shadow-md flex flex-col gap-6">
			<h2 className="text-3xl font-medium text-indigo-600">{table?.title}</h2>

			<Separator />

			<Header />

			<section className="inline-flex space-x-6">
				{filterActive && <Filter />}
				{layoutListActive && (
					<List
						columns={table?.columns}
						rows={table.rows}
					/>
				)}
				{LayoutGridActive && (
					<Grid
						columns={table?.columns}
						rows={table?.rows}
					/>
				)}
			</section>

			<section className="inline-flex w-full justify-end">
				<div className="inline-flex space-x-8 items-center">
					<label className="inline-block max-w-32 w-full">
						Página <strong>1</strong> de <strong>100</strong>
					</label>
					<Pagination className="justify-end">
						<PaginationContent>
							<PaginationItem>
								<Button
									variant="ghost"
									size="icon"
									className="border"
								>
									<ChevronsLeft />
								</Button>
							</PaginationItem>
							<PaginationItem>
								<Button
									variant="ghost"
									size="icon"
									className="border"
								>
									<ChevronLeft />
								</Button>
							</PaginationItem>
							<PaginationItem>
								<Button
									variant="ghost"
									size="icon"
									className="border"
								>
									<ChevronRight />
								</Button>
							</PaginationItem>
							<PaginationItem>
								<Button
									variant="ghost"
									size="icon"
									className="border"
								>
									<ChevronsRight />
								</Button>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			</section>
		</div>
	);
}
