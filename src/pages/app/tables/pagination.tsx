/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Button } from '@components/ui/button';
import { PaginationContent, PaginationItem } from '@components/ui/pagination';
import { tanstack } from '@libs/tanstack';
import { QUERY } from '@models/base.model';
import { useTableShowQuery } from '@query/table/show.query';
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from 'lucide-react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';

export function Pagination() {
	const params = useParams();
	const location = useLocation();

	const [, setSearchParams] = useSearchParams(
		new URLSearchParams(location.search),
	);

	const { data: table, status: table_status } = useTableShowQuery({
		id: params?.id!,
	});

	if (table_status !== 'success') return null;

	return (
		<section className="inline-flex w-full justify-end">
			<div className="inline-flex space-x-8 items-center">
				<label className="inline-block max-w-32 w-full">
					Página <strong>{table?.meta?.page}</strong> de{' '}
					<strong>{table?.meta?.last_page}</strong>
				</label>
				<PaginationContent className="justify-end">
					{/* <PaginationContent> */}
					<PaginationItem>
						<Button
							variant="ghost"
							size="icon"
							className="border"
							onClick={() => {
								setSearchParams((state) => {
									state.set('page', '1');
									return state;
								});

								tanstack.refetchQueries({
									queryKey: [QUERY.TABLE_SHOW, params.id],
								});
							}}
						>
							<ChevronsLeft />
						</Button>
					</PaginationItem>
					<PaginationItem>
						<Button
							variant="ghost"
							size="icon"
							className="border"
							onClick={() => {
								if (table?.meta?.page > 1) {
									setSearchParams((state) => {
										state.set('page', String(table?.meta?.page - 1));
										return state;
									});

									tanstack.refetchQueries({
										queryKey: [QUERY.TABLE_SHOW, params.id],
									});
								}
							}}
						>
							<ChevronLeft />
						</Button>
					</PaginationItem>
					<PaginationItem>
						<Button
							variant="ghost"
							size="icon"
							className="border"
							onClick={() => {
								if (table?.meta?.page < table?.meta?.last_page) {
									setSearchParams((state) => {
										state.set('page', String(table?.meta?.page + 1));
										return state;
									});

									tanstack.refetchQueries({
										queryKey: [QUERY.TABLE_SHOW, params.id],
									});
								}
							}}
						>
							<ChevronRight />
						</Button>
					</PaginationItem>
					<PaginationItem>
						<Button
							variant="ghost"
							size="icon"
							className="border"
							onClick={() => {
								setSearchParams((state) => {
									state.set('page', String(table?.meta?.last_page));
									return state;
								});

								tanstack.refetchQueries({
									queryKey: [QUERY.TABLE_SHOW, params.id],
								});
							}}
						>
							<ChevronsRight />
						</Button>
					</PaginationItem>
					{/* </PaginationContent> */}
				</PaginationContent>
			</div>
		</section>
	);
}
